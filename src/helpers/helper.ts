import { availableCoins } from "../config/configs";

export class Helper {

  // //getDomainNameFromOrigin -> get domain name
  // async getOriginName(origin: string): Promise<string> {
  //   return origin.split('//')[1]
  // }


  // validateObject -> validate if object keu has an undefined value 
  async validateObject(obj: any): Promise<boolean> {
      for (let i in obj) {
        if (obj[i] === undefined) return false
        if (typeof obj[i] === "object") await this.validateObject(obj[i])
      }
    return true
  }
  
  //getCoinApiName -> get coin full name from coinName to use in API request at getRate *
  async getCoinApiName(coin: string): Promise<string> {
    for (let i = 0; i <= availableCoins.length - 1; i++) {
      console.log('iter => ', availableCoins[i]);
      if (coin !== availableCoins[i].coinName) {
        continue;
      } else {
        return availableCoins[i].coinApiName
      }
    }
  }


  // generatePassword -> generate random string by length
  async generatePassword(passwordLength: number): Promise<string> {
    const numberChars: string = "0123456789";
    const upperChars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars: string = "abcdefghijklmnopqrstuvwxyz";
    const allChars: string = numberChars + upperChars + lowerChars;
    let randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    const result: string = this.shuffleAnArray(randPasswordArray.map(function (x) { return x[Math.floor(Math.random() * x.length)] })).join('');
    return result
  }

  public async prepareCacheData(dto: any): Promise<any>{}

  ////////// -----------------------------------

  private shuffleAnArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  

  
}

