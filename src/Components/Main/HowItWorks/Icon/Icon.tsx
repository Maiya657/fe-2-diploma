import order from "./assets/order.svg";
import office from "./assets/office.svg";
import global from "./assets/global.svg";
import { ImageType } from "./types";
import "./assets/style.css"

export type Props = {
  image: ImageType,
  title: string,
}

function renderIcon(icon: ImageType) {
  switch (icon) {
    case ImageType.Order:
      return order;
    case ImageType.Office:
      return office;
    case ImageType.Global:
      return global;
  }
}

function Icon({image, title}: Props) {
  return (
    <>
      <div className="how-it-works-image">
        <img src={renderIcon(image)} alt={image.toString()}/>
      </div>
      <div className="how-it-works-image-title">{title}</div>
    </>
  )
}

export default Icon
