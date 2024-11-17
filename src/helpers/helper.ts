import { pbkdf2 } from "crypto";
import ErrorInterceptor from "../exceptions/Error.exception";
import { fiatNameList } from "../config/configs";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Helper -> just a class with a list of functions, which use in different cases
export class Helper {
  // getHashStr -> create a hex string from object
  static async getHashStr(dto: any): Promise<string> {
    let key: string;
    return new Promise((resolve, reject) => {
      pbkdf2(
        Buffer.from(dto.toString()),
        Buffer.from("test-salt-here"),
        4,
        32,
        "sha512",
        (err: Error, derivedKey: Buffer) => {
          if (err) {
            console.error("scrypt func error => ", err);
            return reject(err);
          }
          key = derivedKey.toString("hex");
          resolve(key);
        },
      );
    });
  }

  // validateFiatName -> validate recieved fiat name (if exists)
  static async validateFiatName(f: string): Promise<void> {
    for (let i = 0; i < fiatNameList.length; i++) {
      if (f == fiatNameList[i]) return;
    }
    throw ErrorInterceptor.BadRequest("Got a wrong fiat name.");
  }

  // sendHttpRequest -> send request to the notification api, for example
  static async sendHttpRequest(url: string, options?: AxiosRequestConfig): Promise<void> {
    await axios(url, options)
      .then((res: AxiosResponse) => {
        console.log(res.status);
        console.log(res.statusText);
        // console.log('res body => ', res);
      })
      .catch((e: AxiosError) => {
        throw ErrorInterceptor.ExpectationFailed(`Notification API was failed with error: ${e.message}`);
      });
  }
}
