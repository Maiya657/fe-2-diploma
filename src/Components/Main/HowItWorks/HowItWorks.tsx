import Icon from "./Icon";
import { ImageType } from "./Icon/types";
import "./assets/style.css";

function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="main-content">
        <div className="how-it-works-wrapper">
          <h3 className="how-it-works-title" id="how-it-works">Как это работает</h3>
          <button className="more-button">Узнать больше</button>
        </div>
        <div className="how-it-works-content-wrapper">
          <div className="content">
            <Icon image={ImageType.Order} title="Удобный заказ на сайте" />
          </div>
          <div className="content">
            <Icon image={ImageType.Office} title="Нет необходимости ехать в офис" />
          </div>
          <div className="content">
            <Icon image={ImageType.Global} title="Огромный выбор направлений" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks
