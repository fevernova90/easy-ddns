import {
  CFCreateDnsRecordPayload,
  CFCreateDnsRecordResponse,
} from "./create-dns-record.interface"

export interface CFUpdateDnsRecordPayload extends CFCreateDnsRecordPayload {}

export interface CFUpdateDnsRecordResponse extends CFCreateDnsRecordResponse {}
