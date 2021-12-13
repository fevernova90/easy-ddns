import {
  CreateDnsRecordPayload,
  CreateDnsRecordResponse,
} from "./create-dns-record.interface"

export interface UpdateDnsRecordPayload extends CreateDnsRecordPayload {}

export interface UpdateDnsRecordResponse extends CreateDnsRecordResponse {}
