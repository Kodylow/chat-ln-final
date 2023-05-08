import { Point, utils, verify } from "@noble/secp256k1";
import { NextApiHandler } from "next";
import pending from "../_map";

function verifySig(sig: string, k1: string, key: Point | (string | Uint8Array)) {
  console.log("Running verifySig...")
  // Verify a secp256k1 signature
  const sigB = utils.hexToBytes(sig);
  console.log("sigB: ", sigB)
  const k1B = utils.hexToBytes(k1);
  console.log("k1B: ", k1B)

  // Verify the signature using the secp256k1 library
  return verify(sigB, k1B, key);
}

const handler : NextApiHandler = async (req, res)  => {
  console.log("Running lnurl-auth handler...")
  const { tag, k1, sig, key } = req.query;

  if (tag == "login" && k1 && sig && key && typeof sig == "string" && typeof k1 == "string" && typeof key == "string") {
    try {
      if (verifySig(sig, k1, key)) {
        // Update the pending map
        pending.k1 = k1;
        pending.pubkey = key;
        return res.status(200).json({ status: "OK", k1, pubkey: key });
      }
    } catch (e) {
      console.error(e);
    }
  }

  return res.status(200).json({ status: "FAIL" });
}

export default handler;