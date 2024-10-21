
import ErrorInterceptor from "../../exceptions/Error.exception";

import { spawn } from 'node:child_process';
import { cmdWallet } from "../../config/configs.js";
import { GET_BALANCE_DTO, GET_WALLET_DETAILS_DTO } from "src/dto/crypto/wallet.dto";

export class CmdExecutor {


	// private readonly PATH: string = cmdWallet.path;
	private readonly CMD: string = cmdWallet.cmd
	readonly coinName: string

	protected constructor(coinName: string) {
		this.coinName = coinName;
	}

	protected async createAddressCmd(args: string[]): Promise<string> {
		return await this.command(args)
	}

	protected async getBalanceCmd(args: string[]): Promise<GET_BALANCE_DTO> {

		let cmd: string = await this.command(args)
		let arr = cmd.split(' ')

		let result: GET_BALANCE_DTO = {
      coinName: arr[0],
      coinBalance: Number(arr[1]),
      currencyType: arr[2],
      fiatValue: Number(arr[3]),
    }

		console.log('cmd result is  -> ', result);

    return result
	}

	protected async getWalletDetailsCmd(args: string[]): Promise<GET_WALLET_DETAILS_DTO> {
		const cmd = await this.command(args)
		let arr = cmd.split(' ')
		let result: GET_WALLET_DETAILS_DTO = {
			walletId: Number(arr[0]),
			createdAt: Number(arr[1]),

		}

		return result
	}

	protected async sendTransactionCmd(args: string[]): Promise<string> {
		return await this.command(args)
	}

	protected async getTransactionDetailsCmd(args: string[]): Promise<any> {
		return  await this.command(args)
	}


	// ##################################################################################################

	// command -> accepts an argument list to perform a right command 
	// it returns a string from it stdout and each caller should parse it
	// to object which it will to have 
	private async command(args: string[]): Promise<string>{
			
		let result: string = ''
		let child = spawn(this.CMD, args)
	
		child.stdout.pipe(process.stdout)
		child.stdout.on("data", (chunk) => {
			result += chunk.toString()
		})

		child.on('error', () => {
			console.error('child error');
			process.exit(1)
		})

		return new Promise((resolve) => {
			child.on('exit', (code) => {
				console.log("exit with ", code);
				resolve(result)
			})
		})
	}

}