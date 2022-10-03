import { IPs } from "../ip-lookup"

export const getIpFromIpApi = async (): Promise<IPs> => {
  let ipv4: string | null = null
  let ipv6: string | null = null
  // ipv4
  try {
    const response = await fetch("http://ip-api.com/json")
    const json = await response.json()
    ipv4 = json.query
  } catch (err) {
    console.log("Failed to get ipv4 address from ip-api.", err)
  }

  return {
    v4: ipv4,
    v6: null,
  }
}
