import { bech32 } from "bech32";

export function encodeLnurl(string: string) {
  const words = bech32.toWords(Buffer.from(string, "utf8"));
  return bech32.encode("lnurl", words, Number.MAX_SAFE_INTEGER);
}

export function decodeLnurl(string: string) {
  return bech32.decode(string);
}