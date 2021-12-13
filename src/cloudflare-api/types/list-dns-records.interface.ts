import {
  CFDefaultResponse,
  CFPaginationResponse,
  CFRequestPaginationParams,
  CFResponseError,
} from "./api-base.interface"

export type DNSType =
  | "A"
  | "AAAA"
  | "CNAME"
  | "HTTPS"
  | "TXT"
  | "SRV"
  | "LOC"
  | "MX"
  | "NS"
  | "CERT"
  | "DNSKEY"
  | "DS"
  | "NAPTR"
  | "SMIMEA"
  | "SSHFP"
  | "SVCB"
  | "TLSA"
  | "URI"

export interface ListDnsRecordsParams extends CFRequestPaginationParams {
  // DNS Record Name
  name: string
  type: DNSType
}

export interface ListDnsRecordsResponse extends CFDefaultResponse {
  result: ListDnsRecordsResult[]
}

export interface ListDnsRecordsResult {
  id: string
  type: string
  name: string
  content: string
  proxiable: boolean
  proxied: boolean
  ttl: number
  locked: boolean
  zone_id: string
  zone_name: string
  created_on: string
  modified_on: string
  data: {}
  meta: {
    auto_added: boolean
    source: string
  }
}
