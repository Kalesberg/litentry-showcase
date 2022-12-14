import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../../../library/cors';
import { verify } from '../../../library/wallet';
import { accessToken } from '../../../library/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  const { address, message, signature } = req.body;
  try {
    if (await verify(address, message, signature)) {
      const token = accessToken(address);
      res.status(200).json({ token });
    }
    res.status(401).json({
      message: 'Signature invalid',
    });
  } catch (e) {
    res.status(422).json({
      message: 'Unprocessable entity',
    });
  }
}
