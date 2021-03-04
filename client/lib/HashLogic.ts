import BigInt from "big-integer";
import { BigInteger } from "big-integer";

type Base = 2|16|64;
const MaxSize: number = 256*256;
const Base64Alphabet: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/';

const GenerateXORHash = (positions: number[], maxSize: number = MaxSize): BigInteger => {
	positions = positions.filter(v => v <= maxSize);
	positions.sort();
	let hash: string = "";
	for (var i=0; i<positions.length; i++)
		hash += "0".repeat(positions[i] - hash.length) + "1";
	hash += "0".repeat(maxSize - hash.length);
	return StrToHash(hash, 2);
}

const XORHash = (hashA: BigInteger, hashB: BigInteger): BigInteger =>
	hashA.xor(hashB);

const StrToHash = (hash: string, base: Base = 64): BigInteger =>
	base == 64 ? BigInt(hash, base, Base64Alphabet) : BigInt(hash, base);

const HashToStr = (hash: BigInteger, base: Base = 64): string =>
	base == 64 ? hash.toString(base, Base64Alphabet) : hash.toString(base);

export const HandleMutate = (hash: string, positions: number[], size: number = MaxSize, base: Base = 16): string =>
  HashToStr(XORHash(StrToHash(hash, base), GenerateXORHash(positions, size)), base);
  
export const HashToBinary = (hash: string): string => {
  let binary = StrToHash(hash).toString(2);
  return "0".repeat(MaxSize - binary.length) + binary;
}