import { useLocation } from "react-router";
import Logo from "../../Logo";
import TicketSearchForm from "../../Main/Header/TicketSearchForm";
import Nav from "../../Nav";
import "./assets/style.css";


function TicketsHeader() {
  const location = useLocation();
  const isSuccessPage = location.pathname.endsWith("/order/success");

  return (
    <>
      <div className={isSuccessPage ? "header-tickets header-tickets_success" : "header-tickets"}>
        <div className="header-content">
          <Logo />
        </div>
        <Nav />
        {!isSuccessPage && (
          <div className="header-content">
            <TicketSearchForm isHorizontal />
          </div>
        )}
      </div>
    </>
  );
}

export default TicketsHeader
