
import ErrorInterceptor  from "../../exceptions/apiError"
import { CacheService } from "../cache/cache.service"
import { CustomerDatabaseService } from "../database/customer.db.service"
import { Helper } from "../../helpers/helper"

import { CACHE_DTO } from "../../types/cache/cache.types"
import { DB_SELECT_RESPONSE } from "../../types/database/db.response.types"
import { AUTH_CLIENT_DTO } from "../../types/auth/client.dto.type"
import { CUSTOMER } from "../../types/customer/customer.types"

// AuthService -> handle new customer registration and validate api key with middleware at each request
class AuthService {
  private readonly stamp: number = new Date().getTime()
  private helper: Helper 
  private cacheService: CacheService
  private customerDb: CustomerDatabaseService

  constructor(){
    this.helper = new Helper()
    this.cacheService = new CacheService()
    this.customerDb = new CustomerDatabaseService()
  }

  public async signUpNewClient(clientDto: AUTH_CLIENT_DTO): Promise<void> {
    const customer: DB_SELECT_RESPONSE = await this.customerDb.findUserByFilter({ userEmail: clientDto.userEmail })
    // if (customer) { 
    //   console.log("user already exists")
    //   return 
    // }
    if (customer) throw await ErrorInterceptor.BadRequest("User already exists.")

    // generate an API key for user 
    const API_KEY: string = await this.helper.generatePassword(64)
    const userDto: CUSTOMER = {
      // userId: 
      userEmail: clientDto.userEmail,
      domainName: clientDto.domainName,
      companyName: clientDto.companyName,
      apiKey: API_KEY,
      fiatName: "USD",
      telegramId: clientDto.telegramId,
      isActive: true,
      createdAt: this.stamp,
      updatedAt: this.stamp
    }
    
    await this.customerDb.saveNewClient(userDto)
  }

  // signInClient ->  validate user session use cache and api key 
  public async signInClient(clientDto: AUTH_CLIENT_DTO): Promise<void> { 
    let c: CACHE_DTO = await this.cacheService.getCachedData(clientDto.apiKey)
    if(!c){
      const candidate: CUSTOMER = await this.customerDb.findUserByFilter(clientDto)
      if (!candidate) throw await ErrorInterceptor.PermissionDenied("Key to the API checker")
    } 
  }
}

export default new AuthService()

