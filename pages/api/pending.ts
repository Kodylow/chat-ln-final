// src/pages/api/auth/pending.js
import { NextApiHandler } from "next";
import pending from "../_map";

const handler : NextApiHandler = async (req, res)  => {
  const { k1, pubkey } = pending;
  if (!k1 || !pubkey) {
    return res.status(200).json({ status: "FAIL" });
  }
  res.status(200).json({ status: "success", k1, pubkey });
}

export default handler;