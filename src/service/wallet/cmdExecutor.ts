import ErrorInterceptor from "../../exceptions/Error.exception";

import { execFile } from 'node:child_process';
import util from "node:util"
const executeCmd = util.promisify(execFile)


export class CmdExecutor {

	private readonly CMD: string = "wallet-cli";
	readonly coinName: string

	protected constructor(coinName: string) {
		this.coinName = coinName;
	}

	protected async createAddressCmd(args: string[]): Promise<string> {
		const cmd = await executeCmd(this.CMD, args)
    if(cmd.stderr !== null ) throw ErrorInterceptor.ExpectationFailed(cmd.stderr)
    return cmd.stdout
	}

	protected async getBalanceCmd(args: string[]): Promise<number> {
		    
    // ----> resp obj is: 
		// {
    //   coinName: 'ton',
    //   coinBalance: 0.0,
    //   currencyType: 'usd',
    //   balInUsd: 13.098,
    // }
		
		const cmd = await executeCmd(this.CMD, args)
    if(cmd.stderr !== null ) throw ErrorInterceptor.ExpectationFailed(cmd.stderr)
    return Number(cmd.stdout)
	}

	protected async getWalletDetailsCmd(args: string[]): Promise<any> {
		const cmd = await executeCmd(this.CMD, args)
    if(cmd.stderr !== null ) throw ErrorInterceptor.ExpectationFailed(cmd.stderr)
    return cmd.stdout
	}

	protected async sendTransactionCmd(args: string[]): Promise<string> {
		const cmd = await executeCmd(this.CMD, args)
    if(cmd.stderr !== null ) throw ErrorInterceptor.ExpectationFailed(cmd.stderr)
    return cmd.stdout // as a transaction hash
	}

	protected async getTransactionDetailsCmd(args: string[]): Promise<any> {
		const cmd = await executeCmd(this.CMD, args)
    if(cmd.stderr !== null ) throw ErrorInterceptor.ExpectationFailed(cmd.stderr)
    return cmd.stdout
	}

}