import type {
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
} from 'react';

interface Props {
  className: string;
  iconClassName?: string;
  id: string;
  name: string;
  value?: string;
  placeholder?: string;
  min?: InputHTMLAttributes<HTMLInputElement>['min'];
  max?: InputHTMLAttributes<HTMLInputElement>['max'];
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const defaultDateInputFocusHandler: FocusEventHandler<HTMLInputElement> = (event) => {
  event.currentTarget.showPicker?.();
};

function DateInput({
  className,
  iconClassName = 'form__input__date',
  id,
  name,
  value,
  placeholder = 'ДД/ММ/ГГГГ',
  min,
  max,
  onChange,
}: Props) {
  return (
    <label className="form__input-icon">
      <i className={iconClassName} />
      <input
        type="date"
        id={id}
        name={name}
        placeholder={placeholder}
        className={className}
        onFocus={defaultDateInputFocusHandler}
        onChange={onChange}
        value={value}
        min={min}
        max={max}
      />
    </label>
  );
}

export default DateInput
