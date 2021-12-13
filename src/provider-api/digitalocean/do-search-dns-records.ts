import axios, { AxiosError } from "axios"
import { config } from "../../config"
import {
  getSubFromFQDN,
  removeTldFromFQDN,
} from "../utils/domain-string-helpers"
import {
  DODNSRecord,
  DOListDnsRecordsQueryParams,
  DOListDnsRecordsResponse,
} from "./types/list-dns-records.interface"

const baseUrl = config.DIGITALOCEAN_BASE_URL

export const DOSearchDnsRecords = (
  recordName: string
): Promise<DODNSRecord | null> => {
  const apiToken = config.DIGITALOCEAN_ACCESS_TOKEN
  const tldDomain = config.DIGITALOCEAN_TLD_DOMAIN

  if (!apiToken) throw new Error("Missing DigitalOcean API credentials.")

  const queryParams: DOListDnsRecordsQueryParams = {
    name: recordName,
    type: "A",
  }

  return axios
    .get<DOListDnsRecordsResponse>(baseUrl + `/domains/${tldDomain}/records`, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    })
    .then((res) => {
      if (res.data.domain_records && res.data.domain_records.length > 0) {
        // Check if dns record name was the same as queried
        const firstResult = res.data.domain_records[0]
        const recordNameWithoutTLD = getSubFromFQDN(recordName)
        return firstResult.name === recordNameWithoutTLD &&
          firstResult.type === "A"
          ? firstResult
          : null
      } else {
        return null
      }
    })
    .catch((err) => {
      const error = err as AxiosError
      if (error.isAxiosError) {
        throw new Error(
          `Error contacting Cloudflare API. ${error.response?.status} - ${error.response?.statusText}`
        )
      } else {
        throw err
      }
    })
}
