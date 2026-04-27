import { ChangeEvent, useEffect, useState } from 'react';
import cn from 'classnames';
import { Form, useSearchParams } from 'react-router';
import DateInput from '../../../DateInput';
import { getRouteRequestFromSearchParams } from '../../../../store/api/helpers/getRouteRequestFromSearchParams';
import type { RouteRequest } from '../../../../store/api/types/routes';
import CityAutocompleteField from './CityAutocompleteField';
import './assets/style.css';

interface Props {
  isHorizontal?: boolean;
}

type SearchForm = Pick<RouteRequest, 'from_city_id' | 'to_city_id'> & {
  from_city_name: string;
  to_city_name: string;
  date_start: string;
  date_end: string;
};

type CityFieldName = 'from_city_id' | 'to_city_id';
type CityNameFieldName = 'from_city_name' | 'to_city_name';

const searchFormDefaults: SearchForm = {
  from_city_id: '',
  to_city_id: '',
  from_city_name: '',
  to_city_name: '',
  date_start: '',
  date_end: '',
};

const getSearchFormFromSearchParams = (searchParams: URLSearchParams): SearchForm => ({
  ...searchFormDefaults,
  ...getRouteRequestFromSearchParams(searchParams),
});

function TicketSearchForm({ isHorizontal }: Props) {
  const [searchParams] = useSearchParams();
  const [searchFormQuery, setSearchFormQuery] = useState<SearchForm>(() =>
    getSearchFormFromSearchParams(searchParams),
  );

  useEffect(() => {
    setSearchFormQuery(getSearchFormFromSearchParams(searchParams));
  }, [searchParams]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setSearchFormQuery((prevQuery) => ({
      ...prevQuery,
      [name as keyof SearchForm]: value,
    }));
  };

  const handleCityChange = (fieldName: CityFieldName, cityId: string, cityName: string) => {
    const cityNameFieldName: Record<CityFieldName, CityNameFieldName> = {
      from_city_id: 'from_city_name',
      to_city_id: 'to_city_name',
    };

    setSearchFormQuery((prevQuery) => ({
      ...prevQuery,
      [fieldName]: cityId,
      [cityNameFieldName[fieldName]]: cityName,
    }));
  };

  return (
    <Form
      action="/tickets"
      className={cn('search-form', { 'search-form-horizontal': isHorizontal })}
    >
        {searchFormQuery.from_city_id && (
          <input type="hidden" name="from_city_id" value={searchFormQuery.from_city_id} />
        )}
        {searchFormQuery.to_city_id && (
          <input type="hidden" name="to_city_id" value={searchFormQuery.to_city_id} />
        )}
        {searchFormQuery.from_city_name && (
          <input type="hidden" name="from_city_name" value={searchFormQuery.from_city_name} />
        )}
        {searchFormQuery.to_city_name && (
          <input type="hidden" name="to_city_name" value={searchFormQuery.to_city_name} />
        )}
        <div className="search-form__value search-form__value-direction">
           <label htmlFor="direction-from" className="search-form__title">Направление</label>
           <div className="search-form__container">
                <CityAutocompleteField
                  id="direction-from"
                  placeholder="Откуда"
                  hiddenName="from_city_id"
                  initialValue={searchFormQuery.from_city_name}
                  onChange={handleCityChange}
                />
                <CityAutocompleteField
                  id="direction-to"
                  placeholder="Куда"
                  hiddenName="to_city_id"
                  initialValue={searchFormQuery.to_city_name}
                  onChange={handleCityChange}
                />
                <i className="form__input__rotate" />
            </div> 
        </div>
        <div className="search-form__value search-form__value-date">
            <label htmlFor="date_start" className="search-form__title">Дата</label>
            <div className="search-form__container search-date-container">
                <DateInput
                  className="search-form__input"
                  id="date_start"
                  name="date_start"
                  onChange={handleInputChange}
                  value={searchFormQuery.date_start}
                />
                <DateInput
                  className="search-form__input"
                  id="date_end"
                  name="date_end"
                  onChange={handleInputChange}
                  value={searchFormQuery.date_end}
                />
            </div>
        </div>
        <div className="search-form__button">
          <button type="submit" className="btn primary">Найти билеты</button>
        </div>
    </Form>
  );
}

export default TicketSearchForm
