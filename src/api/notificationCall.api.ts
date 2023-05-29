

// send telegram msg 

import axios, { AxiosError, AxiosResponse } from "axios"


class Telegram {
    private readonly NOTIFICATION_API_KEY: string = process.env.NOTIFICATION_API_KEY
    private readonly NOTIFICATION_X_ACCESS_TOKEN: string = process.env.X_ACCESS_TOKEN
    private readonly NOTIFICATION_API_PATH: string = process.env.NOTIFICATION_API_PATH
  
    constructor() {}

    async sendTransactionInfo(chatId: number, message: string): Promise<any> {

			const sendMessage: any = await axios(
				`${this.NOTIFICATION_API_PATH}/sendActionMessage/`, {
				method: 'POST',
				responseType: 'stream',
				data: {
						chatId,
						userRequest: message
				},
				headers: {
						'X-Access-Token': this.NOTIFICATION_X_ACCESS_TOKEN,
						'AccessKey': this.NOTIFICATION_API_KEY
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


		// some func
		private async doSome() {
			return
		}

}


export default new Telegram()