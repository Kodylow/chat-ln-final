import { Point, utils, verify } from "@noble/secp256k1";
import { encodeLnurl } from "@/utils/bech32"
import { NextApiHandler } from "next";

const handler : NextApiHandler = async (req, res)  => {
  console.log("Running lnurl-challenge handler...")
  // Get the host from request headers
  const { host } = req.headers;
  console.log("host: ", host)

  const generatedK1 = utils.bytesToHex(utils.randomBytes(32));
  console.log("generatedK1: ", generatedK1)
  // Generate the lnurl-auth login URL using the full URL and generated k1 value
  const fullUrl = `https://${host}/api/lnurl-auth`;
  console.log("fullUrl: ", fullUrl)
  const lnurl = generateLnurl(fullUrl, generatedK1);
  console.log("lnurl: ", lnurl)

  // Return the lnurl to the client for displaying the QR code
  return res.status(200).json({ lnurl });
}

function generateLnurl(url: string, k1: string) {
  console.log("Running generateLnurl...")
  // Generate the lnurl-auth login URL with the provided k1 value
  // The login URL should include the tag, k1 value, and action
  const encodedUrl = encodeLnurl(`${url}?tag=login&k1=${k1}&action=login`)
  console.log("encodedUrl: ", encodedUrl);
  return encodedUrl;
}

function verifySig(sig: string, msg: string, key: (string | Uint8Array) | Point) {
  console.log("Running verifySig...")
  // Verify a secp256k1 signature
  // Convert the hexadecimal signature and message to byte arrays
  const sigB = utils.hexToBytes(sig);
  console.log("sigB: ", sigB)
  const msgB = utils.hexToBytes(msg);
  console.log("msgB: ", msgB)


  // Verify the signature using the secp256k1 library
  return verify(sigB, msgB, key);
}

export default handler;