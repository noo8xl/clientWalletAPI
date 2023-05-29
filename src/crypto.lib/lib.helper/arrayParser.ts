
// const chars: string[] =
//   [
//     'a', 'b', 'c', 'd', 'e', 'f',
//     'g', 'h', 'i', 'j', 'k', 'l', 'm',
//     'n', 'o', 'p', 'q', 'r', 's', 't',
//     'u', 'v', 'w', 'x', 'y', 'z'
//   ]

// async function decrypting(param: number): Promise<string> {
//   let index: number = param - 1
//   if (param <= 0) index = 0
//   return chars[index]
// }

// export async function DataDecrypting(data: string): Promise<string> {
//   const arrData: string[] = data.split('/')

//   let word: string[] = []
//   let phrase: string[] = []

//   for (let x = 0; x <= arrData.length - 1; x++) {
//     const array: string[] = arrData[x].split(' ')

//     for (let j = 0; j < array.length; j++) {

//       if (array[j] !== '') {
//         const char: string = await decrypting(+array[j])
//         word.push(char)
//         if (word.length === array.length) {
//           phrase.push(word.join().replaceAll(',', ' ').replaceAll(';', '').replaceAll(' ', ''))
//           word = []
//           continue;
//         }
//       }
//     }
//   }

//   let curPh = phrase.join().replaceAll(',', ' ')
//   let fxx: string = curPh.toString()
//   console.log('decrypted phrase is  => ', fxx);
//   return fxx
// }

// async function encrypting(letter: string): Promise<number> {
//   for (let i = 0; i < chars.length - 1; i++) {
//     if (chars[i] !== letter) {
//       continue;
//     } else {
//       return i + 1
//     }
//   }
// }


// export async function DataEncrypting(data: string): Promise<string> {

//   console.log('received data =>', data);

//   const array: string[] = data.split(' ')
//   console.log('array => ', array);

//   let numElem: string[] = []
//   let phrase: string[] = []
//   for (let x = 0; x <= array.length - 1; x++) {
//     const wordArr = array[x].split('')
//     console.log(wordArr);

//     for (let i = 0; i < wordArr.length; i++) {
//       let char: number = await encrypting(wordArr[i])
//       console.log('char is -> ', char);

//       if (char < 0) {
//         console.log('char => ', char);

//         numElem.push('0')
//       } else {
//         console.log('char tstr => ', char);
//         console.log(typeof char);

//         numElem.push(char.toString())
//       }

//       if (numElem.length === array[x].length) {
//         phrase.push(numElem.join().replaceAll(',', ' '))
//         phrase.push(';')
//         numElem = []
//         continue;
//       }
//     }
//   }
//   let curPhrs = phrase.join().replaceAll(',', '').replaceAll(';', '/')
//   let encPrase: string = curPhrs.toString()
//   console.log('encripted phrase is => ', encPrase);
//   return encPrase
// }

