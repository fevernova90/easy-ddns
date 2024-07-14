import { getIpFromIpApi } from "./ip-api"
import { getIpFromIpify } from "./ipify"

export type IPs = {
  v4: string | null
  v6: string | null
}

export const getIpFromLookupProvider = async (): Promise<IPs> => {
  // Currently there's no configuration that user can set to choose the ip lookup provider.

  // So we just use ipify for now, and ip-api as fallback.
  let ips: IPs = {
    v4: null,
    v6: null,
  }

  try {
    ips = await getIpFromIpApi()
  } catch (err) {
    console.log("Failed to get ip address from ip-api.", err)
  }

  if (!ips.v4 && !ips.v6) {
    try {
      ips = await getIpFromIpify()
    } catch (err) {
      console.log("Failed to get ip address from ipify.", err)
    }
  }

  if (!ips.v4 && !ips.v6) {
    throw new Error("Failed to get ip address from all ip lookup providers.")
  }

  return ips
}
