import type {
  Route,
  RouteDirection,
  RouteSeatsResponseItem,
} from "../../../../store/api/trainApi";
import CoachInfo from "../CoachInfo";
import CoachTabs from "../CoachTabs";
import CoachTypeSelector from "../CoachTypeSelector";
import { getTicketQuantityOptions } from "../helpers";
import SelectedTrainSummary from "../SelectedTrainSummary";
import TicketQuantity from "../TicketQuantity";
import type { OrderDirectionType } from "../types";
import type { OrderSelectionState } from "../useOrderSelection";
import SeatMap from "../SeatMap";
import "./assets/style.css";

interface Props {
  backToSearchPath: string;
  coaches: RouteSeatsResponseItem[];
  directionType: OrderDirectionType;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  route?: Route;
  routeDirection: RouteDirection | null;
  selection: OrderSelectionState;
  showBackLink?: boolean;
}

function OrderDirectionSection({
  backToSearchPath,
  coaches,
  directionType,
  isError,
  isFetching,
  isLoading,
  route,
  routeDirection,
  selection,
  showBackLink = true,
}: Props) {
  const {
    activeClassOption,
    activeClassType,
    activeCoach,
    activeCoachExtraOptions,
    activeCoachLabel,
    activeCoachSelectedSeats,
    activeTicketType,
    childWithoutSeatCount,
    classOptions,
    handleExtraOptionToggle,
    handleSeatSelect,
    selectedSeatInfos,
    setActiveClassType,
    setActiveCoachId,
    setActiveTicketType,
    setChildWithoutSeatCount,
  } = selection;
  const canShowBaseBlocks = !isLoading && !isFetching && !isError && Boolean(coaches.length);
  const hasExpandedSelection = activeClassOption && activeCoach;
  const adultSeatCount = selectedSeatInfos.filter(({ ticketType }) => ticketType === "adult").length;
  const childSeatCount = selectedSeatInfos.filter(({ ticketType }) => ticketType === "child").length;
  const ticketQuantityOptions = getTicketQuantityOptions(adultSeatCount, childSeatCount);
  const sectionLabel = directionType === "departure" ? "Туда" : "Обратно";

  return (
    <section className="order-direction-section" aria-label={sectionLabel}>
      <div className="order-direction-section__marker-wrapper">
        <span
          className={`order-direction-section__marker order-direction-section__marker_${directionType}`}
          aria-label={sectionLabel}
          role="img"
        />
      </div>

      {isLoading || isFetching ? (
        <div className="order-page__state">Загружаем свободные места...</div>
      ) : null}

      {isError ? (
        <div className="order-page__state order-page__state_error">
          Не удалось загрузить вагоны. Попробуйте обновить страницу.
        </div>
      ) : null}

      {!isLoading && !isFetching && !isError && !coaches.length ? (
        <div className="order-page__state">Для этого направления сейчас нет доступных вагонов.</div>
      ) : null}

      {canShowBaseBlocks ? (
        <>
          <SelectedTrainSummary
            backToSearchPath={backToSearchPath}
            route={route}
            routeDirection={routeDirection}
            showBackLink={showBackLink}
            isArrival={directionType === "arrival"}
          />
          <TicketQuantity
            activeTicketType={activeTicketType}
            childWithoutSeatCount={childWithoutSeatCount}
            options={ticketQuantityOptions}
            selectedSeatInfos={selectedSeatInfos}
            onChildWithoutSeatCountChange={setChildWithoutSeatCount}
            onTicketTypeChange={setActiveTicketType}
          />
          <CoachTypeSelector
            options={classOptions}
            activeType={activeClassType}
            onSelect={setActiveClassType}
          />

          {hasExpandedSelection ? (
            <>
              <CoachTabs
                coaches={activeClassOption.coaches}
                activeCoachId={activeCoach.coach._id}
                onSelect={setActiveCoachId}
              />
              <CoachInfo
                coachItem={activeCoach}
                coachLabel={activeCoachLabel}
                selectedExtraOptions={activeCoachExtraOptions}
                onExtraOptionToggle={handleExtraOptionToggle}
              />
              <SeatMap
                coachItem={activeCoach}
                coachLabel={activeCoachLabel}
                selectedSeats={activeCoachSelectedSeats}
                onSeatSelect={handleSeatSelect}
              />
            </>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export default OrderDirectionSection
