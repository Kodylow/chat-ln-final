// pages/api/is-logged-in.ts
import { NextApiHandler } from 'next';
import { jwtVerify } from 'jose';
import { getPair, removeHashFromStore, JWT_SECRET } from '../../utils/utils';
import { jwtPayload } from '../../utils/interfaces';

const isLoggedIn: NextApiHandler = async (req, res) => {
  try {
    const login_session = req.cookies?.login_session;
    if (login_session) {
      const { payload: untypedPayload } = await jwtVerify(
        login_session,
        Buffer.from(JWT_SECRET),
        {
          algorithms: ['HS256'],
        },
      );

      const payload = untypedPayload as unknown as jwtPayload;

      const hash = payload.hash;
      const user_id = payload.user_id;
      const token = await getPair(hash);

      if (!token) {
        return res.json({
          logged_in: false,
        });
      }

      removeHashFromStore(hash);

      res.setHeader('Set-Cookie', [
        `login_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None`,
        `Authorization=${token}; Path=/; Max-Age=${
          3600000 * 24 * 30
        }; HttpOnly; Secure; SameSite=None`,
      ]);

      res.status(200).json({
        logged_in: true,
      });
    } else {
      res.json({
        logged_in: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      logged_in: false,
    });
  }
};

export default isLoggedIn;
