import * as express from "express";
import cryptoController from "../controller/crypto.controller";
import { validateAccessKey } from "../middlewares/accessKeyChecker";
import authController from "../controller/auth.controller";
import customerController from "../controller/customer.controller";

const router = express.Router();

// ################## auth area ##################

// sign a new customer to have access to the API
router.put("/auth/sign-up/", authController.signUpNewClient);

// ################# customer area ####################

// change fiat currency to display at balance
router.patch(
  "/customer/change-currency-display-type/:userId/:fiatName/",
  validateAccessKey,
  customerController.changeFiatCurrencyDisplay,
);

// get last actions log
router.get(
  "/customer/get-actions-log/:userId/:skip/:limit/",
  validateAccessKey,
  customerController.getActionsLog,
);

// delete valid user data to revoke an access to the API
router.put("/customer/revoke-an-access/:userId/", validateAccessKey, customerController.revokeAnAccess);

// ###################### wallet area ######################

// generate a single address by coinName for cur userId
router.get(
  "/wallet/generate/:coinName/:userId/",
  // validateAccessKey,
  cryptoController.generateWalletAddress,
);

router.get(
  "/wallet/create/:userId/",
  // validateAccessKey,
  cryptoController.createWallet,
);

// get balance data by coinName & address
router.get(
  "/wallet/get-balance/:coinName/:address/",
  // validateAccessKey,
  cryptoController.getBalance,
);

// send manual transaction
router.post(
  "/wallet/send_transaction/:coinName/:fromAddress/:toAddress/",
  // validateAccessKey,
  cryptoController.sendManualTransaction,
);

// get test connection between api's ------------
// router.get(
//     '/get_test',
//     cryptoController.getTest)
// <<<<<<<<<<<<<<< ------------------------------

export default router;
