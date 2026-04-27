import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import {
  getStoredPassengersFormData,
  getStoredPassengersSelection,
  getStoredPaymentFormData,
  savePaymentFormData,
} from "../Order/helpers";
import type {
  StoredPaymentFormData,
  StoredPassengersFormData,
} from "../Order/helpers";
import type { PassengersSelectionState } from "../Order/types";
import PassangersTripDetails from "../PassangersTripDetails";
import "./assets/style.css";

interface PaymentLocationState {
  passengersSelection?: PassengersSelectionState;
}

type PaymentFormData = StoredPaymentFormData;

type PaymentFormErrors = Partial<Record<keyof PaymentFormData, string>>;

const emptyPaymentForm: PaymentFormData = {
  email: "",
  firstName: "",
  lastName: "",
  patronymic: "",
  paymentMethod: "",
  phone: "",
};

const isCyrillicName = (value: string): boolean => /^[А-ЯЁа-яё -]+$/.test(value.trim());

const getFirstPassengerData = (
  selection?: PassengersSelectionState,
  passengerForms?: StoredPassengersFormData,
): Partial<PaymentFormData> => {
  const firstPassengerId = selection?.passengers[0]?.id;
  const firstPassenger = firstPassengerId ? passengerForms?.[firstPassengerId] : undefined;

  if (!firstPassenger) {
    return {};
  }

  return {
    firstName: firstPassenger.firstName,
    lastName: firstPassenger.lastName,
    patronymic: firstPassenger.patronymic,
  };
};

const getInitialPaymentForm = (
  storedPayment?: StoredPaymentFormData,
  selection?: PassengersSelectionState,
  passengerForms?: StoredPassengersFormData,
): PaymentFormData => {
  if (storedPayment) {
    return storedPayment;
  }

  return {
    ...emptyPaymentForm,
    ...getFirstPassengerData(selection, passengerForms),
  };
};

const validatePaymentForm = (data: PaymentFormData): PaymentFormErrors => {
  const errors: PaymentFormErrors = {};

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

  if (!/^\+?[0-9 ()-]{10,20}$/.test(data.phone.trim())) {
    errors.phone = "Укажите корректный телефон";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Укажите корректный e-mail";
  }

  if (!data.paymentMethod) {
    errors.paymentMethod = "Выберите способ оплаты";
  }

  return errors;
};

const hasNoErrors = (errors: PaymentFormErrors): boolean => Object.keys(errors).length === 0;

function Payment() {
  const { departureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const arrivalId = searchParams.get("arrivalId");
  const locationState = location.state as PaymentLocationState | null;
  const passengersSelection = useMemo(
    () => locationState?.passengersSelection ?? getStoredPassengersSelection(departureId, arrivalId),
    [arrivalId, departureId, locationState?.passengersSelection],
  );
  const storedPassengerForms = useMemo(
    () => getStoredPassengersFormData(departureId, arrivalId),
    [arrivalId, departureId],
  );
  const storedPaymentForm = useMemo(
    () => getStoredPaymentFormData(departureId, arrivalId),
    [arrivalId, departureId],
  );
  const [formData, setFormData] = useState<PaymentFormData>(() =>
    getInitialPaymentForm(storedPaymentForm, passengersSelection, storedPassengerForms),
  );
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const seatsPath = departureId ? `/tickets/${departureId}/seats${location.search}` : "/tickets";

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validatePaymentForm(formData);

    setErrors(nextErrors);

    if (!hasNoErrors(nextErrors)) {
      return;
    }

    savePaymentFormData(formData, departureId, arrivalId);

    if (departureId) {
      navigate({
        pathname: `/tickets/${departureId}/order`,
        search: location.search,
      }, {
        state: {
          passengersSelection,
        },
      });
    }
  };

  return (
    <main className="payment-page">
      <div className="main-content payment-page__content">
        {passengersSelection && passengersSelection.passengers.length ? (
          <PassangersTripDetails selection={passengersSelection} />
        ) : (
          <div className="payment-page__details-placeholder" aria-hidden="true" />
        )}

        <section className="payment-page__workspace">
          {!passengersSelection || !passengersSelection.passengers.length ? (
            <div className="payment-page__empty">
              <h1 className="payment-page__title">Оплата</h1>
              <p>Сначала заполните данные пассажиров.</p>
              <Link className="btn primary payment-page__back-link" to={seatsPath}>
                Вернуться к выбору мест
              </Link>
            </div>
          ) : (
            <>
              <form id="payment-form" className="payment-form" onSubmit={handleSubmit}>
                <section className="payment-form__section">
                  <h1 className="payment-form__section-title">Персональные данные</h1>

                  <div className="payment-form__fields payment-form__fields_name">
                    <label className="payment-form__field">
                      <span className="payment-form__label">Фамилия</span>
                      <input
                        className="payment-form__input"
                        type="text"
                        value={formData.lastName}
                        aria-invalid={Boolean(errors.lastName)}
                        onChange={(event) => handleInputChange("lastName", event.target.value)}
                      />
                      {errors.lastName ? <span className="payment-form__error">{errors.lastName}</span> : null}
                    </label>

                    <label className="payment-form__field">
                      <span className="payment-form__label">Имя</span>
                      <input
                        className="payment-form__input"
                        type="text"
                        value={formData.firstName}
                        aria-invalid={Boolean(errors.firstName)}
                        onChange={(event) => handleInputChange("firstName", event.target.value)}
                      />
                      {errors.firstName ? <span className="payment-form__error">{errors.firstName}</span> : null}
                    </label>

                    <label className="payment-form__field">
                      <span className="payment-form__label">Отчество</span>
                      <input
                        className="payment-form__input"
                        type="text"
                        value={formData.patronymic}
                        aria-invalid={Boolean(errors.patronymic)}
                        onChange={(event) => handleInputChange("patronymic", event.target.value)}
                      />
                      {errors.patronymic ? <span className="payment-form__error">{errors.patronymic}</span> : null}
                    </label>
                  </div>

                  <div className="payment-form__fields payment-form__fields_contacts">
                    <label className="payment-form__field payment-form__field_contact">
                      <span className="payment-form__label">Контактный телефон</span>
                      <input
                        className="payment-form__input"
                        type="tel"
                        value={formData.phone}
                        placeholder="+7 ___ ___ __ __"
                        aria-invalid={Boolean(errors.phone)}
                        onChange={(event) => handleInputChange("phone", event.target.value)}
                      />
                      {errors.phone ? <span className="payment-form__error">{errors.phone}</span> : null}
                    </label>

                    <label className="payment-form__field payment-form__field_contact">
                      <span className="payment-form__label">E-mail</span>
                      <input
                        className="payment-form__input"
                        type="email"
                        value={formData.email}
                        placeholder="inbox@gmail.ru"
                        aria-invalid={Boolean(errors.email)}
                        onChange={(event) => handleInputChange("email", event.target.value)}
                      />
                      {errors.email ? <span className="payment-form__error">{errors.email}</span> : null}
                    </label>
                  </div>
                </section>

                <section className="payment-form__section payment-form__section_payment">
                  <h2 className="payment-form__section-title">Способ оплаты</h2>

                  <fieldset className="payment-form__methods">
                    <legend className="payment-form__methods-legend">Выберите способ оплаты</legend>

                    <label className="payment-form__method">
                      <input
                        className="payment-form__radio"
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === "online"}
                        onChange={() => handleInputChange("paymentMethod", "online")}
                      />
                      <span className="payment-form__radio-box" aria-hidden="true" />
                      <span className="payment-form__method-title">Онлайн</span>
                    </label>

                    <div className="payment-form__online-options">
                      <span>Банковской картой</span>
                      <span>PayPal</span>
                      <span>Visa QIWI Wallet</span>
                    </div>

                    <label className="payment-form__method payment-form__method_cash">
                      <input
                        className="payment-form__radio"
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={() => handleInputChange("paymentMethod", "cash")}
                      />
                      <span className="payment-form__radio-box" aria-hidden="true" />
                      <span className="payment-form__method-title">Наличными</span>
                    </label>

                    {errors.paymentMethod ? (
                      <span className="payment-form__error payment-form__error_method">{errors.paymentMethod}</span>
                    ) : null}
                  </fieldset>
                </section>
              </form>

              <div className="payment-form__button">
                <button className="btn primary payment-form__submit" type="submit" form="payment-form">
                  Купить билеты
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default Payment
