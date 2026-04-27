import Logo from "../../Logo";
import Nav from "../../Nav";
import TicketSearchForm from "./TicketSearchForm";
import "./assets/style.css";

function Header() {
  return (
    <>
      <div className="header">
          <div className="header-content">
            <Logo />
          </div>
          <Nav />
          <div className="header-content">
            <div className="header-form-grid">
              <h2 className="main-title">Вся жизнь - <span className="main-title-strong">путешествие!</span></h2>
              <TicketSearchForm />
            </div>  
          </div>
      </div>
    </>
  );
}

export default Header
