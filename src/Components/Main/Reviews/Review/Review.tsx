import "./assets/style.css";

export type ReviewType = {
  image: string,
  name: string,
  text: string,
}

export type Props = ReviewType;

function Review({image, name, text}: Props) {
  return (
    <>
      <div className="review">
        <div className="user-image">
          <img src={image} alt={name}/>
        </div>
        <div className="user-content">
          <div className="user-name">{name}</div>
          <p className="user-review">{text}</p>
        </div>
      </div>
    </>
  )
}

export default Review
