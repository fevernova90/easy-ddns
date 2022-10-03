import {
  DOCreateDnsRecordPayload,
  DOCreateDnsRecordResponse,
} from "./create-dns-record.interface"

export interface DOUpdateDnsRecordPayload extends DOCreateDnsRecordPayload {}

export interface DOUpdateDnsRecordResponse extends DOCreateDnsRecordResponse {}
