import { useState } from "react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useSubscribeMutation } from "../../../store/api/trainApi";
import "./assets/style.css";

type StatusType = "success" | "error";

interface StatusMessage {
  type: StatusType;
  text: string;
}

const successMessage: StatusMessage = {
  type: "success",
  text: "Вы успешно подписались на новости.",
};

const errorMessage: StatusMessage = {
  type: "error",
  text: "Не удалось оформить подписку. Попробуйте ещё раз.",
};

const emptyEmailMessage: StatusMessage = {
  type: "error",
  text: "Введите e-mail.",
};

function Subscribe() {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [subscribe, { isLoading }] = useSubscribeMutation();
  const isSubmitDisabled = isLoading || !email.trim();

  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;

    setEmail(value);
    setStatusMessage(null);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setStatusMessage(emptyEmailMessage);

      return;
    }

    try {
      await subscribe({ email: normalizedEmail }).unwrap();
      setEmail("");
      setStatusMessage(successMessage);
    } catch {
      setStatusMessage(errorMessage);
    }
  };

  return (
    <form className="footer-subscribe__form" onSubmit={handleSubmit}>
      <label htmlFor="subscribe-input" className="footer-subscribe__input-label">
        Будьте в курсе событий
      </label>
      <div className="footer-subscribe__input-container">
        <input
          id="subscribe-input"
          type="email"
          name="subscribe-input"
          placeholder="e-mail"
          className="footer-subscribe__input"
          value={email}
          required
          aria-describedby={statusMessage ? "subscribe-status" : undefined}
          disabled={isLoading}
          onChange={handleInput}
        />
        <button className="footer-subscribe__button" type="submit" disabled={isSubmitDisabled}>
          {isLoading ? "Отправка..." : "Отправить"}
        </button>
      </div>
      {statusMessage ? (
        <span
          id="subscribe-status"
          className={`footer-subscribe__message footer-subscribe__message_${statusMessage.type}`}
          aria-live="polite"
        >
          {statusMessage.text}
        </span>
      ) : null}
    </form>
  );
}

export default Subscribe
