import * as lnurl from 'lnurl';
import * as crypto from 'crypto';
import fetch from 'node-fetch';
import * as secp256k1 from 'secp256k1';
import { parse as parseUrl } from 'url';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Please provide an LNURL as a command-line argument.');
  process.exit(1);
}

const PRIVATE_KEY = Buffer.from('12345678', 'hex');
const LNURL_STRING = args[0];
console.log('LNURL:', LNURL_STRING);

const decodedLnUrl = lnurl.decode(LNURL_STRING);
console.log('Decoded URL:', decodedLnUrl);

const parsedUrl = parseUrl(decodedLnUrl, true);
const k1 = parsedUrl.query.k1 as string;
console.log('k1:', k1);

const publicKey = secp256k1.publicKeyCreate(PRIVATE_KEY, true);
const publicKeyHex = publicKey.toString();
console.log('Public key:', publicKeyHex);

const msgHash = crypto
  .createHash('sha256')
  .update(Buffer.from(k1, 'hex'))
  .digest();
const signature = secp256k1.ecdsaSign(msgHash, PRIVATE_KEY);
console.log('Signature:', signature.signature.toString());

const signedUrl = `${decodedLnUrl} & sig =${Buffer.from(
  signature.signature,
).toString('hex')} & key =${publicKeyHex}`;
console.log('Signed URL:', signedUrl);

fetch(signedUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log('Server response:', data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
