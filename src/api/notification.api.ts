

// send telegram msg to user or errors to developer 

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { 
	ERR_CHAT_ID,
	ERROR_BOT_TOKEN,
	NOTIFICATION_BOT_TOKEN
} from "../config/configs"

export class TelegramNotificationApi {
  private readonly notifToken = NOTIFICATION_BOT_TOKEN
	private readonly errorToken = ERROR_BOT_TOKEN
	private readonly devId = ERR_CHAT_ID

	// sendInfoMessage -> send 2fa message or other notifications to users 
  public async sendInfoMessage(chatId: number, msg: string): Promise<boolean> {
		const message: string = encodeURI(msg)
		const url: string = `https://api.telegram.org/bot${this.notifToken}/sendMessage?chat_id=${chatId}&parse_mode=html&text=${message}`
		
		const opts: AxiosRequestConfig = {
			method: 'GET',
			data: msg,
			responseType: 'stream',
		}
		return await this.sendRequest(url, opts)
  }

	// sendErrorMessage -> send error messages to developer
	public async sendErrorMessage(msg: string): Promise<boolean> {
		console.log('tg interact');
		const message: string = encodeURI(msg)
		const url: string = `https://api.telegram.org/bot${this.errorToken}/sendMessage?chat_id=${this.devId}&parse_mode=html&text=${message}`
		
		const opts: AxiosRequestConfig = {
			method: 'GET',
			data: msg,
			responseType: 'stream',
		}
		return await this.sendRequest(url, opts)
	}

  // ============================================================================================================= //
  // ############################################# private usage area ############################################ //
  // ============================================================================================================= //

	// sendRequest -> send http request with settend params
	private async sendRequest(url: string, options: AxiosRequestConfig): Promise<boolean> {
		return await axios(url,options)
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
	}

};