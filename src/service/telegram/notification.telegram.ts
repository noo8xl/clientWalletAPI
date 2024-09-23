import {TelegramHelper} from "./helper.telegram";


export class NotificationTelegram extends TelegramHelper{

	constructor() {
		super();
	}

	public async sendMessage(message: string, chatId?: number): Promise<void> {
		!chatId
			? await super.sendMessage(message)
			: await super.sendMessage(message, chatId);
	}
}