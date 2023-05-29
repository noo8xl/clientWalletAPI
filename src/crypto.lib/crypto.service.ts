import { WALLET_DATA } from "src/interfaces/waletData.interface";
import { coinList } from './lib.helper/coinList'
import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import bchaddr from 'bchaddrjs'
import * as ethWallet from 'ethereumjs-wallet'
import * as web3 from '@solana/web3.js'
import crypto from 'crypto'
import TronWeb from 'tronweb'
import { TonClient, WalletContractV4 } from "ton";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import ApiError from "../exceptions/apiError";
import Balance from './baseUsage/balance_checker'
import { TSX_DATA } from "../interfaces/transactionData.interface";
import Transaction from "./baseUsage/sendTransaction";


class CryptoService {

  async generateWalletAddressByCoinName(coinName: string): Promise<WALLET_DATA | WALLET_DATA[]> {

    switch (coinName) {
      case coinList[0]:
        return this.GenWalletInBitcoinNetwork()
      case coinList[1]:
        return this.GenWalletInBitcoinNetwork()
      case coinList[2]:
        return this.GenWalletInEthereumNetwork()
      case coinList[3]:
        return this.GenWalletInEthereumNetwork()
      case coinList[4]:
        return this.GenWalletInTronNetwork()
      case coinList[5]:
        return this.GenWalletInTronNetwork()
      case coinList[6]:
        return this.GenWalletInSolanaNetwork()
      case coinList[7]:
        return this.GenWalletInTheOpenNetwork()
      default:
        throw await ApiError.BadRequest()
    }
  }

  async checkAddress(coinName: string, address: string): Promise<boolean> {

    return true
  }

  async getBalance(coinName: string, address: string): Promise<number> {
    return await new Balance(coinName, address).CheckBalance()
  }

  async sendManualTransaction(txsInfo: TSX_DATA): Promise<boolean> {
    return new Transaction(txsInfo).sendTransaction()
  }

// ============================================================================================================= //
// ================================== protected methods for internal usage only ================================ //
// ============================================================================================================= //

  protected async GenWalletInBitcoinNetwork(): Promise<WALLET_DATA[] | any>{
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

    return
    

    // https://www.npmjs.com/package/bchaddrjs
    // const bchAddress = bchaddr.toCashAddress(btcAddress).split(':')[1]

  //   const btcObject: WALLET_DATA = {
  //     coinName: 'BTC',
  //     address: btcAddress,
  //     key: node.toWIF(),
  //     seedPhrase: mnemonic
  //   }

  //   const bchObject: WALLET_DATA = {
  //     coinName: 'BCH',
  //     address: bchAddress,
  //     key: node.toWIF(),
  //     seedPhrase: mnemonic
  //   }

  //   console.log(`
  //     Generated wallet: 
  //     - btc address : ${btcAddress},
  //     - bch address : ${bchAddress}
  //     - key : ${node.toWIF()},
  //     - mnemonic : ${mnemonic}
  // `);

  //  return [ btcObject, bchObject ]
  }

  protected async GenWalletInEthereumNetwork(): Promise<WALLET_DATA[]> {
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
    const usdtObject: WALLET_DATA = {
      coinName: 'USDT/ERC20',
      address: EthWallet.getAddressString(),
      privateKey:EthWallet.getPrivateKeyString(),
      publicKey: EthWallet.getPublicKeyString()
    }

    return [ ethObject, usdtObject ]
  }

  protected async GenWalletInTronNetwork(): Promise<WALLET_DATA[]> {
    // https://www.npmjs.com/package/tronweb

    const TRON_API_KEY: string | undefined = process.env.TRON_API_KEY
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io/',
      headers: { "TRON-PRO-API-KEY": TRON_API_KEY }
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
 
    const trxUsdtObject: WALLET_DATA = {
      coinName: 'USDT/TRC20',
      address: trxAccount.address.base58,
      privateKey: trxAccount.privateKey,
      publicKey: trxAccount.publicKey
    }

    return [ trxObject, trxUsdtObject ]
  }

  protected async GenWalletInSolanaNetwork(): Promise<WALLET_DATA | any> {
    // https://docs.solana.com/developing/clients/javascript-reference

    let account = web3.Keypair.generate();

    // Create a Program Address
    let highEntropyBuffer = crypto.randomBytes(31);
    let accountFromSecret = web3.Keypair.fromSecretKey(account.secretKey);

    let base58publicKey: any = accountFromSecret.publicKey
    let programAddressFromKey = await web3.PublicKey.createProgramAddress(
      [highEntropyBuffer.slice(0, 31)],
      base58publicKey,
    );
 
  //   console.log(`
  //     Generated wallet: 
  //     - address: ${programAddressFromKey},
  //     - privKey : ${accountFromSecret.secretKey},
  //     - pubKey : ${accountFromSecret.publicKey}
  //  `);

    const dataObject: WALLET_DATA = {
      coinName: 'SOL',
      address: programAddressFromKey.toString(),
      privateKey: accountFromSecret.secretKey,
      publicKey: accountFromSecret.publicKey
    }
    return dataObject
  }
  
  protected async GenWalletInTheOpenNetwork(): Promise<WALLET_DATA | any> {
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

  return obj
  }

}

export default new CryptoService()