import { config } from "../config"
import { CFCreateDnsRecord } from "./cloudflare/cf-create-dns-record"
import { CFSearchDnsRecords } from "./cloudflare/cf-search-dns-records"
import { CFUpdateDnsRecord } from "./cloudflare/cf-update-dns-record"
import { CFDNSType } from "./cloudflare/types/list-dns-records.interface"
import { DOCreateDnsRecord } from "./digitalocean/do-create-dns-record"
import { DOSearchDnsRecords } from "./digitalocean/do-search-dns-records"
import { DOUpdateDnsRecord } from "./digitalocean/do-update-dns-record"
import { DODNSType } from "./digitalocean/types/list-dns-records.interface"

export interface CreateDnsRecordArgs {
  recordName: string
  recordType: CFDNSType | DODNSType
  ipAddress: string
}

export const createDnsRecord = ({
  recordName,
  recordType,
  ipAddress,
}: CreateDnsRecordArgs) => {
  const provider = config.DNS_PROVIDER

  switch (provider) {
    case "cloudflare":
      return CFCreateDnsRecord(recordName, recordType as CFDNSType, ipAddress)

    case "digitalocean":
      return DOCreateDnsRecord(recordName, recordType as DODNSType, ipAddress)

    default:
      throw new Error(`Unknown DNS provider: ${provider}`)
  }
}

export interface SearchDnsRecordsArgs {
  recordName: string
  recordType: DODNSType | CFDNSType
}
export const searchDnsRecords = ({
  recordName,
  recordType,
}: SearchDnsRecordsArgs) => {
  const provider = config.DNS_PROVIDER

  switch (provider) {
    case "cloudflare":
      return CFSearchDnsRecords(recordName, recordType as CFDNSType)
    case "digitalocean":
      return DOSearchDnsRecords(recordName, recordType as DODNSType)

    default:
      throw new Error(`Unknown DNS provider: ${provider}`)
  }
}

export interface UpdateDnsRecordArgs {
  recordId: string
  recordName: string
  recordType: CFDNSType | DODNSType
  ipAddress: string
}

export const updateDnsRecord = ({
  recordId,
  recordName,
  recordType,
  ipAddress,
}: UpdateDnsRecordArgs) => {
  const provider = config.DNS_PROVIDER

  switch (provider) {
    case "cloudflare":
      return CFUpdateDnsRecord(
        recordId,
        recordName,
        recordType as CFDNSType,
        ipAddress
      )
    case "digitalocean":
      return DOUpdateDnsRecord(
        recordId,
        recordName,
        recordType as DODNSType,
        ipAddress
      )

    default:
      throw new Error(`Unknown DNS provider: ${provider}`)
  }
}
