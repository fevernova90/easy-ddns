import { config } from "../config"
import { CFCreateDnsRecord } from "./cloudflare/cf-create-dns-record"
import { CFSearchDnsRecords } from "./cloudflare/cf-search-dns-records"
import { CFUpdateDnsRecord } from "./cloudflare/cf-update-dns-record"
import { DOCreateDnsRecord } from "./digitalocean/do-create-dns-record"
import { DOSearchDnsRecords } from "./digitalocean/do-search-dns-records"
import { DOUpdateDnsRecord } from "./digitalocean/do-update-dns-record"

export interface CreateDnsRecordArgs {
  recordName: string
  ipAddress: string
}

export const createDnsRecord = ({
  recordName,
  ipAddress,
}: CreateDnsRecordArgs) => {
  const provider = config.DNS_PROVIDER

  switch (provider) {
    case "cloudflare":
      return CFCreateDnsRecord(recordName, ipAddress)

    case "digitalocean":
      return DOCreateDnsRecord(recordName, ipAddress)

    default:
      throw new Error(`Unknown DNS provider: ${provider}`)
  }
}

export interface SearchDnsRecordsArgs {
  recordName: string
}
export const searchDnsRecords = ({ recordName }: SearchDnsRecordsArgs) => {
  const provider = config.DNS_PROVIDER

  switch (provider) {
    case "cloudflare":
      return CFSearchDnsRecords(recordName)
    case "digitalocean":
      return DOSearchDnsRecords(recordName)

    default:
      throw new Error(`Unknown DNS provider: ${provider}`)
  }
}

export interface UpdateDnsRecordArgs {
  recordId: string
  recordName: string
  ipAddress: string
}

export const updateDnsRecord = ({
  recordId,
  recordName,
  ipAddress,
}: UpdateDnsRecordArgs) => {
  const provider = config.DNS_PROVIDER

  switch (provider) {
    case "cloudflare":
      return CFUpdateDnsRecord(recordId, recordName, ipAddress)
    case "digitalocean":
      return DOUpdateDnsRecord(recordId, recordName, ipAddress)

    default:
      throw new Error(`Unknown DNS provider: ${provider}`)
  }
}
