import axios, { AxiosError } from "axios"
import { config } from "../../config"
import { getSubFromFQDN } from "../utils/domain-string-helpers"
import { DODNSRecord, DODNSType } from "./types/list-dns-records.interface"
import {
  DOUpdateDnsRecordPayload,
  DOUpdateDnsRecordResponse,
} from "./types/update-dns-record.interface"

const baseUrl = config.DIGITALOCEAN_BASE_URL

export const DOUpdateDnsRecord = (
  recordId: string,
  recordName: string,
  ipAddress: string
): Promise<DODNSRecord> => {
  const apiToken = config.DIGITALOCEAN_ACCESS_TOKEN
  const tldDomain = config.DIGITALOCEAN_TLD_DOMAIN

  if (!apiToken) throw new Error("Missing DigitalOcean API credentials.")

  const dnsRecordType: DODNSType = config.DNS_RECORD_TYPE as DODNSType
  const ttl = config.DNS_RECORD_TTL

  const recordNameWithoutTLD = getSubFromFQDN(recordName)

  const data: DOUpdateDnsRecordPayload = {
    type: dnsRecordType,
    name: recordNameWithoutTLD,
    data: ipAddress,
    ttl,
  }

  return axios
    .put<DOUpdateDnsRecordResponse>(
      baseUrl + `/domains/${tldDomain}/records/${recordId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    )
    .then((res) => {
      if (!res.data.domain_record) throw new Error("No DNS record updated.")
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
