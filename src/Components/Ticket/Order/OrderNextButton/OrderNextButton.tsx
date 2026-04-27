import "./assets/style.css";

interface Props {
  disabled: boolean;
  message?: string;
  onClick?: () => void;
}

function OrderNextButton({ disabled, message, onClick }: Props) {
  return (
    <div className="order-next">
      {message ? <p className="order-next__message">{message}</p> : null}
      <button type="button" className="btn primary order-next__button" disabled={disabled} onClick={onClick}>
        Далее
      </button>
    </div>
  );
}

export default OrderNextButton
