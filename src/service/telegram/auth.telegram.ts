import TelegramBot from "node-telegram-bot-api";
import {CustomerDatabaseService} from "../database/customer.db.service";
import {CacheService} from "../cache/cache.service";
import {Customer} from "../../entity/customer/Customer";
import {NOTIFICATION_BOT_TOKEN} from "../../config/configs";
import {TelegramHelper} from "./helper.telegram";


export class AuthTelegram extends TelegramHelper {

	constructor() {
		super();
	}

	// messageInterceptor -> intercept a user message with start bot, get tg id, 2fa to approve transactions
	public async messageInterceptor(): Promise<void> {


		const bot = new TelegramBot(NOTIFICATION_BOT_TOKEN, { polling: true })
		const customerDatabaseService = new CustomerDatabaseService()
		const cacheService = new CacheService()

		bot.onText(/\/start/, async (msg) => await bot.sendMessage(msg.chat.id, `Welcome, ${msg.chat.first_name}! Notification bot is activated.`))
		bot.onText(/\/id/, async (msg) => await bot.sendMessage(msg.chat.id, `Your chat id is: ${msg.chat.id}`))

		bot.on("message", async (msg) => {
			if(msg.text !== "/start" && msg.text !== "/id") {
				let chatId: number = msg.chat.id
				let customer: Customer = await customerDatabaseService.findUserByFilter({telegramId: chatId})
				if (!customer) {
					await bot.sendMessage(chatId, `You are unknown person.`)
					return
				} else {
					// request will be sent to the user before this case *
					let isValid: boolean;
					const message: string = msg.text.trim().toLowerCase()
					switch (message) {
						case "n":
							await bot.sendMessage(chatId, `Transaction will be rejected.`)
							return
						case "y":
							await cacheService.clearCachedDataByKey(customer.getId())
							await cacheService.setCachedData({userId: customer.getId(), isApprove: true})
							await bot.sendMessage(chatId, `Transaction will be approved.`)
							return
						default:
							await bot.sendMessage(chatId, `Unknown user input.`)
							// isValid = await this.customerDatabaseService.validateTwoStepCode(message)
							// !isValid
							// 	? await bot.sendMessage(chatId, `Transaction will be rejected.`)
							// 	: await bot.sendMessage(chatId, `Transaction will be rejected.`)
					}
				}

			}
		})

		bot.on("error", async () => await super.sendMessage("Caught an error in notification bot."))
	}

	// public async sendTwoStep
}