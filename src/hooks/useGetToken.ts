import useStorage from "./useStorage"

export const getToken = (key: string) => {
  const userToken = JSON.parse(useStorage.GetLocalStorage(key) || '{}')
  return {
    'Authorization': `${userToken}`,
    'Content-Type': 'application/json'
  }
}