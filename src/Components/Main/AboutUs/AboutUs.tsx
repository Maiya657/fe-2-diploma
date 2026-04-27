import "./assets/style.css";

function AboutUs() {
  return (
    <div className="main-content">
      <h3 className="about-title" id="about-us">О нас</h3>
      <article className="about-content">
         <p className="about-text">
          Мы рады видеть вас! Мы работаем для Вас с 2003 года. 14 лет мы наблюдаем, как с каждым днем
          все больше людей заказывают жд билеты через интернет.
        </p>
        <p className="about-text">
          Сегодня можно заказать железнодорожные билеты онлайн всего в 2 клика, но стоит ли это делать? 
          Мы расскажем о преимуществах заказа через интернет.
        </p>
        <p className="about-text-bold">
          Покупать жд билеты дешево можно за 90 суток до отправления поезда.
          Благодаря динамическому ценообразованию цена на билеты в это время самая низкая.
        </p>
      </article>
    </div>
  )
}

export default AboutUs
