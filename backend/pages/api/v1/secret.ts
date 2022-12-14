import type { NextApiRequest, NextApiResponse } from 'next';
import { faker } from '@faker-js/faker';
import { cors, runMiddleware } from '../../../library/cors';
import { verifyToken } from '../../../library/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' });
    return;
  }

  try {
    const token = req.headers['authorization']?.substring(7) || '';
    if (!verifyToken(token)) {
      throw new Error();
    }
    const message = faker.lorem.sentences();
    res.status(200).json({ message });
  } catch (e) {
    res.status(401).json({
      message: 'Unauthorized',
    });
  }
}
