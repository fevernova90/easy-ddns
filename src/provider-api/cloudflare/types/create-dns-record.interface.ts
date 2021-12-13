import { CFDefaultResponse } from "./api-base.interface"
import { CFDnsRecord, CFDNSType } from "./list-dns-records.interface"

export interface CFCreateDnsRecordPayload {
  type: CFDNSType
  name: string
  content: string
  ttl: number
}

export interface CFCreateDnsRecordResponse extends CFDefaultResponse {
  result: CFDnsRecord
}
