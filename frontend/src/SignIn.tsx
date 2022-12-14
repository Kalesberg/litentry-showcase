import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { InjectedExtension, InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { stringToHex } from "@polkadot/util";


function SignIn() {
  const [injector, setInjector] = useState<InjectedExtension | null>(null);
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('_AUTH_TOKEN'));

  useEffect(() => {
    async function init() {
      const extension = await web3Enable('my dapp');
      if (extension.length) {
        setInjector(extension[0]);
        const account = (await web3Accounts())[0];
        setAccount(account);
      }
    }
    init();
  }, []);

  const signIn = async () => {
    const signInUrl = `${process.env.REACT_APP_API_BASE}/api/v1/signin`;
    if (injector && account) {
      const signRaw = injector?.signer?.signRaw;
      const message = `Sign-in request for address ${account.address}`
      if (!!signRaw) {
        const { signature } = await signRaw({
          address: account.address,
          data: stringToHex(message),
          type: 'bytes'
        });

        const { data: { token } } = await axios.post(signInUrl, {
          address: account.address,
          message,
          signature
        });

        localStorage.setItem('_AUTH_TOKEN', token);
        setLoggedIn(true);
      }
    }
  }

  const signOut = () => {
    localStorage.removeItem('_AUTH_TOKEN');
    setLoggedIn(false);
  }

  return (
    <div className="App">
      <div className="App-main">
        {loggedIn ? (
          <>
            <button className="App-button" onClick={signOut}>Logout</button>
            <br/>
            <Link className="App-link" to='/secret'>Show Secret</Link>
          </>
        ) : (
          <button className="App-button" onClick={signIn}>Sign In</button>
        )}
      </div>
    </div>
  );
}

export default SignIn;
