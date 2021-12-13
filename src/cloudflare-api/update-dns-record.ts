import axios, { AxiosError } from "axios"
import { CFResponseError } from "./types/api-base.interface"
import { DNSType } from "./types/list-dns-records.interface"
import {
  UpdateDnsRecordPayload,
  UpdateDnsRecordResponse,
} from "./types/update-dns-record.interface"

const baseUrl =
  process.env.CLOUDFLARE_BASE_URL ?? "https://api.cloudflare.com/client/v4"

export const updateDnsRecord = (
  recordId: string,
  domainName: string,
  ipAddress: string
) => {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const zoneId = process.env.CLOUDFLARE_ZONE_ID
  const dnsRecordType: DNSType = (process.env.DNS_RECORD_TYPE as DNSType) ?? "A"

  const data: UpdateDnsRecordPayload = {
    type: dnsRecordType,
    name: domainName,
    content: ipAddress,
    ttl: Number(process.env.DNS_RECORD_TTL) ?? 300,
  }

  return axios
    .put<UpdateDnsRecordResponse>(
      baseUrl + `/zones/${zoneId}/dns_records/${recordId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    )
    .then((res) => {
      if (res.data.result) return res.data.result
      throw new Error(
        `Failed creating DNS record: ${res.data.errors[0].message}`
      )
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
