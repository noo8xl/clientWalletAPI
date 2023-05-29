import ApiError from "src/exceptions/apiError";
import { availableCoins } from "./coinNamesForApi";

export async function getCoinApiName(coin: string): Promise<string> {
    for (let i = 0; i <= availableCoins.length - 1; i++) {
      console.log('iter => ', availableCoins[i]);
      if (coin !== availableCoins[i].coinName) {
        continue;
      } else {
        return availableCoins[i].coinApiName
      }
    }
    throw await ApiError.NotFoundError('coin name for api')
  }