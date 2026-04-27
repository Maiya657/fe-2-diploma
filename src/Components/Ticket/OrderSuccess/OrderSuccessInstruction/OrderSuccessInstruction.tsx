import "../assets/style.css";

interface Props {
  icon: string;
  text: string;
}

function OrderSuccessInstruction({ icon, text }: Props) {
  return (
    <article className="order-success-instruction">
      <img className="order-success-instruction__icon" src={icon} alt="icon" />
      <p>{text}</p>
    </article>
  );
}

export default OrderSuccessInstruction
