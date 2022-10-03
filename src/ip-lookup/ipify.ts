import axios from "axios"
import { IPs } from "../ip-lookup"

export const getIpFromIpify = async (): Promise<IPs> => {
  let ipv4: string | null = null
  let ipv6: string | null = null
  // ipv4
  try {
    const response = await axios("https://api.ipify.org?format=json")
    const json = await response.data
    ipv4 = json.ip
  } catch (err) {
    console.log("Failed to get ipv4 address from ipify.", err)
  }

  // ipv6
  try {
    const response2 = await axios("https://api64.ipify.org?format=json")
    const json2 = await response2.data
    ipv6 = json2.ip
  } catch (err) {
    console.log("Failed to get ipv6 address from ipify.")
  }
  return {
    v4: ipv4,
    v6: ipv6,
  }
}
