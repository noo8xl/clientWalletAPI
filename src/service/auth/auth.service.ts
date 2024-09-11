
import { CustomerDatabaseService } from "../database/customer.db.service"
import { Helper } from "../../helpers/helper"
import { DB_SELECT_RESPONSE } from "../../types/database/db.response.types"
import { AUTH_CLIENT_DTO } from "../../dto/auth/client.dto.type"
import ErrorInterceptor  from "../../exceptions/Error.exception"
import {Customer} from "../../entity/customer/Customer";
import {CustomerDetails} from "../../entity/customer/CustomerDetails";

// AuthService -> handle new customer registration and validate api key with middleware at each request
class AuthService {

  private helper: Helper
  private customerDb: CustomerDatabaseService

  constructor(){
    this.helper = new Helper()
    this.customerDb = new CustomerDatabaseService()
  }

  public async signUpNewClient(clientDto: AUTH_CLIENT_DTO): Promise<void> {
    const candidate: DB_SELECT_RESPONSE = await this.customerDb.findUserByFilter({ userEmail: clientDto.userEmail })
    if (candidate) throw ErrorInterceptor.BadRequest("User already exists.")

    // generate an API key for user 
    let customer: Customer = new Customer()
		let details: CustomerDetails = new CustomerDetails()
		const API_KEY: string = await this.helper.generatePassword(64)

		customer.setCustomer(null, clientDto.userEmail, clientDto.domainName, clientDto.companyName, API_KEY)
		details.setDefault(clientDto.telegramId, customer.getId())
		customer.setCustomerDetails(details)

    await this.customerDb.saveNewClient(customer)
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

