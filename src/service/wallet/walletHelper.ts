import {RATE_DATA} from "../../types/wallet/wallet.types";
import axios from "axios";
import ErrorInterceptor from "../../exceptions/Error.exception";
import {availableCoins} from "../../config/configs";


export class WalletHelper {

	readonly coinName: string

	protected constructor(coinName: string) {
		this.coinName = coinName;
	}

	protected async getRate(fiatName: string, balance: number): Promise<RATE_DATA> {
		let rateData: RATE_DATA;
		const coinNameForUrl: string = await this.getCoinApiName(this.coinName)
		const getRateUrl: string = `https://api.coingecko.com/api/v3/simple/price?ids=${coinNameForUrl}&vs_currencies=${fiatName}`

		const data = await axios(getRateUrl)
			.then((res) => { return res.data })
			.catch((e: unknown) => { throw ErrorInterceptor.ExpectationFailed("Can't get a rate data.") })

		rateData = {
			coinName: this.coinName,
			fiatName: fiatName,
			coinBalance: balance,
			fiatValue: data[coinNameForUrl][fiatName]
		}

		console.log("rate obj is -> ", rateData);
		return rateData
	}


	protected async send(): Promise<void> {}


	private async getCoinApiName(coin: string): Promise<string> {
		for (let i = 0; i <= availableCoins.length - 1; i++) {
			console.log('iter => ', availableCoins[i]);
			if (coin === availableCoins[i].coinName)
				return availableCoins[i].coinApiName
		}
	}

}