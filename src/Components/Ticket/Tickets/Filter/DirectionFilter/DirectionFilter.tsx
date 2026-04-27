import { ChangeEvent, useState } from 'react';
import { useSearchParams } from 'react-router';
import RangeSlider from '../RangeSlider';
import './assets/style.css';

type DirectionType = 'departure' | 'arrival';

interface Props {
  title: string;
  direction: 'from' | 'back';
  departureFromParam: string;
  departureToParam: string;
  arrivalFromParam: string;
  arrivalToParam: string;
}

interface TimeRange {
  from: number;
  to: number;
}

const minHour = 0;
const maxHour = 24;

function hasActiveDirectionFilters(
  searchParams: URLSearchParams,
  params: string[],
) {
  return params.some((param) => {
    const value = searchParams.get(param);

    return value !== null && value !== '';
  });
}

function normalizeHourValue(rawValue: string | null, fallbackValue: number) {
  if (rawValue === null || rawValue === '') {
    return fallbackValue;
  }

  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    return fallbackValue;
  }

  return Math.min(Math.max(numericValue, minHour), maxHour);
}

function getNormalizedTimeRange(
  searchParams: URLSearchParams,
  fromParam: string,
  toParam: string,
) {
  const from = normalizeHourValue(searchParams.get(fromParam), minHour);
  const to = Math.max(normalizeHourValue(searchParams.get(toParam), maxHour), from);

  return { from, to };
}

function formatHourLabel(hour: number) {
  return `${hour}:00`;
}

function DirectionFilter({
  title,
  direction,
  departureFromParam,
  departureToParam,
  arrivalFromParam,
  arrivalToParam,
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(
    () => hasActiveDirectionFilters(searchParams, [
      departureFromParam,
      departureToParam,
      arrivalFromParam,
      arrivalToParam,
    ]),
  );
  const departureRange = getNormalizedTimeRange(searchParams, departureFromParam, departureToParam);
  const arrivalRange = getNormalizedTimeRange(searchParams, arrivalFromParam, arrivalToParam);

  const updateRangeSearchParams = (
    fromParam: string,
    toParam: string,
    range: TimeRange,
  ) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (range.from <= minHour && range.to >= maxHour) {
      nextSearchParams.delete(fromParam);
      nextSearchParams.delete(toParam);
    } else {
      nextSearchParams.set(fromParam, String(range.from));
      nextSearchParams.set(toParam, String(range.to));
    }

    nextSearchParams.set('offset', '0');
    setSearchParams(nextSearchParams);
  };

  const handleRangeChange = (
    rangeType: DirectionType,
    boundary: 'from' | 'to',
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = Number(event.target.value);

    if (rangeType === 'departure') {
      if (boundary === 'from') {
        const nextFrom = Math.min(nextValue, departureRange.to);
        const nextRange = { from: nextFrom, to: departureRange.to };

        updateRangeSearchParams(departureFromParam, departureToParam, nextRange);
        return;
      }

      const nextTo = Math.max(nextValue, departureRange.from);
      const nextRange = { from: departureRange.from, to: nextTo };

      updateRangeSearchParams(departureFromParam, departureToParam, nextRange);
      return;
    }

    if (boundary === 'from') {
      const nextFrom = Math.min(nextValue, arrivalRange.to);
      const nextRange = { from: nextFrom, to: arrivalRange.to };

      updateRangeSearchParams(arrivalFromParam, arrivalToParam, nextRange);
      return;
    }

    const nextTo = Math.max(nextValue, arrivalRange.from);
    const nextRange = { from: arrivalRange.from, to: nextTo };

    updateRangeSearchParams(arrivalFromParam, arrivalToParam, nextRange);
  };

  const sections = [
    {
      key: 'departure',
      title: 'Время отбытия',
      range: departureRange,
      fromParam: departureFromParam,
      toParam: departureToParam,
    },
    {
      key: 'arrival',
      title: 'Время прибытия',
      range: arrivalRange,
      fromParam: arrivalFromParam,
      toParam: arrivalToParam,
    },
  ] as const;

  return (
    <div className='direction-filter direction-filter_expanded'>
      <button
        type='button'
        className={`direction-filter__header${isExpanded ? ' direction-filter__header_expanded' : ''}`}
        onClick={() => setIsExpanded((prevState) => !prevState)}
      >
        <i className={direction === 'from' ? 'direction-icon__from' : 'direction-icon__back'} />
        <div className='direction-filter__title-wrapper'>
          <div className='search-form__title-direction'>{title}</div>
          <i className={isExpanded ? 'filters-opened-icon' : 'filters-closed-icon'} />
        </div>
      </button>

      {isExpanded && (
        <div className='direction-filter__content'>
          {sections.map((section) => (
            <div
              key={section.key}
              className='direction-filter__section'
              data-section={section.key}
            >
              <div className='direction-filter__label'>{section.title}</div>
              <RangeSlider
                min={minHour}
                max={maxHour}
                startValue={section.range.from}
                endValue={section.range.to}
                onStartChange={(event) => handleRangeChange(section.key, 'from', event)}
                onEndChange={(event) => handleRangeChange(section.key, 'to', event)}
                values={[
                  formatHourLabel(section.range.from),
                  formatHourLabel(section.range.to),
                  formatHourLabel(maxHour),
                ]}
                variant='direction'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DirectionFilter
