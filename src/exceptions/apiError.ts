import { TelegramNotificationApi } from '../api/notificationCall.api'
import { Response } from 'express'

// ApiError -> handle an API errors 
export class ApiError {
  name: string
  message: string
  error: string

  private readonly res: Response
  private readonly notification: TelegramNotificationApi = new TelegramNotificationApi()

  public async UnauthorizedError(): Promise<void> {
    this.res.status(401)
    this.res.json({message: "Unauthorized error."})
    this.res.end()
  }

  //res?: express.Response,
  public async PermissionDenied(action: string): Promise<void> {
    await this.notification.sendErrorMessage(`Catch permission denied error at ${action}.`)
    this.res.status(403)
    this.res.json({message: "Permission denied."})
    this.res.end()
    // throw new Error("Permission denied.")
  }

  public async BadRequest(action?: string): Promise<void> {
    await this.notification.sendErrorMessage(`Catch an error. ${action}.`)
    this.res.status(400)
    this.res.json({message: "Bad request."})
    this.res.end()
  }

  public async ServerError(action: string): Promise<void> {
    await this.notification.sendErrorMessage(`${action} was failed.`)
    this.res.status(500)
    this.res.json({message: "Internal server error."})
    this.res.end()
  }

  public async NotFoundError(): Promise<void> {
    this.res.status(404)
    this.res.json({message: "Not found."})
    this.res.end()
  }

  // ############################################################################################## //
  
  private sendErrorMessage(): any {}
}