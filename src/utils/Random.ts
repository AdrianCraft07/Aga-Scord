export function randomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export function randomCharacter(list: string) {
  return list[randomNumber(0, list.length - 1)];
}

export function makeToken(length: number, dots: number, charList: string) {
	let token = [];
	for (let i = 0; i < length; i++) {
		token.push(randomCharacter(charList));
	}
	const dotInterval = Math.round(length / (dots +1));
	for (let i = 1; i <= dots; i++) {
		token[(dotInterval * i)-1] = '.';
	}
	return token.join('');
}
makeToken.charList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';