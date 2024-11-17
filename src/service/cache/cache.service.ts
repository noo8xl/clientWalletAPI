import { createClient } from "redis";
import ErrorInterceptor from "../../exceptions/Error.exception";
import { WALLET_REQUEST_DTO } from "src/dto/crypto/wallet.dto";
import { AUTH_CLIENT_DTO } from "src/dto/auth/client.dto.type";

export class CacheService {
  private rdb; // -> should be typed

  constructor() {}

  public async setUserCache(apiKey: string, customerId: string): Promise<void> {
    try {
      await this.connectClient();

      this.rdb.set(apiKey, customerId); // will be expired in 30 min
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(`cache server was failed at <setUserCache> with err ${e}`);
    }
  }

  public async getUserCache(apiKey: string): Promise<any> {
    try {
      await this.connectClient();

      let temp = await this.rdb.get(apiKey);
      let c = JSON.parse(JSON.stringify(temp, null, 2));
      console.log("cache is -> ", c);

      return c;
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(`cache server was failed at <getUserCache> with err ${e}`);
    } finally {
      await this.rdb.disconnect();
    }
  }

  public async setTsxCache(userId: string, payload: WALLET_REQUEST_DTO): Promise<void> {
    try {
      await this.connectClient();

      this.rdb.hSet(userId, payload, "PX", 900_000); // will be expired in 15 min
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(`cache server was failed at <setTsxCache> with err ${e}`);
    } finally {
      await this.rdb.disconnect();
    }
  }

  public async getTsxCache(userId: string): Promise<WALLET_REQUEST_DTO> {
    try {
      await this.connectClient();

      let temp = await this.rdb.hGetAll(userId);
      let c: WALLET_REQUEST_DTO = JSON.parse(JSON.stringify(temp, null, 2));
      console.log("cache is -> ", c);

      return c;
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(`cache server was failed at <getTsxCache> with err ${e}`);
    } finally {
      await this.rdb.disconnect();
    }
  }

  // #################################################################################

  // clearCachedDataByKey -> delete cached data by key
  public async clearCachedDataByKey(key: string): Promise<void> {
    try {
      await this.connectClient();
      await this.rdb.del(key);
    } catch (e: unknown) {
      throw await ErrorInterceptor.ServerError(
        `cache server was failed at <clearCachedDataByKey> with err ${e}`,
      );
    } finally {
      await this.rdb.disconnect();
    }
  }

  // // clearAllCachedData -> dpor all cached data * <should be used carefully>
  // public async clearAllCachedData(): Promise<void> {
  //   await this.rdb.flushAll()
  //   await this.rdb.disconnect()
  // }

  // connectClient -> connecting to the redis client
  private async connectClient(): Promise<void> {
    await this.initClient();
    await this.rdb.connect();
  }

  // initClient -> init redis instance
  private async initClient(): Promise<void> {
    this.rdb = createClient();

    this.rdb.on("connect", async () => {
      console.log("rdb connected ");
    });

    this.rdb.on("error", async (err: any) => {
      console.log("rdb init error ", err);
      return;
    });

    this.rdb.on("disconnect", async () => {
      console.log("rdb was disconnected ");
    });

    // const client = createClient({
    //   username: 'default', // use your Redis user. More info https://redis.io/docs/management/security/acl/
    //   password: 'secret', // use your password here
    //   socket: {
    //       host: 'my-redis.cloud.redislabs.com',
    //       port: 6379,
    //       tls: true,
    //       key: readFileSync('./redis_user_private.key'),
    //       cert: readFileSync('./redis_user.crt'),
    //       ca: [readFileSync('./redis_ca.pem')]
    //   }
    // });
  }
}

export default new CacheService();
