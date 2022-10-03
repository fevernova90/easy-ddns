import { CronJob } from "cron"
import { config } from "./config"
import { getIpFromLookupProvider, IPs } from "./ip-lookup"
import {
  createDnsRecord,
  searchDnsRecords,
  updateDnsRecord,
} from "./dns-update/provider-api"
import { isIPv4, isIPv6 } from "net"

export interface DNSRecordIds {
  v4: string | null
  v6: string | null
}

let previousTargetRecordId: DNSRecordIds = {
  v4: null,
  v6: null,
}
let previousIpAddress: IPs = {
  v4: null,
  v6: null,
}

const crontab = config.UPDATE_CRONTAB

const job = new CronJob(
  crontab,
  async () => {
    console.log("Cron triggered.")
    const recordName = config.DNS_RECORD_NAME

    if (!recordName) throw new Error("DNS_RECORD_NAME is not set.")

    // Get host external ip address
    let currentIps: IPs
    try {
      currentIps = await getIpFromLookupProvider()
    } catch (err) {
      console.warn("Attempt to get ip address failed.")
      return
    }

    // Check for ipv4 changes
    try {
      await updateDNSRecordIfRequired(recordName, currentIps.v4, "v4")
      if (config.UPDATE_IPV6) {
        await updateDNSRecordIfRequired(recordName, currentIps.v6, "v6")
      }
      previousIpAddress.v4 = currentIps.v4
      previousIpAddress.v6 = currentIps.v6
    } catch (err) {
      console.log("Failed to update ipv4 DNS record.", err)
    }
  },
  () => {
    console.log("Cron scheduled to stop.")
  },
  false,
  "Asia/Kuala_Lumpur"
)

job.start()

console.log("Easy DDNS is running, your crontab is:", crontab)

async function updateDNSRecordIfRequired(
  recordName: string,
  ip: string | null | undefined,
  version: "v4" | "v6"
) {
  if (!ip) return

  if (version === "v4") {
    if (!isIPv4(ip)) {
      throw new Error(`IP address ${ip} is not a valid IPv4 address.`)
    }
  } else if (version === "v6") {
    if (!isIPv6(ip)) {
      throw new Error(`IP address ${ip} is not a valid IPv6 address.`)
    }
  }

  if (previousIpAddress && previousIpAddress[version] === ip) {
    console.log(
      `IP${version} does not change. Previous: ${previousIpAddress[version]} Current: ${ip}`
    )
    return
  }

  // If previous record already exists, update it
  if (previousTargetRecordId[version]) {
    console.log(`Updating existing record with new IP${version}: ${ip}.`)
    updateDnsRecord({
      recordId: previousTargetRecordId[version]!,
      recordName,
      recordType: version === "v4" ? "A" : "AAAA",
      ipAddress: ip,
    })
  } else {
    // Check DNS records first for existing record with same domain name and type
    const existingRecord = await searchDnsRecords({
      recordName,
      recordType: version === "v4" ? "A" : "AAAA",
    })
    if (existingRecord) {
      console.log(
        `Found existing record with domain name: ${recordName}. Updating it.`
      )
      updateDnsRecord({
        recordId: existingRecord.id,
        recordName,
        recordType: version === "v4" ? "A" : "AAAA",
        ipAddress: ip,
      })
      previousTargetRecordId[version] = existingRecord.id
      return
    }
    // else, Create a new record
    console.log(`Creating new record with new IP${version}: ${ip}.`)
    const newRecord = await createDnsRecord({
      recordName,
      recordType: version === "v4" ? "A" : "AAAA",
      ipAddress: ip,
    })
    previousTargetRecordId[version] = newRecord.id
  }
}
