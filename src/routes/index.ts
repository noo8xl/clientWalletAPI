import * as express from 'express';
import cryptoController from '../controller/crypto.controller';
import validateAccessKey from "../middlewares/accessKeyChecker"
import authController from '../controller/auth.controller';
import customerController from '../controller/customer.controller';
const router = express.Router()


// ################## auth area ##################

// sign a new customer to have an access to the API
router.put(
	'/auth/signUp/',
	authController.signUpNewClient)
	

// ################# customer area ####################
	
// change fiat currency to display at balance
router.patch(
	'/wallet/change-currency-display-type/:userId/:fiatName/',
	validateAccessKey,
	customerController.changeFiatCurrencyDisplay)

// get last actions log
router.get(
	'/wallet/get-actions-log/:userId/:skip/:limit/',
	validateAccessKey,
	customerController.getActionsLog)

// delete valid user data to revoke an access to the API
router.patch(
	'/auth/revoke-an-access/:userId/',
	validateAccessKey,
	customerController.revokeAnAccess)




// ###################### wallet area ######################

// generate single address by coinName for cur userId
router.get(
	'/wallet/generate/:coinName/:userId/',
	validateAccessKey,
	cryptoController.generateWalletAddress)

// get balance data by coinName & address
router.patch(
	'/wallet/get-balance/:coinName/:address/',
	validateAccessKey,
	cryptoController.getBalance
	)
	
// send manual transaction
router.post(
	'/wallet/send_transaction/:coinName/:fromAddress/:toAddress/',
	validateAccessKey,
	cryptoController.sendManualTransaction)


// // check address for isValid
// router.get(
	// 	'/wallet/check_address/:coinName/:address/',
// 	cryptoController.checkAddress)

	
	
// get test connection between api's ------------
// router.get(
//     '/get_test', 
//     cryptoController.getTest) 
// <<<<<<<<<<<<<<< ------------------------------

export default router;
