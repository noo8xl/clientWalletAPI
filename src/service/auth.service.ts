
import ApiError from "src/exceptions/apiError"
import Helper from "../helpers/helper"
import { AUTH_CLIENT_DTO } from "../types/auth/client.dto.type"
import {CacheService} from "./cache/cache.service"

import database from "./database/wallet.db.service"
import { CustomerDatabaseService } from "./database/client.db.service"
import { CACHE_DTO } from "src/types/cache/cache.types"
import { DB_SELECT_RESPONSE } from "src/types/database/db.response.types"

export class AuthService {
  private domainName: string
  private companyName: string
  private apiKey: string

  // private readonly errorHandler: ApiError = new ApiError()
  private readonly cacheService: CacheService = new CacheService()
  private readonly customerDb: CustomerDatabaseService =  new CustomerDatabaseService()


  constructor(clientDto: AUTH_CLIENT_DTO ){
    this.companyName = clientDto.companyName
    this.domainName = clientDto.domainName
    this.apiKey = clientDto.apiKey
    
  }


  async signUpNewClient(): Promise<void> {

    // generate an API key for user 
    const API_KEY: string = await Helper.generatePassword(64)
    console.log("API_KEY is -> ", API_KEY);


    // const user = await database.saveNewClient()
    // create user 

    // if err -> throw error await this.errorHandler(s, m, e[])
  }

  // signInClient ->  validate user session use cache and api key 
  async signInClient(): Promise<void> {
    const c: CACHE_DTO = await this.cacheService.getAuthData(this.apiKey)
    if(!c){
      const user: DB_SELECT_RESPONSE = await this.customerDb.findUserByFilter({apiKey: this.apiKey})
      if (!user) throw await ApiError.NotFoundError('')
    }
  }
}
