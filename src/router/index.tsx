import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import MainTemplate from "../Components/Main/MainTemplate";
import Tickets from "../Pages/Tickets";
import Order from "../Pages/Order";
import TicketsTemplate from "../Components/Ticket/TicketsTemplate";
import Passangers from "../Pages/Passangers";
import Payment from "../Pages/Payment";
import OrderReview from "../Pages/OrderReview";
import OrderSuccess from "../Pages/OrderSuccess";

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '/',
        element: <MainTemplate />,
        children: [
          {
            path: '/',
            index: true,
            element: <Home />,
          },
        ],
      },
      {
        path: '',
        element: <TicketsTemplate />,
        children: [
          {
            path: '/tickets',
            element: <Tickets />,
          },
          {
            path: '/tickets/:departureId/seats',
            element: <Order />,
          },
          {
            path: '/tickets/:departureId/passangers',
            element: <Passangers />,
          },
          {
            path: '/tickets/:departureId/payment',
            element: <Payment />,
          },
          {
            path: '/tickets/:departureId/order',
            element: <OrderReview />,
          },
          {
            path: '/tickets/:departureId/order/success',
            element: <OrderSuccess />,
          },
        ]
      }
    ],
  },
], 
{ 
  basename: "/fe-2-diploma/",
}
)
