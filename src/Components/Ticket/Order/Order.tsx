import { skipToken } from "@reduxjs/toolkit/query";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { useGetRouteSeatsQuery } from "../../../store/api/trainApi";
import SearchSidebar from "../SearchSidebar";
import {
  arePassengerDirectionsCompatible,
  buildPassengersSelectionState,
  getBackToSearchPath,
  getStoredSelectedRoute,
  savePassengersSelection,
} from "./helpers";
import OrderDirectionSection from "./OrderDirectionSection";
import OrderNextButton from "./OrderNextButton";
import type { OrderLocationState } from "./types";
import { useOrderSelection } from "./useOrderSelection";
import "./assets/style.css";

function Order() {
  const { departureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationState = location.state as OrderLocationState | null;
  const arrivalId = searchParams.get("arrivalId");
  const route = locationState?.route ?? getStoredSelectedRoute(departureId, arrivalId);
  const backToSearchPath = getBackToSearchPath(location.search);

  const {
    data: departureCoaches = [],
    isLoading: isDepartureLoading,
    isFetching: isDepartureFetching,
    isError: isDepartureError,
  } = useGetRouteSeatsQuery(departureId ? { id: departureId } : skipToken);
  const {
    data: arrivalCoaches = [],
    isLoading: isArrivalLoading,
    isFetching: isArrivalFetching,
    isError: isArrivalError,
  } = useGetRouteSeatsQuery(arrivalId ? { id: arrivalId } : skipToken);

  const departureSelection = useOrderSelection(departureCoaches);
  const arrivalSelection = useOrderSelection(arrivalCoaches);
  const hasArrivalDirection = Boolean(arrivalId);
  const departureSelectedTickets = departureSelection.selectedSeatInfos.length + departureSelection.childWithoutSeatCount;
  const arrivalSelectedTickets = arrivalSelection.selectedSeatInfos.length + arrivalSelection.childWithoutSeatCount;
  const departurePassengersSelection = {
    childWithoutSeatCount: departureSelection.childWithoutSeatCount,
    selectedSeatInfos: departureSelection.selectedSeatInfos,
  };
  const arrivalPassengersSelection = hasArrivalDirection
    ? {
      childWithoutSeatCount: arrivalSelection.childWithoutSeatCount,
      selectedSeatInfos: arrivalSelection.selectedSeatInfos,
    }
    : undefined;
  const isRoundTripPassengersSelectionValid = arePassengerDirectionsCompatible(
    departurePassengersSelection,
    arrivalPassengersSelection,
  );
  const canProceed = hasArrivalDirection
    ? departureSelectedTickets > 0 && arrivalSelectedTickets > 0 && isRoundTripPassengersSelectionValid
    : departureSelectedTickets > 0;
  const nextButtonMessage = hasArrivalDirection && !isRoundTripPassengersSelectionValid
    ? "Для поездки туда и обратно выберите одинаковое количество взрослых, детских и детских билетов без места."
    : undefined;

  const handleNextClick = () => {
    if (!departureId || !canProceed) {
      return;
    }

    const passengersSelection = buildPassengersSelectionState(
      route,
      departurePassengersSelection,
      arrivalPassengersSelection,
    );

    savePassengersSelection(passengersSelection, departureId, arrivalId);

    navigate({
      pathname: `/tickets/${departureId}/passangers`,
      search: location.search,
    }, {
      state: {
        passengersSelection,
      },
    });
  };

  return (
    <main className="order-page">
      <div className="main-content order-page__content">
        <SearchSidebar />

        <section className="order-page__workspace">
          <h1 className="order-page__title">Выбор мест</h1>
          <div className="order-page__sections">
            <OrderDirectionSection
              backToSearchPath={backToSearchPath}
              coaches={departureCoaches}
              directionType="departure"
              isError={isDepartureError}
              isFetching={isDepartureFetching}
              isLoading={isDepartureLoading}
              route={route}
              routeDirection={hasArrivalDirection ? route?.departure ?? null : route?.departure ?? route?.arrival ?? null}
              selection={departureSelection}
              showBackLink
            />

            {hasArrivalDirection ? (
              <OrderDirectionSection
                backToSearchPath={backToSearchPath}
                coaches={arrivalCoaches}
                directionType="arrival"
                isError={isArrivalError}
                isFetching={isArrivalFetching}
                isLoading={isArrivalLoading}
                route={route}
                routeDirection={route?.arrival ?? null}
                selection={arrivalSelection}
              />
            ) : null}
          </div>

          <OrderNextButton disabled={!canProceed} message={nextButtonMessage} onClick={handleNextClick} />
        </section>
      </div>
    </main>
  );
}

export default Order
