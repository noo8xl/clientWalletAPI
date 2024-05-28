import { TelegramNotificationApi } from '../api/notificationCall.api'


// // // errors.js
// class TestInterceptor extends Error { // parent error
//   name: string
//   type: string
//   statusCode: number

//   constructor(message: string, statusCode: number) {
//       super();
//       this.name = this.constructor.name // good practice

//       if (this instanceof LongTitleError) // checking if title or body
//           this.type = 'title'
//       else if (this instanceof LongBodyError)
//           this.type = 'body'
 
//     this.message = message// detailed error message
//     this.statusCode = statusCode // error code for responding to client
//   }
// }

// // extending to child error classes
// class LongTitleError extends TestInterceptor { }
// class LongBodyError extends TestInterceptor { }

// module.exports = {
//     TestInterceptor,
//     LongTitleError,
//     LongBodyError
// }


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