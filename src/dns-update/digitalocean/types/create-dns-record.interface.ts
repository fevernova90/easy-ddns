import { DODNSRecord, DODNSType } from "./list-dns-records.interface"

export interface DOCreateDnsRecordPayload {
  name: string
  type: DODNSType
  data: string
  ttl?: number
}

export interface DOCreateDnsRecordResponse {
  domain_record: DODNSRecord
}
