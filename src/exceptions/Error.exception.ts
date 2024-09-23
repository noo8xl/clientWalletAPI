import { NotificationService } from "../service/notification/notification.service"

// ErrorInterceptor -> handle an API errors
export default class ErrorInterceptor extends Error {

  message: string
  status: number  
  errors: string[]
	static notification: NotificationService

  constructor(status: number, message: string, errors: string[] = []){
    super(message)
    this.message = message
    this.status = status
    this.errors = errors
		ErrorInterceptor.notification = new NotificationService()
  }

  static async PermissionDenied(action: string): Promise<ErrorInterceptor> {
    await this.notification.sendErrorMessage(`Catch permission denied error at ${action}.`)
    return new ErrorInterceptor(403, "Permission denied.")
  }

	static async ServerError(action: string): Promise<ErrorInterceptor> {
		await this.notification.sendErrorMessage(`${action} was failed.`)
		return new ErrorInterceptor(500, "Internal server error.")
	}

  static BadRequest(action?: string): ErrorInterceptor {
    return new ErrorInterceptor(400, !action ? "Bad request." : action)
  }

  static UnauthorizedError(): ErrorInterceptor {
    return new ErrorInterceptor(401, "Unauthorized error.")
  }

  static NotFoundError(): ErrorInterceptor {
    return new ErrorInterceptor(404, "Not found.")
  }

  static ExpectationFailed(msg?: string): ErrorInterceptor {
    return new ErrorInterceptor(417, !msg ? "Expectation failed." : msg)
  }

  // ############################################################################################## //
  
}