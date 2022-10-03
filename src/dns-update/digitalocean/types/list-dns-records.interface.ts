export type DODNSType =
  | "A"
  | "AAAA"
  | "CAA"
  | "CNAME"
  | "TXT"
  | "SRV"
  | "MX"
  | "NS"
  | "SOA"

export interface DOListDnsRecordsQueryParams {
  // DNS Record Name
  name: string
  type: DODNSType
}

export interface DOListDnsRecordsResponse {
  domain_records: DODNSRecord[]
}

export interface DODNSRecord {
  id: string
  type: DODNSType
  name: string
  data: string
  ttl: number
}
