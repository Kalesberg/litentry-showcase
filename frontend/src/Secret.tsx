import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Secret() {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function init() {
      const accessToken = localStorage.getItem('_AUTH_TOKEN');
      if (!accessToken) {
        setError(true);
        return;
      }
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE}/api/v1/secret`;
        const { data: { message } } = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setMessage(message);
      } catch (e) {
        localStorage.removeItem('_AUTH_TOKEN')
        setError(true);
      }
    }
    init();
  }, [])
  return (
    <div className="App">
      <div className="App-main">
        {error && (
          <h3 className="warning">Oops! Try to sign in again.</h3>
        )}
        {!error && !!message && (
          <code>{message}</code>
        )}
        <Link className="App-link" to='/'>&larr; Back to Home</Link>
      </div>
    </div>
  );
}

export default Secret;
