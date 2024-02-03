import * as ethWallet from 'ethereumjs-wallet'
import * as web3 from '@solana/web3.js'
import crypto from 'crypto'
import TronWeb from 'tronweb'
import { TonClient, WalletContractV4 } from "ton";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import bchaddr from 'bchaddrjs'
import { TRON_API_KEY } from '../../config/configs';
import database from '../database.service'
import { coinList } from '../lib.helper/coinList';
import ApiError from '../../exceptions/apiError';
import { ACCOUNT_WALLET, ACCOUNT_WALLET_ITEM, WALLET_DATA, WALLET_LIST } from '../../interfaces/Wallets.interface';


class Wallet {
  private coinName: string
  private userId: string
  private readonly tronApiKey = TRON_API_KEY

  constructor(payload: any) {
    this.coinName = payload.coinName
    this.userId = payload.userId
  }

  public async CreateOneTimeAddress(): Promise<string> {

    switch (this.coinName) {
      case coinList[0]:
        return await this.genWalletInBitcoinNetwork()
      case coinList[1]:
        return await this.genWalletInEthereumNetwork()
      case coinList[2]:
        return await this.genWalletInTronNetwork()
      case coinList[3]:
        return await this.genWalletInTheOpenNetwork()
      default:
        throw await ApiError.BadRequest('unknown coin name at address gen')
    }
  }

  public async CreateAccountWallets(): Promise<ACCOUNT_WALLET> {
    
    let userResponse: ACCOUNT_WALLET;
    let walletArr: WALLET_LIST;
    // for (let i = 0; i<= coinList.length -1, i++;) {
    //   const result: ACCOUNT_WALLET_ITEM = await this.
    // }

    await database.saveUserWallet(walletArr)
    return userResponse;
  }

  // ============================================================================================================= //
  // ================================== private methods for internal usage only ================================ //
  // ============================================================================================================= //


  private async genWalletInBitcoinNetwork(): Promise<string>{
    // https://javascript.plainenglish.io/generate-your-own-bitcoin-wallet-within-5-minutes-3c36176b47ee?gi=c00ebff5e60f
    // https://github.com/bitpay/bitcore/tree/master/packages/bitcore-lib
    // https://github.com/BitGo/BitGoJS/tree/master/modules/utxo-lib

    const network = bitcoin.networks.bitcoin
    // use 'm/44'/1'/0'/0 for testnet
    const path = `m/44'/1'/0'/0` 

    const mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const root = bip32.fromSeed(seed, network)

    const account = root.derivePath(path)
    const node = account.derive(0).derive(0)

    console.log('mnemonic => ', mnemonic)
    console.log('seed => ', seed)
    console.log('root => ', root)

    const btcAddress = bitcoin.payments.p2pkh({
      pubkey: node.publicKey,
      network: network
    }).address
    
    console.log(`
      wif: ${node.toWIF()},
      d: ${typeof node.publicKey}, ${typeof node.privateKey}
      pubKey: ${node.publicKey.toString()},
      privKey: ${node.privateKey.toString()},
      address: ${btcAddress}
    `);


    // var utxo = {
    //   "txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
    //   "outputIndex" : 0,
    //   "address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
    //   "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
    //   "satoshis" : 50000
    // };

    
  // var transaction = new bitcore.Transaction()
  // .from(utxo)
  // .to('1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK', 15000)
  // .sign(privateKey);
  //
  //   return
  //

    // https://www.npmjs.com/package/bchaddrjs
    const bchAddress = bchaddr.toCashAddress(btcAddress).split(':')[1]

    const btcObject: WALLET_DATA = {
      coinName: 'BTC',
      address: btcAddress,
      privateKey: node.toWIF(),
      seed: mnemonic,
      publicKey: '',
    }

    const bchObject: WALLET_DATA = {
      coinName: 'BCH',
      address: bchAddress,
      privateKey: node.toWIF(),
      seed: mnemonic,
      publicKey: '',
    }

    console.log(`
      Generated wallet: 
      - btc address : ${btcAddress},
      - bch address : ${bchAddress}
      - key : ${node.toWIF()},
      - mnemonic : ${mnemonic}
    `);

    await this.saveDepositData(btcObject, this.userId);


    return btcAddress

  }

  private async genWalletInEthereumNetwork(): Promise<string> {
     // https://levelup.gitconnected.com/generate-ethereum-address-using-node-js-a6a73f42a4cf

    const EthWallet: any = ethWallet.default.generate();

    // console.log(`
    //   Generated wallet: 
    //   - address : ${EthWallet.getAddressString()},
    //   - privKey : ${EthWallet.getPrivateKeyString()},
    //   - pubKey : ${EthWallet.getPublicKeyString()}
    // `);

    const ethObject: WALLET_DATA = {
      coinName: 'ETH',
      address: EthWallet.getAddressString(),
      privateKey:EthWallet.getPrivateKeyString(),
      publicKey: EthWallet.getPublicKeyString()
    }

    return ethObject.address
  }

  private async genWalletInTronNetwork(): Promise<string> {
    // https://www.npmjs.com/package/tronweb

    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io/',
      headers: { "TRON-PRO-API-KEY": this.tronApiKey }
    })

    const trxAccount: any = await tronWeb.createAccount()

  //   console.log(`
  //     Generated wallet: 
  //     - address : ${trxAccount.address.base58},
  //     - privKey : ${trxAccount.privateKey},
  //     - pubKey : ${trxAccount.publicKey}
  //  `);

    const trxObject: WALLET_DATA = {
      coinName: 'TRX',
      address: trxAccount.address.base58,
      privateKey: trxAccount.privateKey,
      publicKey: trxAccount.publicKey
    }

    return trxObject.address
  }

  private async genWalletInTheOpenNetwork(): Promise<string> {
  // https://github.com/toncenter/tonweb
  // https://ton-community.github.io/ton/

  let mnemonics = await mnemonicNew();
  let keyPair = await mnemonicToPrivateKey(mnemonics);

  // Create wallet contract
  let workchain: number = 0; // Usually you need a workchain 0
  let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
  
  const obj: WALLET_DATA = {
    coinName: 'TON',
    address: String(wallet.address),
    privateKey: keyPair.secretKey,
    publicKey: keyPair.publicKey
  }

  return obj.address
  }


  // private async saveWalletData(obj: WALLET_DATA): Promise<void> {

  //   const expiredDate: number = (new Date().getTime()) + (1000 * 60 * 30)


  //   // const objForDatabase: DEPOSIT_WALLET_PARAMS = {
  //   //   coinName: coinData.coinName,
  //   //   address: coinData.address,
  //   //   publicKey: coinData.publicKey,
  //   //   privateKey: coinData.privateKey,
  //   //   expiredDate,
  //   //   userId
  //   // }

  //   await database.saveDepositWallet()
  // }

  //  private async genWalletInSolanaNetwork(): Promise<string> {
  //   // https://docs.solana.com/developing/clients/javascript-reference

  //   let account = web3.Keypair.generate();

  //   // Create a Program Address
  //   let highEntropyBuffer = crypto.randomBytes(31);
  //   let accountFromSecret = web3.Keypair.fromSecretKey(account.secretKey);

  //   let base58publicKey: any = accountFromSecret.publicKey
  //   let programAddressFromKey = await web3.PublicKey.createProgramAddress(
  //     [highEntropyBuffer.slice(0, 31)],
  //     base58publicKey,
  //   );
 
  // //   console.log(`
  // //     Generated wallet: 
  // //     - address: ${programAddressFromKey},
  // //     - privKey : ${accountFromSecret.secretKey},
  // //     - pubKey : ${accountFromSecret.publicKey}
  // //  `);

  //   const dataObject: WALLET_DATA = {
  //     coinName: 'SOL',
  //     address: programAddressFromKey.toString(),
  //     privateKey: accountFromSecret.secretKey,
  //     publicKey: accountFromSecret.publicKey
  //   }
  //   return dataObject
  // }

}

export default Wallet;