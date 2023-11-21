import * as React from 'react'

export const useLocalStorage = key => {
  const [value, setValue] = React.useState(() =>
    window.localStorage.getItem(key),
  )
  React.useEffect(() => {
    window.localStorage.setItem(key, value)
  }, [value])
  return [value, setValue]
}
