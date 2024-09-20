
import { CustomerDatabaseService } from "../database/customer.db.service"
import { Helper } from "../../helpers/helper"
import {TelegramNotificationApi} from "../../api/notification.api";

import ErrorInterceptor  from "../../exceptions/Error.exception"

import {Customer} from "../../entity/customer/Customer";

import { AUTH_CLIENT_DTO } from "../../dto/auth/client.dto.type"

// AuthService -> handle new customer registration and validate api key with middleware at each request
class AuthService {

  private readonly helper: Helper
  private readonly customerDb: CustomerDatabaseService
	private readonly notification: TelegramNotificationApi

  constructor() {
    this.helper = new Helper()
    this.customerDb = new CustomerDatabaseService()
		this.notification = new TelegramNotificationApi()
  }

  public async signUpNewClient(clientDto: AUTH_CLIENT_DTO): Promise<void> {
    const candidate: Customer = await this.customerDb.findUserByFilter({ userEmail: clientDto.userEmail })
    if (candidate) throw ErrorInterceptor.BadRequest("User already exists.")

		clientDto.apiKey = await this.helper.generatePassword(64)
		let msg: string = "Welcome to our wallet service! You are successfully registered."

    await this.customerDb.saveNewClient(clientDto)
		await this.notification.sendInfoMessage(clientDto.telegramId, msg)
  }

  // signInClient ->  validate user session use cache and api key 
  public async signInClient(clientDto: AUTH_CLIENT_DTO): Promise<boolean> {
		// let c: CACHE_DTO = await this.cacheService.getCachedData(clientDto.apiKey)
		// if(!c) return await this.customerDb.findUserByFilter(clientDto)
		let c: Customer = await this.customerDb.findUserByFilter(clientDto)
		return false
  }

}

export default new AuthService()

