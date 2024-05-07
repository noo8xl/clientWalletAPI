
import { generateKey } from "crypto"
import { AUTH_CLIENT_DTO } from "../types/auth/client.dto.type"
import { GeneratePassword } from "../crypto.lib/lib.helper/password_generator"
import database from "./database/wallet.db.service"

export class AuthService {
  private domainName: string
  private companyName: string


  constructor(clientDto: AUTH_CLIENT_DTO ){
    this.companyName = clientDto.companyName
    this.domainName = clientDto.domainName
  }


  async signUpNewClient(): Promise<void> {

    // generate an API key for user 
    const API_KEY: string = await GeneratePassword(64)
    console.log("API_KEY is -> ", API_KEY);
    const user = await database.saveNewClient()
    // create user 

    // if err -> throw error 
  }
}
