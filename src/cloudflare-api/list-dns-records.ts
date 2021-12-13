import axios, { AxiosError } from "axios"
import { CFResponseError } from "./types/api-base.interface"
import {
  ListDnsRecordsParams,
  ListDnsRecordsResponse,
} from "./types/list-dns-records.interface"

const baseUrl =
  process.env.CLOUDFLARE_BASE_URL ?? "https://api.cloudflare.com/client/v4"

export const searchDnsRecords = (domainName: string) => {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const zoneId = process.env.CLOUDFLARE_ZONE_ID

  const params: ListDnsRecordsParams = {
    name: domainName,
    type: "A",
  }

  return axios
    .get<ListDnsRecordsResponse>(baseUrl + `/zones/${zoneId}/dns_records`, {
      params,
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    })
    .then((res) => {
      if (res.data.result && res.data.result.length > 0) {
        // Check if dns record name was the same as queried
        const firstResult = res.data.result[0]
        return firstResult.name === domainName && firstResult.type === "A"
          ? firstResult
          : null
      } else {
        return null
      }
    })
    .catch((err) => {
      const error = err as AxiosError
      if (error.isAxiosError) {
        const errorData = error.response?.data?.error as
          | CFResponseError
          | undefined
        throw new Error(
          `Error contacting Cloudflare API. ${error.response?.status} - ${error.response?.statusText} - ${errorData?.code} - ${errorData?.message}`
        )
      } else {
        throw err
      }
    })
}
