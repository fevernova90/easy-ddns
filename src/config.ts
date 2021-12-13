require("dotenv").config()
import { cleanEnv, num, str } from "envalid"
export const config = cleanEnv(process.env, {
  UPDATE_CRONTAB: str({ default: "*/30 * * * *" }),
  DNS_RECORD_NAME: str(),
  DNS_RECORD_TYPE: str({ default: "A" }),
  DNS_RECORD_TTL: num({ default: 300 }),
  DNS_PROVIDER: str({
    default: "cloudflare",
    choices: ["cloudflare", "digitalocean"],
  }),
  CLOUDFLARE_BASE_URL: str({ default: "https://api.cloudflare.com/client/v4" }),
  CLOUDFLARE_API_TOKEN: str({ default: "" }),
  CLOUDFLARE_ZONE_ID: str({ default: "" }),
  DIGITALOCEAN_BASE_URL: str({ default: "https://api.digitalocean.com/v2" }),
  DIGITALOCEAN_TLD_DOMAIN: str({ default: "" }),
  DIGITALOCEAN_ACCESS_TOKEN: str({ default: "" }),
})
