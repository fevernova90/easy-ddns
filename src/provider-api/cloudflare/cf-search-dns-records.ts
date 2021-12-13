import axios, { AxiosError } from "axios"
import { config } from "../../config"
import { CFResponseError } from "./types/api-base.interface"
import {
  CFDNSRecord,
  CFListDnsRecordsQueryParams,
  CFListDnsRecordsResponse,
} from "./types/list-dns-records.interface"

const baseUrl = config.CLOUDFLARE_BASE_URL

export const CFSearchDnsRecords = (
  recordName: string
): Promise<CFDNSRecord | null> => {
  const apiToken = config.CLOUDFLARE_API_TOKEN
  const zoneId = config.CLOUDFLARE_ZONE_ID

  if (!apiToken || !zoneId)
    throw new Error("Missing Cloudflare API credentials.")

  const queryParams: CFListDnsRecordsQueryParams = {
    name: recordName,
    type: "A",
  }

  return axios
    .get<CFListDnsRecordsResponse>(baseUrl + `/zones/${zoneId}/dns_records`, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    })
    .then((res) => {
      if (res.data.result && res.data.result.length > 0) {
        // Check if dns record name was the same as queried
        const firstResult = res.data.result[0]
        return firstResult.name === recordName && firstResult.type === "A"
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
