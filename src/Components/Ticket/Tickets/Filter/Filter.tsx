import { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router';
import DateInput from '../../../DateInput';
import DirectionFilter from './DirectionFilter';
import PriceFilter from './PriceFilter';
import ServiceFilters from './ServiceFilters';
import type { ServiceFilterName } from './ServiceFilters';
import './assets/style.css';

interface Props {
  showDirectionFilters?: boolean;
}

const getServiceFiltersFromSearchParams = (
  searchParams: URLSearchParams,
): Record<ServiceFilterName, boolean> => ({
  have_first_class: searchParams.get('have_first_class') === 'true',
  have_second_class: searchParams.get('have_second_class') === 'true',
  have_third_class: searchParams.get('have_third_class') === 'true',
  have_fourth_class: searchParams.get('have_fourth_class') === 'true',
  have_wifi: searchParams.get('have_wifi') === 'true',
  have_express: searchParams.get('have_express') === 'true',
});

export function Filter({ showDirectionFilters = true }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const dates = {
    date_start: searchParams.get('date_start') ?? '',
    date_end: searchParams.get('date_end') ?? '',
  };
  const serviceFilters = getServiceFiltersFromSearchParams(searchParams);

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    const nextSearchParams = new URLSearchParams(searchParams);

    if (value) {
      nextSearchParams.set(name, value);
    } else {
      nextSearchParams.delete(name);
    }

    nextSearchParams.set('offset', '0');
    setSearchParams(nextSearchParams);
  };

  const handleServiceFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.currentTarget;
    const filterName = name as ServiceFilterName;

    const nextSearchParams = new URLSearchParams(searchParams);

    if (checked) {
      nextSearchParams.set(filterName, 'true');
    } else {
      nextSearchParams.delete(filterName);
    }

    nextSearchParams.set('offset', '0');
    setSearchParams(nextSearchParams);
  };

  return (
    <>
      <div className="filter-wrapper">
        <div className='search-form__start'>
          <label htmlFor="date_start" className="search-form__title-filter">Дата поездки</label>
          <div className="search-form___container search-date-container">
            <DateInput
              className="search-form__input search-form__input-filter"
              iconClassName="form__input__date filter__input__date"
              id="date_start"
              name="date_start"
              onChange={handleDateChange}
              value={dates.date_start}
            />
          </div>
        </div>
        <div className='search-form__end'>
          <label htmlFor="date_end" className="search-form__title-filter">Дата возвращения</label>
          <div className="search-form___container search-date-container">
            <DateInput
              className="search-form__input search-form__input-filter"
              iconClassName="form__input__date filter__input__date"
              id="date_end"
              name="date_end"
              onChange={handleDateChange}
              value={dates.date_end}
            />
          </div>
        </div>
        <div className='filter-border'></div>
        <ServiceFilters values={serviceFilters} onChange={handleServiceFilterChange} />
        <div className='filter-border'></div>
        <PriceFilter />
        {showDirectionFilters ? (
          <>
            <div className='filter-border'></div>
            <DirectionFilter
              title='Туда'
              direction='from'
              departureFromParam='start_departure_hour_from'
              departureToParam='start_departure_hour_to'
              arrivalFromParam='start_arrival_hour_from'
              arrivalToParam='start_arrival_hour_to'
            />
            <div className='filter-border'></div>
            <DirectionFilter
              title='Обратно'
              direction='back'
              departureFromParam='end_departure_hour_from'
              departureToParam='end_departure_hour_to'
              arrivalFromParam='end_arrival_hour_from'
              arrivalToParam='end_arrival_hour_to'
            />
          </>
        ) : null}
      </div>
    </>
  );
}

export default Filter
