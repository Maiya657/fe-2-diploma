import type { ChangeEvent } from "react";
import classNames from "classnames";
import DateInput from "../../DateInput";
import type { PassengerSelectionItem, PassengerSelectionType } from "../Order/types";
import "./assets/style.css";

export type GenderValue = "male" | "female" | "";
export type DocumentType = "passport" | "birth_certificate";

export interface PassengerFormData {
  birthday: string;
  documentNumber: string;
  documentSeries: string;
  documentType: DocumentType;
  firstName: string;
  gender: GenderValue;
  isLimitedMobility: boolean;
  lastName: string;
  patronymic: string;
}

export type PassengerFormErrors = Partial<Record<keyof PassengerFormData, string>>;

interface Props {
  data: PassengerFormData;
  errors: PassengerFormErrors;
  isOpen: boolean;
  isReady: boolean;
  number: number;
  passenger: PassengerSelectionItem;
  onChange: (field: keyof PassengerFormData, value: string | boolean) => void;
  onFinalFieldBlur: () => void;
  onToggle: () => void;
  onValidate: () => void;
}

const passengerTypeLabels: Record<PassengerSelectionType, string> = {
  adult: "Взрослый",
  child: "Детский",
  child_without_seat: "Детский без места",
};

const getSeatDescription = (passenger: PassengerSelectionItem): string => {
  const parts = [];

  if (passenger.departureSeat) {
    parts.push(`туда: вагон ${passenger.departureSeat.coachLabel}, место ${passenger.departureSeat.seatIndex}`);
  }

  if (passenger.arrivalSeat) {
    parts.push(`обратно: вагон ${passenger.arrivalSeat.coachLabel}, место ${passenger.arrivalSeat.seatIndex}`);
  }

  return parts.join("; ");
};

const hasErrors = (errors: PassengerFormErrors): boolean =>
  Object.values(errors).some(Boolean);

const getFooterErrorMessage = (
  data: PassengerFormData,
  errors: PassengerFormErrors,
): { example?: string; text: string } => {
  if (data.documentType === "birth_certificate" && errors.documentNumber) {
    return {
      example: "Пример: VIII-ЫП-123456",
      text: "Номер свидетельства о рождении указан некорректно",
    };
  }

  if (errors.documentSeries || errors.documentNumber) {
    return {
      text: "Серия или номер документа указаны некорректно",
    };
  }

  return {
    text: "Проверьте правильность заполнения полей",
  };
};

function PassangersForm({
  data,
  errors,
  isOpen,
  isReady,
  number,
  passenger,
  onChange,
  onFinalFieldBlur,
  onToggle,
  onValidate,
}: Props) {
  const seatDescription = getSeatDescription(passenger);
  const isBirthCertificate = data.documentType === "birth_certificate";
  const hasFormErrors = hasErrors(errors);
  const footerErrorMessage = getFooterErrorMessage(data, errors);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;

    onChange(name as keyof PassengerFormData, value);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange("isLimitedMobility", event.currentTarget.checked);
  };

  return (
    <section className={classNames("passangers-form-wrapper", { "passangers-form-wrapper_ready": isReady })}>
      <div className={classNames("passanger-details", {"passanger-details-open": isOpen})}>
        <button
          aria-label={isOpen ? "Свернуть пассажира" : "Раскрыть пассажира"}
          className="passanger-form__button-hidden"
          type="button"
          onClick={onToggle}
        >
          <i className={classNames("btn-hidden", { "btn-hidden_open": isOpen })} />
        </button>
        <h2 className="passanger-form__title">Пассажир {number}</h2>
        <button aria-label="Удаление пассажира недоступно" className="passanger-form__button-close" type="button">
          <i className="btn-close" />
        </button>
      </div>

      {isOpen ? (
        <div className="passanger-form">
          <label className="passanger-form__field passanger-form__field_type">
            {/* <span className="passanger-form__label"></span> */}
            <select className="ticket-category" value={passenger.type} disabled>
              <option value={passenger.type}>{passengerTypeLabels[passenger.type]}</option>
            </select>
          </label>

          {seatDescription ? <p className="passanger-form__seat">{seatDescription}</p> : null}

          <div className="passanger-form__name-grid">
            <label className="passanger-form__field">
              <span className="passanger-form__label">Фамилия</span>
              <input
                className={classNames("passanger-form__input", { "passanger-form__input_error": errors.lastName })}
                name="lastName"
                type="text"
                value={data.lastName}
                onChange={handleTextChange}
              />
            </label>

            <label className="passanger-form__field">
              <span className="passanger-form__label">Имя</span>
              <input
                className={classNames("passanger-form__input", { "passanger-form__input_error": errors.firstName })}
                name="firstName"
                type="text"
                value={data.firstName}
                onChange={handleTextChange}
              />
            </label>

            <label className="passanger-form__field">
              <span className="passanger-form__label">Отчество</span>
              <input
                className={classNames("passanger-form__input", { "passanger-form__input_error": errors.patronymic })}
                name="patronymic"
                type="text"
                value={data.patronymic}
                onChange={handleTextChange}
              />
            </label>
          </div>

          <div className="passanger-form__personal-grid">
            <fieldset className="passanger-form__field passanger-form__gender">
              <legend className="passanger-form__label">Пол</legend>
              <label className={classNames("passanger-form__gender-option", { "passanger-form__gender-option_active": data.gender === "male" })}>
                <input
                  checked={data.gender === "male"}
                  name={`gender-${passenger.id}`}
                  type="radio"
                  value="male"
                  onChange={() => onChange("gender", "male")}
                />
                м
              </label>
              <label className={classNames("passanger-form__gender-option", { "passanger-form__gender-option_active": data.gender === "female" })}>
                <input
                  checked={data.gender === "female"}
                  name={`gender-${passenger.id}`}
                  type="radio"
                  value="female"
                  onChange={() => onChange("gender", "female")}
                />
                ж
              </label>
            </fieldset>

            <label className="passanger-form__field">
              <span className="passanger-form__label">Дата рождения</span>
              <DateInput
                className={classNames("passanger-form__input", { "passanger-form__input_error": errors.birthday })}
                iconClassName="passanger-form__date-icon"
                id={`birthday-${passenger.id}`}
                name="birthday"
                value={data.birthday}
                onChange={handleTextChange}
              />
            </label>
          </div>

          <label className="passanger-form__checkbox">
            <input checked={data.isLimitedMobility} type="checkbox" onChange={handleCheckboxChange} />
            <span>ограниченная подвижность</span>
          </label>

          <div className="passanger-form__document">
            <label className="passanger-form__field">
              <span className="passanger-form__label">Тип документа</span>
              <select
                className="passanger-form__input passanger-form__select"
                name="documentType"
                value={data.documentType}
                onChange={handleTextChange}
              >
                <option value="passport">Паспорт РФ</option>
                <option value="birth_certificate">Свидетельство о рождении</option>
              </select>
            </label>

            {isBirthCertificate ? (
              <label className="passanger-form__field passanger-form__field_wide">
                <span className="passanger-form__label">Номер</span>
                <input
                  className={classNames("passanger-form__input", { "passanger-form__input_error": errors.documentNumber })}
                  name="documentNumber"
                  placeholder="VIII-ЫП-123456"
                  type="text"
                  value={data.documentNumber}
                  onChange={handleTextChange}
                  onBlur={onFinalFieldBlur}
                />
              </label>
            ) : (
              <>
                <label className="passanger-form__field">
                  <span className="passanger-form__label">Серия</span>
                  <input
                    className={classNames("passanger-form__input", { "passanger-form__input_error": errors.documentSeries })}
                    inputMode="numeric"
                    maxLength={4}
                    name="documentSeries"
                    type="text"
                    value={data.documentSeries}
                    onChange={handleTextChange}
                  />
                </label>

                <label className="passanger-form__field">
                  <span className="passanger-form__label">Номер</span>
                  <input
                    className={classNames("passanger-form__input", { "passanger-form__input_error": errors.documentNumber })}
                    inputMode="numeric"
                    maxLength={6}
                    name="documentNumber"
                    type="text"
                    value={data.documentNumber}
                    onChange={handleTextChange}
                    onBlur={onFinalFieldBlur}
                  />
                </label>
              </>
            )}
          </div>

          {hasFormErrors ? (
            <div className="passanger-form__status passanger-form__status_error">
              <span className="passanger-form__status-icon passanger-form__status-icon_error" aria-hidden="true" />
              <span>
                {footerErrorMessage.text}
                {footerErrorMessage.example ? (
                  <>
                    <br />
                    <strong>{footerErrorMessage.example}</strong>
                  </>
                ) : null}
              </span>
            </div>
          ) : (
            <div className={classNames("passanger-form__footer", { "passanger-form__footer_ready": isReady })}>
              {isReady ? (
                <span className="passanger-form__status-text">
                  <span className="passanger-form__status-icon passanger-form__status-icon_ready" aria-hidden="true" />
                  Готово
                </span>
              ) : null}
              <button className="btn passanger-form__next" type="button" onClick={onValidate}>
                Следующий пассажир
              </button>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default PassangersForm
