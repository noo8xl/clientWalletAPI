import { pbkdf2 } from "crypto";
import { CustomerDatabaseService } from "../database/customer.db.service";
import { CacheService } from "../cache/cache.service";
import { NotificationService } from "../notification/notification.service";

import ErrorInterceptor from "../../exceptions/Error.exception";

import { AUTH_CLIENT_DTO } from "../../dto/auth/client.dto.type";
import { Helper } from "../../helpers/helper";

// AuthService -> handle new customer registration and validate api key with middleware at each request
class AuthService {
  private readonly customerDb: CustomerDatabaseService;
  private readonly notification: NotificationService;
  private readonly cacheService: CacheService;

  constructor() {
    this.customerDb = new CustomerDatabaseService();
    this.notification = new NotificationService();
    this.cacheService = new CacheService();
  }

  public async signUpNewClient(clientDto: AUTH_CLIENT_DTO): Promise<void> {
    const candidate: string = await this.customerDb.getCustomerId(clientDto.userEmail);
    if (candidate) throw ErrorInterceptor.BadRequest("User already exists.");

    clientDto.apiKey = await Helper.getHashStr(clientDto);
    console.log("api key -> ", clientDto.apiKey);
    let msg: string = "Welcome to our wallet service! You are successfully registered.";

    await this.customerDb.saveNewClient(clientDto);
    await this.notification.sendInfoTelegramMessage(clientDto.telegramId, msg);
  }

  // signInClient ->  validate user use cache and api key
  public async signInClient(clientDto: AUTH_CLIENT_DTO): Promise<boolean> {
    let c: string = await this.cacheService.getUserCache(clientDto.apiKey);
    if (!c) {
      let id: string = await this.customerDb.getCustomerId(clientDto.userEmail);
      if (!id) return false;
      await this.cacheService.setUserCache(clientDto.apiKey, id);
    }

    return true;
  }
}

export default new AuthService();
