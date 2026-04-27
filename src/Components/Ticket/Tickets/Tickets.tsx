import SearchSidebar from "../SearchSidebar";
import TicketsList from "./TicketsList";
import "./assets/style.css";

function Tickets() {
  return (
    <div className="main-content main-content-wrapper">
      <SearchSidebar />
      <article className="main-content__article">
        <TicketsList />
      </article>
    </div>
  )
}

export default Tickets
