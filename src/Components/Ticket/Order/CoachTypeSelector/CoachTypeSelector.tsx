import cn from "classnames";
import type { CoachClassType } from "../../../../store/api/trainApi";
import type { CoachClassOption } from "../types";
import "./assets/style.css";

interface Props {
  options: CoachClassOption[];
  activeType: CoachClassType | null;
  onSelect: (type: CoachClassType) => void;
}

function CoachTypeSelector({ options, activeType, onSelect }: Props) {
  return (
    <section className="coach-type-selector">
      <h2 className="coach-type-selector__title">Тип вагона</h2>
      <div className="coach-type-selector__list">
        {options.map((option) => (
          <button
            key={option.type}
            type="button"
            className={cn("coach-type-card", {
              "coach-type-card_active": option.type === activeType,
            })}
            onClick={() => onSelect(option.type)}
          >
            <i className={`coach-type-card__icon coach-type-card__icon_${option.type}`} />
            <span className="coach-type-card__label">{option.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CoachTypeSelector
