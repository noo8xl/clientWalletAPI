

// send telegram msg 

import axios, { AxiosError, AxiosResponse } from "axios"
import { 
	NOTIFICATION_API_KEY, 
	NOTIFICATION_ACCESS_TOKEN, 
	NOTIFICATION_API_PATH,
	ERR_CHAT_ID
} from "../config/configs"

export class TelegramNotificationApi {
  private readonly apiKey = NOTIFICATION_API_KEY
  private readonly accessToken = NOTIFICATION_ACCESS_TOKEN
  private readonly apiPath = NOTIFICATION_API_PATH
	private readonly devId = ERR_CHAT_ID

  constructor() {}

  public async sendInfoMessage(chatId: number, userRequest: string): Promise<boolean> {

		const sendMessage: boolean = await axios(
			`${this.apiPath}/sendActionMessage/`, {
			method: 'POST',
			responseType: 'stream',
			data: {
					chatId,
					userRequest
			},
			headers: {
					'X-Access-Token': this.accessToken,
					'AccessKey': this.apiKey
			}
		})
			.then((res: AxiosResponse) => {
				console.log(res.status)
				console.log(res.statusText)
				// console.log('res body => ', res);
				return true
			})
			.catch((e: AxiosError) => {
				console.log('error => ', e.message);
				return false
			})
		return sendMessage
  }

	public async sendErrorMessage(msg: string): Promise<boolean> {

		const sendMessage: boolean = await axios(
			`${this.apiPath}/sendActionMessage/`, {
			method: 'POST',
			responseType: 'stream',
			data: {
					chatId: this.devId,
					userRequest: msg
			},
			headers: {
					'X-Access-Token': this.accessToken,
					'AccessKey': this.apiKey
			}
		})
			.then((res: AxiosResponse) => {
				console.log(res.status)
				console.log(res.statusText)
				// console.log('res body => ', res);
				return true
			})
			.catch((e: AxiosError) => {
				console.log('error => ', e.message);
				return false
			})
		return sendMessage

	}

};