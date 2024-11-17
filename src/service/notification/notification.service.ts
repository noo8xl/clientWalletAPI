import { AxiosRequestConfig } from "axios";
import { Helper } from "../../helpers/helper";
import { NOTIFICATION_API } from "../../config/configs";
import { CustomerDatabaseService } from "../database/customer.db.service";

// NotificationService -> hanlde all notification for the user and internal errors
export class NotificationService {
  private readonly notificationApi = NOTIFICATION_API;
  private readonly customerDb: CustomerDatabaseService;

  constructor() {
    this.customerDb = new CustomerDatabaseService();
  }

  // signUpClientToTheApi -> sign up a client to the notification service api
  public async signUpClientToTheApi(userEmail: string, domainName: string): Promise<void> {
    let url: string = this.notificationApi.apiPath;
    let opts: AxiosRequestConfig;

    let dto = {
      userEmail,
      domainName,
    };

    opts = {
      method: "POST",
      data: dto,
      responseType: "stream",
    };
    url += this.notificationApi.signUpNewClientPath;
    await Helper.sendHttpRequest(url, opts);
  }

  // sendMessage -> send error messages to the developer or notification to the customer depends on chatId
  public async sendMessageViaTelegram(msg: string, chatId?: number): Promise<void> {
    let url: string = this.notificationApi.apiPath;
    let opts: AxiosRequestConfig;
    let domain: string;

    if (!chatId) {
      opts = {
        method: "GET",
        responseType: "stream",
      };
      url += this.notificationApi.sendErrorPath + msg;
    } else {
      // get a customer domain by telegram chatId <-
      domain = await this.customerDb.getCustomerDomainByTgChatId(chatId);
      let obj = {
        serviceType: "telegram",
        domainName: domain, // current customer domain name
        content: msg,
        recipient: chatId.toString(),
      };
      opts = {
        method: "POST",
        data: obj,
        responseType: "stream",
      };
      url += this.notificationApi.sendMessagePath;
    }

    await Helper.sendHttpRequest(url, opts);
  }

  public async approveTwoStep(): Promise<void> {}
}
