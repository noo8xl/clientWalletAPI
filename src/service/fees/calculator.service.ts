

export class Fee {
  coinName: string

  constructor(coinName: string) {this.coinName = coinName }

  public async calculateNetworkFee(): Promise<number> {
    
    return this.calc()
  };

  // ####################################################################
  

  private async calc(): Promise<number> { 
    switch (this.coinName) {
      case "btc":
        
      break;
      case "eth":
      
      break;
      case "trx":
      
      break;
      case "ton":
      
      break;
      case "sol":
      
      break;
    
      default:
        return 0
    }
  }

}