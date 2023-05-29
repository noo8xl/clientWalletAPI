import { coinList } from '../lib.helper/coinList'

export async function addressValidator(address: string, coinName: string): Promise<boolean> {
  if (!address || !coinName) return false
  const coin: string = coinName.toLowerCase()

  if (coin === coinList[0] || coin === coinList[1]) {
    const defaultSymbolOne: string = 'bc1'
    const defaultSymbolTwo: string = '1B'
    const symbolsArray: string[] = address.split('')
    const baseSymbolsOne: string = symbolsArray[0] + symbolsArray[1] + symbolsArray[2]
    const baseSymbolsTwo: string = symbolsArray[0] + symbolsArray[1]

    if (baseSymbolsOne !== defaultSymbolOne || baseSymbolsOne !== defaultSymbolOne) return false

    if (baseSymbolsOne === defaultSymbolOne) {
      if (
        symbolsArray.length < 26 ||
        symbolsArray.length > 45) {
        return false
      }
      return true
    }

    if (baseSymbolsTwo === defaultSymbolTwo) {
      if (
        symbolsArray.length < 26 ||
        symbolsArray.length > 45) {

        return false
      }
      return true
    }
    return false
  }

  // etherium network ----------
  if (coin === coinList[2] || coin === coinList[3]) {
    const defaultSymbol: string = '0x'
    const symbolsArray: string[] = address.split('')
    const baseSymbols: string = symbolsArray[0] + symbolsArray[1]
    if (baseSymbols === defaultSymbol) {
      if (
        symbolsArray.length < 35 ||
        symbolsArray.length > 45
      ) {
        return false
      }
      return true
    }
    return false
  }

  // tron network ----------
  if (coin === coinList[4] || coin === coinList[5]) {
    const defaultSymbol: string = 'T'
    const symbolsArray: string[] = address.split('')
    if (symbolsArray[0] === defaultSymbol) {
      if (
        symbolsArray.length < 26 ||
        symbolsArray.length > 45
      ) {
        return false
      }
      return true
    }
    return false
  }

  // solana network --------
  if (coin === coinList[6]) {

  }

  return false
}