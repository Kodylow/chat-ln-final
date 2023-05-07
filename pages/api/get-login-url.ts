// pages/api/get-login-url.ts
import { NextApiHandler } from 'next';
import { serialize } from 'cookie';
import lnurl from 'lnurl';
import { SignJWT } from 'jose';
import {
  generateSecret,
  createHash,
  storePair,
  JWT_SECRET,
} from '../../utils/utils';

const getLoginUrl: NextApiHandler = async (req, res) => {
  const k1 = await generateSecret();
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const pathname = '/api/login';
  const url = `${protocol}://${host}${pathname}?tag=login&k1=${k1}&action=login`;
  const hash = createHash(k1);

  const data = {
    url,
    encoded: lnurl.encode(url).toUpperCase(),
    k1,
    hash,
  };

  await storePair(hash, null);

  const jwt = await new SignJWT({ hash: data.hash })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5min')
    .sign(Buffer.from(JWT_SECRET, 'utf-8'));

  const maxAge = 1000 * 60 * 3; // 3 minutes

  res.setHeader(
    'Set-Cookie',
    serialize('login_session', jwt, {
      maxAge,
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      path: '/',
    }),
  );

  res.status(200).json(data);
};

export default getLoginUrl;
