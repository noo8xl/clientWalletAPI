function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export async function GeneratePassword(passwordLength: number) {
  const numberChars: string = "0123456789";
  const upperChars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars: string = "abcdefghijklmnopqrstuvwxyz";
  const allChars: string = numberChars + upperChars + lowerChars;
  let randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  const result: string = shuffleArray(randPasswordArray.map(function (x) { return x[Math.floor(Math.random() * x.length)] })).join('');
  return result
}