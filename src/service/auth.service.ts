
import ApiError from "../exceptions/apiError"

import { AUTH_CLIENT_DTO } from "../types/auth/client.dto.type"
import {CacheService} from "./cache/cache.service"

import { CustomerDatabaseService } from "./database/client.db.service"
import { CACHE_DTO } from "../types/cache/cache.types"
import { DB_SELECT_RESPONSE } from "../types/database/db.response.types"
import { Helper } from "../helpers/helper"

export class AuthService {
  private domainName: string
  private companyName: string
  private userEmail: string
  private apiKey: string

  private readonly helper: Helper = new Helper()
  private readonly cacheService: CacheService = new CacheService()
  private readonly customerDb: CustomerDatabaseService =  new CustomerDatabaseService()


  constructor(clientDto: AUTH_CLIENT_DTO ){
    this.companyName = clientDto.companyName
    this.userEmail: clientDto.userEmail
    this.domainName = clientDto.domainName
    this.apiKey = clientDto.apiKey
    
  }



  async signUpNewClient(): Promise<void> {
    const customer: DB_SELECT_RESPONSE = await this.customerDb.isUserExists()
    if (customer) throw await ApiError.BadRequest("User already exists")


    // generate an API key for user 
    const API_KEY: string = await this.helper.generatePassword(64)
    console.log("API_KEY is -> ", API_KEY);


    // const user = await database.saveNewClient()
    // create user 
    

    // if err -> throw error await this.errorHandler(s, m, e[])
  }

  // signInClient ->  validate user session use cache and api key 
  async signInClient(): Promise<void> {
    const c: CACHE_DTO = await this.cacheService.getAuthData(this.apiKey)
    if(!c){
      // filter - > {apiKey: this.apiKey}
      const user: DB_SELECT_RESPONSE = await this.customerDb.findUserByFilter()
      if (!user) throw await ApiError.NotFoundError('')
    }
  }
}
