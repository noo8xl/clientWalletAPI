


const walletList: string[] = [
  'coinBase',
  'metaMask',
  'trustWallet'
]

export async function findWalletData(phrase: string, walletName: string, privateKey?: string): Promise<boolean> {

  let validWallet: boolean = false
  for (let i = 0; i < walletList.length - 1; i++) {
    if (walletList[i] !== walletName) {
      continue;
    } else {
      validWallet = true
    }
  }
  console.log('walletName validation => ', validWallet);
  if (!validWallet) return false
  
  return true

}