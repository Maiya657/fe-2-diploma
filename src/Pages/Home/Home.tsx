import AboutUs from "../../Components/Main/AboutUs";
import HowItWorks from "../../Components/Main/HowItWorks";
import Reviews from "../../Components/Main/Reviews";
import ScrollToAnchor from "../../Components/ScrollToAnchor";
import image1 from "./assets/image1.png";
import image2 from "./assets/image2.png";

const homeData = {
  reviews: [
    {
      image: image1.toString(),
      name: 'Екатерина Вальнова',
      text: 'Доброжелательные подсказки на всех этапах помогут правильно заполнить поля и без затруднений купить авиа или ж/д билет, даже если вы заказываете онлайн билет впервые.',
    },
    {
      image: image2.toString(),
      name: 'Евгений Стрыкало',
      text: 'СМС-сопровождение до посадки Сразу после оплаты ж/д билетов и за 3 часа до отправления мы пришлем вам СМС-напоминание о поездке.',
    }
  ]
}

function Home() {
  const {reviews} = homeData;

  return (
    <>
      <ScrollToAnchor />
      <AboutUs />
      <HowItWorks />
      <Reviews reviews={reviews} />
    </>
  )
}

export default Home
