import { ChangeEvent, useEffect, useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useGetCitiesQuery } from '../../../../../store/api/trainApi'

const {
  debounceTimeout,
  cityMinTokens,
} = {
  debounceTimeout: 500,
  cityMinTokens: 2,
}

interface Props {
  id: string
  placeholder: string
  hiddenName: 'from_city_id' | 'to_city_id'
  initialValue?: string
  onChange: (fieldName: 'from_city_id' | 'to_city_id', cityId: string, cityName: string) => void
}

function CityAutocompleteField({
  id,
  placeholder,
  hiddenName,
  initialValue = '',
  onChange,
}: Props) {
  const [city, setCity] = useState(initialValue)
  const [debouncedCity, setDebouncedCity] = useState('')
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)

  useEffect(() => {
    setCity(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedCity(city.trim())
    }, debounceTimeout)

    return () => window.clearTimeout(timeoutId)
  }, [city])

  const { data: cities = [], isFetching } = useGetCitiesQuery(
    debouncedCity.length >= cityMinTokens ? debouncedCity : skipToken,
  )

  const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setCity(value)
    setIsAutocompleteOpen(true)
    onChange(hiddenName, '', value)
  }

  const handleCityBlur = () => {
    const matchedCity = cities.find(
      (currentCity) => currentCity.name.toLowerCase() === city.trim().toLowerCase(),
    )

    const cityId = matchedCity?._id ?? ''
    const cityName = matchedCity?.name ?? city.trim()

    onChange(hiddenName, cityId, cityName)
    setIsAutocompleteOpen(false)
  }

  const handleCitySelect = (name: string, cityId: string) => {
    setCity(name)
    setIsAutocompleteOpen(false)
    onChange(hiddenName, cityId, name)
  }

  return (
    <label className="form__input-icon">
      <i className="form__input__location" />
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        className="search-form__input"
        autoComplete="off"
        value={city}
        onChange={handleCityChange}
        onFocus={() => setIsAutocompleteOpen(true)}
        onBlur={handleCityBlur}
      />
      {isAutocompleteOpen && debouncedCity.length >= cityMinTokens && (
        <div className="search-form__autocomplete">
          {isFetching && (
            <p className="search-form__autocomplete-status">
              Ищем города...
            </p>
          )}
          {!isFetching && cities.length === 0 && (
            <p className="search-form__autocomplete-status">
              Ничего не найдено
            </p>
          )}
          {!isFetching &&
            cities.map((currentCity) => (
              <button
                key={currentCity._id}
                type="button"
                className="search-form__autocomplete-item"
                onMouseDown={() => handleCitySelect(currentCity.name, currentCity._id)}
              >
                {currentCity.name}
              </button>
            ))}
        </div>
      )}
    </label>
  )
}

export default CityAutocompleteField
