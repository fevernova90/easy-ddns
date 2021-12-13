import axios, { AxiosError } from "axios"

export const getIpFromIpfast = (): Promise<string> => {
  return axios
    .get("https://ip-fast.com/api/ip/")
    .then((res) => {
      return res.data as string
    })
    .catch((err) => {
      const error = err as AxiosError
      if (error.isAxiosError) {
        throw new Error(
          `Error contacting Cloudflare API. ${error.response?.status} ${error.response?.statusText}`
        )
      } else {
        throw err
      }
    })
}
