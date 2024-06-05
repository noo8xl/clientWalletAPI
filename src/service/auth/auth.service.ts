
import { CacheService } from "../cache/cache.service"
import { CustomerDatabaseService } from "../database/customer.db.service"
import { Helper } from "../../helpers/helper"
import { CACHE_DTO } from "../../types/cache/cache.types"
import { DB_SELECT_RESPONSE } from "../../types/database/db.response.types"
import { AUTH_CLIENT_DTO } from "../../types/auth/client.dto.type"
import { CUSTOMER } from "../../types/customer/customer.types"
import ErrorInterceptor  from "../../exceptions/Error.exception"

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

  public async signUpNewClient(clientDto: AUTH_CLIENT_DTO): Promise<void | boolean> {
    const customer: DB_SELECT_RESPONSE = await this.customerDb.findUserByFilter({ userEmail: clientDto.userEmail })
    if (customer) return false

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
  public async signInClient(clientDto: AUTH_CLIENT_DTO): Promise<boolean> { 
    return await this.customerDb.findUserByFilter(clientDto)
    // let c: CACHE_DTO = await this.cacheService.getCachedData(clientDto.apiKey)
    // if(!c) return await this.customerDb.findUserByFilter(clientDto)
    // return null
  }
}

export default new AuthService()

