import {RATE_DATA} from "../../types/wallet/wallet.types";
import axios from "axios";
import ErrorInterceptor from "../../exceptions/Error.exception";
import {Helper} from "../../helpers/helper";


export class WalletHelper {

	readonly coinName: string
	private readonly helper: Helper = new Helper()

	protected constructor(coinName: string) {
		this.coinName = coinName;
	}

	protected async getRate(fiatName: string, balance: number): Promise<RATE_DATA> {
		let rateData: RATE_DATA;
		const coinNameForUrl: string = await this.helper.getCoinApiName(this.coinName)
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
}