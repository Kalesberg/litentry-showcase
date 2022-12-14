import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = 'SuperSecret!!!'; // Replace this with ENV variable

export const accessToken = (address: string) => {
  return sign({ address }, JWT_SECRET, { expiresIn: '1m' }); // Expire 1m for demo
};

export const verifyToken = (token: string) => {
  try {
    const { address } = verify(token, JWT_SECRET, { ignoreExpiration: false }) as any;
    return address;
  } catch (e) {
    return false;
  }
};
