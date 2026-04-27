import Filter from "../Tickets/Filter";
import LastTickets from "../Tickets/LastTickets";
import "./assets/style.css";

interface Props {
  showDirectionFilters?: boolean;
  showLastTickets?: boolean;
}

function SearchSidebar({
  showDirectionFilters = true,
  showLastTickets = true,
}: Props) {
  return (
    <aside className="search-sidebar">
      <Filter showDirectionFilters={showDirectionFilters} />
      {showLastTickets ? <LastTickets /> : null}
    </aside>
  );
}

export default SearchSidebar
