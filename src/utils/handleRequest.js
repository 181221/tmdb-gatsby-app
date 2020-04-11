const reAuthenticateOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `mutation {
      getToken(
        email: "${localStorage.getItem('email')}"
      ) {
        token
      }
    }`,
  }),
};

export const handleFetch = async (url, options = { method: 'GET' }) => {
  const fetchOptions = {
    method: options.body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify(options.body),
  };
  const response = await fetch(url, fetchOptions);
  if (!response.ok) throw new Error(`${response.statusText} ${response.status}`);
  const json = await response.json();
  if (json.errors) {
    const { message } = json.errors[0];
    if (message === 'Unauthorized' || message === 'jwt malformed') {
      const tokenResponse = await fetch(url, reAuthenticateOptions);
      let token = await tokenResponse.json();
      if (token.errors) throw new Error(token.errors[0].message);
      token = token.data.getToken.token;
      localStorage.setItem('token', token);
      handleFetch(url, fetchOptions);
    }
    throw new Error(json.errors[0].message);
  }
  return json;
};
