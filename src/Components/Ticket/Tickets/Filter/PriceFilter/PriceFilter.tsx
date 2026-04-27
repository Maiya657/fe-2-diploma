import { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router';
import RangeSlider from '../RangeSlider';
import './assets/style.css';

const minPrice = 0;
const maxPrice = 7000;
const defaultPriceFrom = minPrice;
const defaultPriceTo = maxPrice;

function normalizePriceValue(
  rawValue: string | null,
  fallbackValue: number,
  minValue: number,
  maxValue: number,
) {
  if (rawValue === null || rawValue === '') {
    return fallbackValue;
  }

  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    return fallbackValue;
  }

  return Math.min(Math.max(numericValue, minValue), maxValue);
}

function getNormalizedPriceRange(searchParams: URLSearchParams) {
  const normalizedPriceFrom = normalizePriceValue(
    searchParams.get('price_from'),
    defaultPriceFrom,
    minPrice,
    maxPrice,
  );
  const normalizedPriceTo = Math.max(
    normalizePriceValue(searchParams.get('price_to'), defaultPriceTo, minPrice, maxPrice),
    normalizedPriceFrom,
  );

  return {
    priceFrom: normalizedPriceFrom,
    priceTo: normalizedPriceTo,
  };
}

function PriceFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { priceFrom, priceTo } = getNormalizedPriceRange(searchParams);

  const updatePriceSearchParams = (nextPriceFrom: number, nextPriceTo: number) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set('price_from', String(nextPriceFrom));
    nextSearchParams.set('price_to', String(nextPriceTo));
    nextSearchParams.set('offset', '0');
    setSearchParams(nextSearchParams);
  };

  const handlePriceFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    const nextPriceFrom = Math.min(nextValue, priceTo);

    updatePriceSearchParams(nextPriceFrom, priceTo);
  };

  const handlePriceToChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    const nextPriceTo = Math.max(nextValue, priceFrom);

    updatePriceSearchParams(priceFrom, nextPriceTo);
  };

  return (
    <div className='price-filter'>
      <div className='price-filter__title'>Стоимость</div>

      <div className='price-filter__labels'>
        <span className='price-filter__label'>от</span>
        <span className='price-filter__label'>до</span>
      </div>

      <RangeSlider
        min={minPrice}
        max={maxPrice}
        startValue={priceFrom}
        endValue={priceTo}
        onStartChange={handlePriceFromChange}
        onEndChange={handlePriceToChange}
        values={[String(priceFrom), String(priceTo), String(maxPrice)]}
      />
    </div>
  );
}

export default PriceFilter
