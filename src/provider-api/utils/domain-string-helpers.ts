export const removeTldFromFQDN = (fqdn: string): string => {
  const parts = fqdn.split(".")
  if (parts.length < 2) {
    return fqdn
  }
  return parts.slice(0, -1).join(".")
}

export const getSubFromFQDN = (fqdn: string): string => {
  const parts = fqdn.split(".")
  if (parts.length < 3) {
    return fqdn
  }
  return parts.slice(0, -2).join(".")
}
