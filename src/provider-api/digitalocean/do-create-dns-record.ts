import axios, { AxiosError } from "axios"
import { config } from "../../config"
import { getSubFromFQDN } from "../../utils/domain-string-helpers"
import {
  DOCreateDnsRecordPayload,
  DOCreateDnsRecordResponse,
} from "./types/create-dns-record.interface"
import { DODNSRecord, DODNSType } from "./types/list-dns-records.interface"

const baseUrl = config.DIGITALOCEAN_BASE_URL

export const DOCreateDnsRecord = (
  recordName: string,
  recordType: DODNSType,
  ipAddress: string
): Promise<DODNSRecord> => {
  const apiToken = config.DIGITALOCEAN_ACCESS_TOKEN
  const tldDomain = config.DIGITALOCEAN_TLD_DOMAIN

  if (!apiToken) throw new Error("Missing DigitalOcean API credentials.")

  const ttl = config.DNS_RECORD_TTL

  // Remove TLD from recordName
  const recordNameWithoutTLD = getSubFromFQDN(recordName)

  const data: DOCreateDnsRecordPayload = {
    type: recordType,
    name: recordNameWithoutTLD,
    data: ipAddress,
    ttl,
  }

  return axios
    .post<DOCreateDnsRecordResponse>(
      baseUrl + `/domains/${tldDomain}/records`,
      data,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    )
    .then((res) => {
      if (!res.data.domain_record) throw new Error("No DNS record created.")
      return res.data.domain_record
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
