require("dotenv").config()

import { CronJob } from "cron"
import { createDnsRecord } from "./cloudflare-api/create-dns-record"
import { searchDnsRecords } from "./cloudflare-api/list-dns-records"
import { updateDnsRecord } from "./cloudflare-api/update-dns-record"
import { getIpFromIpfast } from "./ip-lookup/get-ip-from-ipfast"

const updateCrontab = process.env.UPDATE_CRONTAB ?? "0 * * * *"

let previousTargetRecordId: string | undefined = undefined
let previousIpAddress: string | undefined = undefined

const job = new CronJob(
  updateCrontab,
  async () => {
    console.log("Cron triggered.")
    const domainName = process.env.DNS_RECORD_NAME

    if (!domainName) throw new Error("DNS_RECORD_NAME is not set.")

    // Get host external ip address
    let currentIp: string
    try {
      currentIp = await getIpFromIpfast()
    } catch (err) {
      console.warn("Attempt to get ip address failed.")
      return
    }

    // If ip address does not change, do nothing
    if (currentIp === previousIpAddress) {
      console.log(
        `IP address does not change. Previous: ${previousIpAddress} Current: ${currentIp}`
      )
      return
    }

    previousIpAddress = currentIp

    // If previous record already exists, update it
    if (previousTargetRecordId) {
      console.log(`Updating existing record with new IP: ${currentIp}.`)
      updateDnsRecord(previousTargetRecordId, domainName, currentIp)
      previousTargetRecordId
    } else {
      // Check DNS records first for existing record with same domain name and type
      const existingRecord = await searchDnsRecords(domainName)
      if (existingRecord) {
        console.log(
          `Found existing record with domain name: ${domainName}. Updating it.`
        )
        updateDnsRecord(existingRecord.id, domainName, currentIp)
        previousTargetRecordId = existingRecord.id
        return
      }
      // else, Create a new record
      console.log(`Creating new record with new IP: ${currentIp}.`)
      const newRecord = await createDnsRecord(domainName, currentIp)
      previousTargetRecordId = newRecord.id
    }
  },
  () => {
    console.log("Cron scheduled to stop.")
  },
  false,
  "Asia/Kuala_Lumpur"
)

job.start()
