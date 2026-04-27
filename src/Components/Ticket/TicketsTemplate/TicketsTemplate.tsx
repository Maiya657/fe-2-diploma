import { Outlet } from "react-router-dom";
import TicketsHeader from "../TicketsHeader";
import Footer from "../../Footer";

function TicketsTemplate() {
  return(
    <>
      <TicketsHeader />
      <Outlet />
      <Footer />
    </>
  )
}

export default TicketsTemplate
