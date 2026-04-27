import cn from "classnames";
import type { RouteSeatsResponseItem } from "../../../../store/api/trainApi";
import { getCoachDisplayLabel } from "../helpers";
import "./assets/style.css";

interface Props {
  coaches: RouteSeatsResponseItem[];
  activeCoachId: string;
  onSelect: (coachId: string) => void;
}

function CoachTabs({ coaches, activeCoachId, onSelect }: Props) {
  return (
    <section className="coach-tabs">
      <div className="coach-tabs__header">
        <div className="coach-tabs__title">
          <span className="coach-tabs__title-label">Вагоны</span>
          <div className="coach-tabs__labels" aria-label="Список вагонов">
            {coaches.map(({ coach }, index) => {
              const coachLabel = getCoachDisplayLabel(coach.name, index);

              return (
                <button
                  key={coach._id}
                  type="button"
                  className={cn("coach-tabs__label", {
                    "coach-tabs__label_active": coach._id === activeCoachId,
                  })}
                  onClick={() => onSelect(coach._id)}
                  aria-pressed={coach._id === activeCoachId}
                >
                  {coachLabel}
                </button>
              );
            })}
          </div>
        </div>
        <div className="coach-tabs__hint">Нумерация вагонов начинается с головы поезда</div>
      </div>
    </section>
  );
}

export default CoachTabs
