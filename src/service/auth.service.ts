
import ApiError from "../exceptions/apiError"

import { AUTH_CLIENT_DTO } from "../types/auth/client.dto.type"
import {CacheService} from "./cache/cache.service"

import { CustomerDatabaseService } from "./database/client.db.service"
import { CACHE_DTO } from "../types/cache/cache.types"
import { DB_SELECT_RESPONSE } from "../types/database/db.response.types"
import { Helper } from "../helpers/helper"
import { CUSTOMER } from "../types/database/customer.types"

export class AuthService {
  private domainName: string
  private companyName: string
  private userEmail: string
  private apiKey: string
  private telegramId: number

  private readonly helper: Helper = new Helper()
  private readonly cacheService: CacheService = new CacheService()
  private readonly customerDb: CustomerDatabaseService =  new CustomerDatabaseService()


  constructor(clientDto: AUTH_CLIENT_DTO ){
    this.companyName = clientDto.companyName
    this.userEmail = clientDto.userEmail
    this.domainName = clientDto.domainName
    this.apiKey = clientDto.apiKey
    this.telegramId = clientDto.telegramId
  }

  public async signUpNewClient(): Promise<void> {
    const customer: DB_SELECT_RESPONSE = await this.customerDb.findUserByFilter({userEmail: this.userEmail})
    if (customer) throw await ApiError.BadRequest("User already exists")

    // generate an API key for user 
    const API_KEY: string = await this.helper.generatePassword(64)
    const stamp: number = new Date().getTime()

    const userDto: CUSTOMER = {
      // userId: 
      userEmail: this.userEmail,
      domainName: this.domainName,
      companyName: this.companyName,
      apiKey: API_KEY,
      fiatName: "USD",
      telegramId: this.telegramId,
      createdAt: stamp,
      updatedAt: stamp
    }

    await this.customerDb.saveNewClient(userDto)
  }

  // signInClient ->  validate user session use cache and api key 
  async signInClient(): Promise<void> {
    let c: CACHE_DTO = await this.cacheService.getAuthData(this.apiKey)
    if(!c){
      const filter: any = {apiKey: this.apiKey}
      const candidate: DB_SELECT_RESPONSE = await this.customerDb.findUserByFilter(filter)
      if (!candidate) throw await ApiError.PermissionDenied("User not found. Permission denied.")
    } 
  }
}
