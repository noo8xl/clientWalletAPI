import { CACHE_DTO } from "../../types/cache/cache.types"
import { createClient } from "redis";

export class CacheService {
  private rdb // -> should be typed

  constructor() {}

  // ############### -> setters area

  // setSessionData -> should be used ONLY for user session 
  // public async setSessionData(dto: CACHE_DTO): Promise<void> {
  //   await this.rdb.hSet(dto.apiKey, dto)
  //   await this.rdb.disconnect()
  // }

  // setCachedData -> set date to cache store 
  public async setCachedData(dto: CACHE_DTO): Promise<void> {
		await this.connectClient()
    await this.rdb.hSet(dto.userId, dto.isApprove)
    await this.rdb.disconnect()
  }

  // ############### -> getters area

  // getCachedData -> could be used with customer <userId> as key 
  // or with <address> as key to get tsx cache data
  public async getCachedData(userId: string): Promise<boolean> {
		await this.connectClient()
    let temp = await this.rdb.hGetAll(userId)
    const c  = JSON.parse(JSON.stringify(temp, null, 2))
    console.log("cache is -> ", c);
    
    if (!c) return null

    await this.rdb.disconnect()
    return c;
  }

	public async setManualTransactionCacheData(): Promise<void> {

	}

	public async getManualTransactionCachedData(userId: string): Promise<boolean> {
		// await this.connectClient()
		let temp = await this.rdb.hGetAll(userId)
		const c  = JSON.parse(JSON.stringify(temp, null, 2))
		console.log("cache is -> ", c);

		if (!c) return null

		await this.rdb.disconnect()
		return c;
	}

  // ################################################################################# 

  // clearCachedDataByKey -> delete cached data by key
  public async clearCachedDataByKey(key: string): Promise<void> {
		await this.connectClient()
    await this.rdb.del(key)
    await this.rdb.disconnect()
  }

  // clearAllCachedData -> dpor all cached data * <should be used carefully>
  public async clearAllCachedData(): Promise<void> {
    await this.rdb.flushAll()
    await this.rdb.disconnect()
  }

  // connectClient -> connecting to the redis client 
  private async connectClient(): Promise<void> {
		await this.initClient()
    await this.rdb.connect();
  }

  // initClient -> init redis instance
  private async initClient(): Promise<void> {
    this.rdb = createClient()
      .on('error', async () => { 
        console.log("rdb error ");
			})

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

// export default new CacheService()