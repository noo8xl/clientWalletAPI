
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import ErrorInterceptor from "../../exceptions/Error.exception";
import {ERR_CHAT_ID, ERROR_BOT_TOKEN, NOTIFICATION_BOT_TOKEN} from "../../config/configs";


export class TelegramHelper {

	private readonly notificationToken = NOTIFICATION_BOT_TOKEN;
	private readonly errorToken = ERROR_BOT_TOKEN;
	private readonly devId = ERR_CHAT_ID;

	constructor() {}

		// sendMessage -> send error messages to the developer or notification to the customer depends on chatId
	protected async sendMessage(msg: string, chatId?: number): Promise<void> {

		let url: string
		const message: string = encodeURI(msg)

		!chatId
			? url = `https://api.telegram.org/bot${this.errorToken}/sendMessage?chat_id=${this.devId}&parse_mode=html&text=${message}`
			: url = `https://api.telegram.org/bot${this.notificationToken}/sendMessage?chat_id=${chatId}&parse_mode=html&text=${message}`

		const opts: AxiosRequestConfig = {
			method: 'GET',
			data: message,
			responseType: 'stream',
		}

		await this.sendRequest(url, opts)
	}


	// sendRequest -> send tg message via just a regular http request
	private async sendRequest(url: string, options?: AxiosRequestConfig): Promise<void> {
		await axios(url, options)
			.then((res: AxiosResponse) => {
				console.log(res.status)
				console.log(res.statusText)
				// console.log('res body => ', res);
			})
			.catch((e: AxiosError) => {
				throw ErrorInterceptor.ExpectationFailed(`Notification API was failed with error: ${e.message}`)
			})
	}


}