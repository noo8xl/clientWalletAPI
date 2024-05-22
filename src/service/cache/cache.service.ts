import { CUSTOMER } from "../../types/customer/customer.types";
import { CACHE_DTO } from "../../types/cache/cache.types"
// import { Helper } from "../../helpers/helper";
import { createClient } from "redis";
import { ApiError } from "../../exceptions/apiError";


export class CacheService {
  private client: any // redis client <-

  // private readonly helper: Helper = new Helper()
  private readonly errorHandler: ApiError = new ApiError()

  constructor() { this.connectClient() }

  // ############### -> setters area


  // setSessionData -> should be used ONLY for user session 
  public async setSessionData(dto: CACHE_DTO): Promise<void> {
    await this.client.hSEt(dto.apiKey, dto)
    await this.client.disconnect()
  }


  // setCachedData -> set date to cache store 
  public async setCachedData(dto: CACHE_DTO): Promise<void> {
    await this.client.hSEt(dto.userId, dto)
    await this.client.disconnect()
  }

  // ############### -> getters area

  // getCachedData -> could be used with customer <userId> as key 
  // or with <address> as key to get tsx cache data
  public async getCachedData(key: string): Promise<CACHE_DTO> {
    let c: CACHE_DTO;
    let temp: CACHE_DTO = await this.client.hGetAll(key)
    c = JSON.parse(JSON.stringify(temp, null, 2))
    if (!c) return null

    await this.client.disconnect()
    return c;
  }

  // ################################################################################# 

  // clearCachedDataByKey -> delete cached data by key
  public async clearCachedDataByKey(key: string): Promise<void> {
    await this.client.del(key)
    await this.client.disconnect()
  }

  // clearAllCachedData -> dpor all cached data * <should be used carefully>
  public async clearAllCachedData(): Promise<void> {
    await this.client.flushAll()
    await this.client.disconnect()
  }



  // connectClient -> connecting to the redis client 
  private async connectClient(): Promise<void> {
    this.client = await createClient().
      on('connect', () => { console.log("redis is connected!"); }).
      on('error', async() => { throw await this.errorHandler.ServerError("Cache DB connection") }).
      connect();

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