
export async function GetDomainNameFromOrigin(origin: string): Promise<string> {
  return origin.split('//')[1]
}