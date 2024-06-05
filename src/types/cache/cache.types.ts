

// // TSX_CACHE -> is transaction data which waiting for approve using 2fa by customer 
// type TSX_CACHE = {
//   userId: string
// }

// // CUSTOMER_CACHE -> is auth data to have an access to the api
// type CUSTOMER_CACHE = {
//   userId: string
//   apiKey: string
// }



// export type CACHE_DTO = CUSTOMER_CACHE | TSX_CACHE ;



export type CACHE_DTO = {
  userId: string
  isApprove: boolean 
}
