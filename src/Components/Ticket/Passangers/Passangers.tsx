import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import {
  getStoredPassengersFormData,
  getStoredPassengersSelection,
  savePassengersFormData,
  savePassengersSelection,
} from "../Order/helpers";
import type {
  StoredPassengerFormData,
  StoredPassengersFormData,
} from "../Order/helpers";
import type {
  PassengerSelectionItem,
  PassengersSelectionState,
  PassengerSelectionType,
} from "../Order/types";
import PassangersForm from "../PassangersForm";
import type {
  DocumentType,
  PassengerFormData,
  PassengerFormErrors,
} from "../PassangersForm/PassangersForm";
import PassangersTripDetails from "../PassangersTripDetails";
import "./assets/style.css";

interface PassengersLocationState {
  passengersSelection?: PassengersSelectionState;
}

interface PassengerFormState {
  data: PassengerFormData;
  errors: PassengerFormErrors;
  isReady: boolean;
  passenger: PassengerSelectionItem;
}

const documentTypeByPassengerType: Record<PassengerSelectionType, DocumentType> = {
  adult: "passport",
  child: "birth_certificate",
  child_without_seat: "birth_certificate",
};

const isDocumentType = (value: string): value is DocumentType =>
  value === "passport" || value === "birth_certificate";

const createEmptyPassengerData = (type: PassengerSelectionType): PassengerFormData => ({
  birthday: "",
  documentNumber: "",
  documentSeries: "",
  documentType: documentTypeByPassengerType[type],
  firstName: "",
  gender: "",
  isLimitedMobility: false,
  lastName: "",
  patronymic: "",
});

const restorePassengerData = (
  passenger: PassengerSelectionItem,
  storedData?: StoredPassengerFormData,
): PassengerFormData => {
  if (!storedData) {
    return createEmptyPassengerData(passenger.type);
  }

  return {
    birthday: storedData.birthday,
    documentNumber: storedData.documentNumber,
    documentSeries: storedData.documentSeries,
    documentType: isDocumentType(storedData.documentType)
      ? storedData.documentType
      : documentTypeByPassengerType[passenger.type],
    firstName: storedData.firstName,
    gender: storedData.gender === "male" || storedData.gender === "female" ? storedData.gender : "",
    isLimitedMobility: storedData.isLimitedMobility,
    lastName: storedData.lastName,
    patronymic: storedData.patronymic,
  };
};

const createPassengerFormStates = (
  passengers: PassengerSelectionItem[],
  storedForms?: StoredPassengersFormData,
): PassengerFormState[] =>
  passengers.map((passenger) => {
    const storedData = storedForms?.[passenger.id];

    return {
      data: restorePassengerData(passenger, storedData),
      errors: {},
      isReady: Boolean(storedData),
      passenger,
    };
  });

const isCyrillicName = (value: string): boolean => /^[А-ЯЁа-яё -]+$/.test(value.trim());

const validatePassengerData = (data: PassengerFormData): PassengerFormErrors => {
  const errors: PassengerFormErrors = {};

  if (!data.lastName.trim()) {
    errors.lastName = "Укажите фамилию";
  } else if (!isCyrillicName(data.lastName)) {
    errors.lastName = "Используйте кириллицу";
  }

  if (!data.firstName.trim()) {
    errors.firstName = "Укажите имя";
  } else if (!isCyrillicName(data.firstName)) {
    errors.firstName = "Используйте кириллицу";
  }

  if (data.patronymic.trim() && !isCyrillicName(data.patronymic)) {
    errors.patronymic = "Используйте кириллицу";
  }

  if (!data.gender) {
    errors.gender = "Выберите пол";
  }

  if (!data.birthday) {
    errors.birthday = "Укажите дату рождения";
  }

  if (data.documentType === "passport") {
    if (!/^\d{4}$/.test(data.documentSeries)) {
      errors.documentSeries = "Серия: 4 цифры";
    }

    if (!/^\d{6}$/.test(data.documentNumber)) {
      errors.documentNumber = "Номер: 6 цифр";
    }
  } else if (!/^[IVXLCDM]{1,6}-?[А-ЯЁ]{2}-?\d{6}$/i.test(data.documentNumber.trim())) {
    errors.documentNumber = "Номер свидетельства о рождении указан некорректно";
  }

  return errors;
};

const hasNoErrors = (errors: PassengerFormErrors): boolean => Object.keys(errors).length === 0;

function Passangers() {
  const { departureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const arrivalId = searchParams.get("arrivalId");
  const locationState = location.state as PassengersLocationState | null;
  const passengersSelection = useMemo(
    () => locationState?.passengersSelection ?? getStoredPassengersSelection(departureId, arrivalId),
    [arrivalId, departureId, locationState?.passengersSelection],
  );
  const storedPassengerForms = useMemo(
    () => getStoredPassengersFormData(departureId, arrivalId),
    [arrivalId, departureId],
  );
  const [passengerForms, setPassengerForms] = useState<PassengerFormState[]>(() =>
    createPassengerFormStates(passengersSelection?.passengers ?? [], storedPassengerForms),
  );
  const [openPassengerIds, setOpenPassengerIds] = useState<string[]>(
    passengersSelection?.passengers[0]?.id ? [passengersSelection.passengers[0].id] : [],
  );
  const allPassengersReady = passengerForms.length > 0 && passengerForms.every((form) => form.isReady);
  const seatsPath = departureId ? `/tickets/${departureId}/seats${location.search}` : "/tickets";

  useEffect(() => {
    if (passengersSelection && departureId) {
      savePassengersSelection(passengersSelection, departureId, arrivalId);
    }
  }, [arrivalId, departureId, passengersSelection]);

  const handleNextClick = () => {
    if (!allPassengersReady || !departureId || !passengersSelection) {
      return;
    }

    const formsData = passengerForms.reduce<StoredPassengersFormData>((accumulator, form) => {
      accumulator[form.passenger.id] = form.data;

      return accumulator;
    }, {});

    savePassengersSelection(passengersSelection, departureId, arrivalId);
    savePassengersFormData(formsData, departureId, arrivalId);

    navigate({
      pathname: `/tickets/${departureId}/payment`,
      search: location.search,
    }, {
      state: {
        passengersSelection,
      },
    });
  };

  const handlePassengerChange = (
    passengerId: string,
    field: keyof PassengerFormData,
    value: string | boolean,
  ) => {
    setPassengerForms((currentForms) =>
      currentForms.map((form) => {
        if (form.passenger.id !== passengerId) {
          return form;
        }

        const nextData = {
          ...form.data,
          [field]: value,
        };

        if (field === "documentType") {
          nextData.documentNumber = "";
          nextData.documentSeries = "";
        }

        return {
          ...form,
          data: nextData,
          errors: {
            ...form.errors,
            [field]: undefined,
          },
          isReady: false,
        };
      }),
    );
  };

  const openPassenger = (passengerId: string) => {
    setOpenPassengerIds((currentIds) =>
      currentIds.includes(passengerId) ? currentIds : [...currentIds, passengerId],
    );
  };

  const handlePassengerToggle = (passengerId: string) => {
    setOpenPassengerIds((currentIds) =>
      currentIds.includes(passengerId)
        ? currentIds.filter((currentId) => currentId !== passengerId)
        : [...currentIds, passengerId],
    );
  };

  const handlePassengerReadyCheck = (passengerId: string) => {
    const targetForm = passengerForms.find((form) => form.passenger.id === passengerId);

    if (!targetForm) {
      return;
    }

    const errors = validatePassengerData(targetForm.data);

    if (!hasNoErrors(errors)) {
      return;
    }

    setPassengerForms((currentForms) =>
      currentForms.map((form) =>
        form.passenger.id === passengerId ? {
          ...form,
          errors: {},
          isReady: true,
        } : form,
      ),
    );
  };

  const handlePassengerValidate = (passengerId: string) => {
    const targetForm = passengerForms.find((form) => form.passenger.id === passengerId);

    if (!targetForm) {
      return;
    }

    if (targetForm.isReady) {
      const currentIndex = passengerForms.findIndex(({ passenger }) => passenger.id === passengerId);
      const nextPassenger = passengerForms.slice(currentIndex + 1).find((form) => !form.isReady);

      if (nextPassenger) {
        openPassenger(nextPassenger.passenger.id);
      }

      return;
    }

    const errors = validatePassengerData(targetForm.data);
    const isReady = hasNoErrors(errors);

    setPassengerForms((currentForms) =>
      currentForms.map((form) =>
        form.passenger.id === passengerId ? {
          ...form,
          errors,
          isReady,
        } : form,
      ),
    );

    if (isReady) {
      const currentIndex = passengerForms.findIndex(({ passenger }) => passenger.id === passengerId);
      const nextPassenger = passengerForms.slice(currentIndex + 1).find((form) => !form.isReady);

      if (nextPassenger) {
        openPassenger(nextPassenger.passenger.id);
      }
    }
  };

  return (
    <main className="passangers-page">
      <div className="main-content passangers-page__content">
        {passengersSelection && passengersSelection.passengers.length ? (
          <PassangersTripDetails selection={passengersSelection} />
        ) : (
          <div className="passangers-page__details-placeholder" aria-hidden="true" />
        )}

        <section className="passangers-page__workspace">
          {!passengersSelection || !passengersSelection.passengers.length ? (
            <div className="passangers-page__empty">
              <h1 className="passangers-page__title">Пассажиры</h1>
              <p>Сначала выберите места.</p>
              <Link className="btn primary passangers-page__back-link" to={seatsPath}>
                Вернуться к выбору мест
              </Link>
            </div>
          ) : (
            <>
              <h1 className="passangers-page__title">Пассажиры</h1>
              <div className="passangers-page__forms">
                {passengerForms.map((form, index) => (
                  <PassangersForm
                    key={form.passenger.id}
                    data={form.data}
                    errors={form.errors}
                    isOpen={openPassengerIds.includes(form.passenger.id)}
                    isReady={form.isReady}
                    number={index + 1}
                    passenger={form.passenger}
                    onChange={(field, value) => handlePassengerChange(form.passenger.id, field, value)}
                    onFinalFieldBlur={() => handlePassengerReadyCheck(form.passenger.id)}
                    onToggle={() => handlePassengerToggle(form.passenger.id)}
                    onValidate={() => handlePassengerValidate(form.passenger.id)}
                  />
                ))}
              </div>

              <button className="passangers-page__add" type="button" disabled>
                Добавить пассажира
              </button>

              <div className="passangers-page__next-wrapper">
                <button
                  className="btn primary passangers-page__next"
                  type="button"
                  disabled={!allPassengersReady}
                  onClick={handleNextClick}
                >
                  Далее
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default Passangers
