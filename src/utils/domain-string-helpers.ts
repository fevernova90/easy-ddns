export const getSubFromFQDN = (fqdn: string): string => {
  const parts = fqdn.split(".")
  return parts[0]
}
