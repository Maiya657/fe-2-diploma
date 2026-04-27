const cityNameSeparatorPattern = /(^|[\s\-–—])([a-zа-яё])/g

export const formatCityName = (name: string) =>
  name.toLowerCase().replace(cityNameSeparatorPattern, (match, separator, letter) => {
    if (!letter) {
      return match
    }

    return `${separator}${letter.toUpperCase()}`
  })
