import * as express from 'express';
import cryptoController from '../controller/crypto.controller';
const router = express.Router()

// generate address by coinName for cur userId
router.get(
	'/wallet/generate/:coinName/:userId/',
	cryptoController.generateWalletAddress)

// get balance data by coinName & address
router.get(
	'/wallet/get_balance_data/:coinName/:address/',
	cryptoController.getBalance)
	
// send manual transaction
router.post(
	'/wallet/send_transaction/:coinName/:fromAddress/:toAddress/',
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
