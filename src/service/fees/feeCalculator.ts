import ApiError from "../../exceptions/apiError"
import { coinList } from "./coinList"


class FeeCalculator {
  coinName: string

  constructor(coin: string) {
    this.coinName = coin
  }


  public async calculateFeeInNetwork() {
    switch (this.coinName) {
      case coinList[0]:
        return await this.GetBitcoinNetworkFee()
      // case coinList[2]:
      //   return this.getEthereumNetworkBalance(address)
      // case coinList[3]:
      //   return this.getEthereumNetworkBalance(address)
      // case coinList[4]:
      //   return this.getTronNetworkBalance(address)
      // case coinList[5]:
      //   return this.getTronNetworkBalance(address)
      // case coinList[6]:
      //   return this.getSolanaNetworkBalance(address)
      // case coinList[7]:
      //   return this.getTelegramNetworkBalance(address)
      default:
        throw await ApiError.BadRequest()
    }
  }

  
  private async GetBitcoinNetworkFee(): Promise<number>{
    return 0
  }
}

export default FeeCalculator;