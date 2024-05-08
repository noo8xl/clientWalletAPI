

export abstract class Fee {
  coinName: string

  constructor(coinName: string) {
   this.coinName = coinName 
  }

  abstract calculateNetworkFee(): Promise<number>;

}