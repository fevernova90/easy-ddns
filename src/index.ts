import { CronJob } from "cron"
import { config } from "./config"
import { getIpFromIpfast } from "./ip-lookup/get-ip-from-ipfast"
import {
  createDnsRecord,
  searchDnsRecords,
  updateDnsRecord,
} from "./provider-api/provider-api"

let previousTargetRecordId: string | undefined = undefined
let previousIpAddress: string | undefined = undefined

const crontab = config.UPDATE_CRONTAB

const job = new CronJob(
  crontab,
  async () => {
    console.log("Cron triggered.")
    const recordName = config.DNS_RECORD_NAME

    if (!recordName) throw new Error("DNS_RECORD_NAME is not set.")

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
      updateDnsRecord({
        recordId: previousTargetRecordId,
        recordName,
        ipAddress: currentIp,
      })
      previousTargetRecordId
    } else {
      // Check DNS records first for existing record with same domain name and type
      const existingRecord = await searchDnsRecords({ recordName })
      if (existingRecord) {
        console.log(
          `Found existing record with domain name: ${recordName}. Updating it.`
        )
        updateDnsRecord({
          recordId: existingRecord.id,
          recordName,
          ipAddress: currentIp,
        })
        previousTargetRecordId = existingRecord.id
        return
      }
      // else, Create a new record
      console.log(`Creating new record with new IP: ${currentIp}.`)
      const newRecord = await createDnsRecord({
        recordName,
        ipAddress: currentIp,
      })
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

console.log("Easy DDNS is running, your crontab is:", crontab)
