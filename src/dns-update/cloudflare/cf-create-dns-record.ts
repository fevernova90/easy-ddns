import axios, { AxiosError } from "axios"
import { config } from "../../config"
import { CFResponseError } from "./types/api-base.interface"
import {
  CFCreateDnsRecordPayload,
  CFCreateDnsRecordResponse,
} from "./types/create-dns-record.interface"
import { CFDNSRecord, CFDNSType } from "./types/list-dns-records.interface"

const baseUrl = config.CLOUDFLARE_BASE_URL

export const CFCreateDnsRecord = (
  recordName: string,
  recordType: CFDNSType,
  ipAddress: string
): Promise<CFDNSRecord> => {
  const apiToken = config.CLOUDFLARE_API_TOKEN
  const zoneId = config.CLOUDFLARE_ZONE_ID

  if (!apiToken || !zoneId)
    throw new Error("Missing Cloudflare API credentials.")

  const ttl = config.DNS_RECORD_TTL

  const data: CFCreateDnsRecordPayload = {
    type: recordType,
    name: recordName,
    content: ipAddress,
    ttl,
  }

  return axios
    .post<CFCreateDnsRecordResponse>(
      baseUrl + `/zones/${zoneId}/dns_records`,
      data,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    )
    .then((res) => {
      if (!res.data.result) {
        throw new Error(
          `Failed creating DNS record: ${res.data.errors[0].message}`
        )
      }
      return res.data.result
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
