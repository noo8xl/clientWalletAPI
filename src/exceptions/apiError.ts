// import telegram from '../api/telegram_api'

export default class ApiError extends Error {
  message: string
  status: number
  errors: string[]

  constructor(status: number, message: string, errors: string[] = []) {
    super(message)
    this.message = message
    this.status = status
    this.errors = errors
  }

  static async UnauthorizedError(): Promise<ApiError> {
    return new ApiError(401, 'unauthorized user')
  }

  //res?: express.Response,
  static async PermissionDenied(action: string): Promise<ApiError> {
    // const sendErr: boolean  = await telegram.sendErrorData(403, action)
    // console.log('telegram api status => ', sendErr);
    return new ApiError(403, 'permission denied')
  }

  static async BadRequest(message?: string): Promise<ApiError> {
    return new ApiError(400, 'bad request')
  }

  static async ServerError(action: string): Promise<ApiError> {
    // const sendErr: boolean = await telegram.sendErrorData(500, `${action} was failed.`)
    // console.log('telegram api status => ', sendErr);
    return new ApiError(500, 'internal server error')
  }

  static async NotFoundError(action: string): Promise<ApiError> {
    // const sendErr: boolean = await telegram.sendErrorData(500, `${action} was failed.`)
    // console.log('telegram api status => ', sendErr);
    return new ApiError(404, `can't find any ${action} data`)
  }

  // ############################################################################################## //
  
  private sendErrorMessage(): any {}
}