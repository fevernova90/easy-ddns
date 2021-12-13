import { CFDefaultResponse } from "./api-base.interface"
import { DNSType, ListDnsRecordsResult } from "./list-dns-records.interface"

export interface CreateDnsRecordPayload {
  type: DNSType
  name: string
  content: string
  ttl: number
}

export interface CreateDnsRecordResponse extends CFDefaultResponse {
  result: ListDnsRecordsResult
}
