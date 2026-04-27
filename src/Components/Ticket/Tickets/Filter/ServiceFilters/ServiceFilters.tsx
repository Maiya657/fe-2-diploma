import type { ChangeEventHandler } from 'react';
import type { RouteRequest } from '../../../../../store/api/types/routes';

type ServiceFilterName = Extract<
  keyof RouteRequest,
  | 'have_first_class'
  | 'have_second_class'
  | 'have_third_class'
  | 'have_fourth_class'
  | 'have_wifi'
  | 'have_express'
>;

interface ServiceFilterItem {
  iconClassName: string;
  label: string;
  name: ServiceFilterName;
}

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>;
  values: Record<ServiceFilterName, boolean>;
}

const serviceFilterItems: ServiceFilterItem[] = [
  {
    iconClassName: 'compartment-icon',
    label: 'Купе',
    name: 'have_second_class',
  },
  {
    iconClassName: 'reserved-seat-icon',
    label: 'Плацкарт',
    name: 'have_third_class',
  },
  {
    iconClassName: 'seated-carriage-icon',
    label: 'Сидячий',
    name: 'have_fourth_class',
  },
  {
    iconClassName: 'deluxe-icon',
    label: 'Люкс',
    name: 'have_first_class',
  },
  {
    iconClassName: 'wifi-filter-icon',
    label: 'Wi-Fi',
    name: 'have_wifi',
  },
  {
    iconClassName: 'express-filter-icon',
    label: 'Экспресс',
    name: 'have_express',
  },
];

function ServiceFilters({ onChange, values }: Props) {
  return (
    <div className='ticket-service-filter'>
      {serviceFilterItems.map(({ iconClassName, label, name }) => (
        <div key={name} className='ticket-service-filter__class'>
          <i className={iconClassName} />
          <label className='custom-label'>{label}
            <input
              type="checkbox"
              name={name}
              checked={values[name]}
              onChange={onChange}
            />
            <i className='checkbox-icon' />
          </label>
        </div>
      ))}
    </div>
  );
}

export type { ServiceFilterName };
export default ServiceFilters;
