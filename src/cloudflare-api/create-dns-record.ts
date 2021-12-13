import axios, { AxiosError } from "axios"
import { CFResponseError } from "./types/api-base.interface"
import {
  CreateDnsRecordPayload,
  CreateDnsRecordResponse,
} from "./types/create-dns-record.interface"
import { DNSType } from "./types/list-dns-records.interface"

export const createDnsRecord = (domainName: string, ipAddress: string) => {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const zoneId = process.env.CLOUDFLARE_ZONE_ID
  const baseUrl = process.env.CLOUDFLARE_BASE_URL
  const dnsRecordType: DNSType = (process.env.DNS_RECORD_TYPE as DNSType) ?? "A"

  const data: CreateDnsRecordPayload = {
    type: dnsRecordType,
    name: domainName,
    content: ipAddress,
    ttl: Number(process.env.DNS_RECORD_TTL) ?? 300,
  }

  return axios
    .post<CreateDnsRecordResponse>(
      baseUrl + `/zones/${zoneId}/dns_records`,
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
