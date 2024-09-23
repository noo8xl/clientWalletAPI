
import {AuthTelegram} from "../telegram/auth.telegram";
import {NotificationTelegram} from "../telegram/notification.telegram";

export class NotificationService {

	private readonly telegramAuthService: AuthTelegram
	private readonly telegramNotificationService: NotificationTelegram

	constructor() {
		this.telegramAuthService = new AuthTelegram()
		this.telegramNotificationService = new NotificationTelegram()
	}

	// sendInfoTelegramMessage -> send 2fa message or other notifications to users
	public async sendInfoTelegramMessage(chatId: number, msg: string): Promise<void> {
		await this.telegramNotificationService.sendMessage(msg, chatId)
	}

	// sendErrorMessage -> send error messages to developer
	public async sendErrorMessage(msg: string): Promise<void> {
		await this.telegramNotificationService.sendMessage(msg)
	}

	public async approveTwoStep(): Promise<void> {

	}

}