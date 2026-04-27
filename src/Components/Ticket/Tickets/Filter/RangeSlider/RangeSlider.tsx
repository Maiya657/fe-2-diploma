import { ChangeEvent, useMemo } from 'react';
import './assets/style.css';

interface Props {
  min: number;
  max: number;
  startValue: number;
  endValue: number;
  onStartChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEndChange: (event: ChangeEvent<HTMLInputElement>) => void;
  values?: [string, string, string];
  variant?: 'price' | 'direction';
}

function RangeSlider({
  min,
  max,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  values,
  variant = 'price',
}: Props) {
  const { leftPercent, widthPercent } = useMemo(() => {
    const range = max - min;

    if (range <= 0) {
      return {
        leftPercent: 0,
        widthPercent: 0,
      };
    }

    const left = ((startValue - min) / range) * 100;
    const width = ((endValue - startValue) / range) * 100;

    return {
      leftPercent: left,
      widthPercent: width,
    };
  }, [endValue, max, min, startValue]);

  const sliderClassName = `range-slider range-slider_variant_${variant}`;

  return (
    <div className={sliderClassName}>
      <div className='range-slider__control'>
        <div className='range-slider__track' />
        <div
          className='range-slider__track-active'
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />

        <input
          className='range-slider__range range-slider__range_min'
          type='range'
          min={min}
          max={max}
          value={startValue}
          onChange={onStartChange}
        />

        <input
          className='range-slider__range range-slider__range_max'
          type='range'
          min={min}
          max={max}
          value={endValue}
          onChange={onEndChange}
        />
      </div>

      {values && (
        <div className='range-slider__values'>
          <span className='range-slider__value'>{values[0]}</span>
          <span className='range-slider__value'>{values[1]}</span>
          <span className='range-slider__value'>{values[2]}</span>
        </div>
      )}
    </div>
  );
}

export default RangeSlider
