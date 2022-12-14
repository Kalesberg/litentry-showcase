import { InjectedExtension } from '@polkadot/extension-inject/types';
import { stringToHex, u8aToHex } from '@polkadot/util';
import { cryptoWaitReady, decodeAddress, signatureVerify } from '@polkadot/util-crypto';

export const sign = async (injector: InjectedExtension, address: string, message: string) => {
  const signRaw = injector.signer.signRaw;
  if (!!signRaw) {
    const { signature } = await signRaw({
      address,
      data: stringToHex(message),
      type: 'bytes',
    });

    return signature;
  }
};

export const verify = async (
  address: string,
  message: string,
  signature: string
): Promise<boolean> => {
  await cryptoWaitReady();
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  return signatureVerify(message, signature, hexPublicKey).isValid;
};
