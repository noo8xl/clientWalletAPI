import { pbkdf2 } from "crypto"

export class Helper {

  static async getHashStr(dto: any): Promise<string> {
    return new Promise((resolve) => {
      let key: string
      pbkdf2(
        Buffer.from(dto.toString()), 
        Buffer.from('test-salt-here'), 
        4, 
        64, 
        "sha512", 
        (err: Error, derivedKey: Buffer) => {
          if(err) {
            console.error('scrypt func error => ', err)
            return
          }
          key = derivedKey.toString("hex");
      })
      resolve(key)
    })
  }
}