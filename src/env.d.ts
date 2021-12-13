import { DNSType } from "./cloudflare-api/types/list-dns-records.interface"

declare namespace NodeJS {
  interface ProcessEnv {
    readonly UPDATE_CRONTAB?: string
    readonly DNS_RECORD_NAME: string
    readonly DNS_RECORD_TYPE?: string
    readonly DNS_RECORD_TTL?: string
    readonly CLOUDFLARE_BASE_URL?: string
    readonly CLOUDFLARE_API_TOKEN: string
    readonly CLOUDFLARE_ZONE_ID: string
  }
}
