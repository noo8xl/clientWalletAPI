import { TelegramNotificationApi } from '../api/notification.api'

// ErrorInterceptor -> handle an API errors
export default class ErrorInterceptor extends Error {

  message: string
  status: number  
  errors: string[]

  constructor(status: number, message: string, errors: string[] = []){
    super(message)
    this.message = message
    this.status = status
    this.errors = errors
  }

  static async UnauthorizedError(): Promise<ErrorInterceptor> {
    return new ErrorInterceptor(401, "Unauthorized error.")
  }

  //res?: express.Response,
  static async PermissionDenied(action: string): Promise<ErrorInterceptor> {
    let n = new TelegramNotificationApi()
    await n.sendErrorMessage(`Catch permission denied error at ${action}.`)
    return new ErrorInterceptor(403, "Permission denied.")
  }

  static async BadRequest(action?: string): Promise<ErrorInterceptor> {
    let n = new TelegramNotificationApi()
    await n.sendErrorMessage(`Catch an error. ${action}.`)

    return new ErrorInterceptor(400, `${!action ? "Bad request." : action}`)
  }

  static async ServerError(action: string): Promise<ErrorInterceptor> {
    let n = new TelegramNotificationApi()
    await n.sendErrorMessage(`${action} was failed.`)
    return new ErrorInterceptor(500, "Internal server error.")
  }

  static async NotFoundError(): Promise<ErrorInterceptor> {
    return new ErrorInterceptor(404, "Not found.")
  }

  // ############################################################################################## //
  
  // private async sendErrorMessage(action: string): Promise<void> {
  //   await this.notification.sendErrorMessage(`Catch permission denied error at ${action}.`)
  // }
}