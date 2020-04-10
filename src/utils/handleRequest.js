import { GET_USER_BY_EMAIL } from '../components/gql';

export const getUserOptions = user => {
  const ql1 = `query {
    user(email: "${user.email}") {
      role
      subscription
      id
      name
      email
      notification
      movies {
        id
        title
        img
        tmdbId
        genres
        year
        voteCount
        voteAverage
        overview
        downloaded
        hasFile
      }
    }
  }
`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: user.token,
    },
    body: JSON.stringify({
      query: ql1,
    }),
  };
  return options;
};

export const options_getToken = (user, query) => {
  const ql1 = `mutation {
    ${query}(
      email: "${user.email}"
    ) {
      token
    }
  }`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: ql1,
    }),
  };
  return options;
};

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
      token = token.data.getToken.token;
      localStorage.setItem('token', token);
      handleFetch(url, fetchOptions);
    }
    throw new Error(json.errors[0].message);
  }
  return json;
};

export const handleRequest = (user, url, setUserData) => {
  const options = options_getToken(user, 'getToken');
  return fetch(url, options)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(Error(res.statusText));
    })
    .then(json => {
      if (json.errors && json.errors.length > 0) {
        const error = json.errors[0];
        if (error.message === 'user already exists') {
          return fetch(url, options_getToken(user, 'createToken'))
            .then(res => res.json())
            .then(j => {
              setUserData(j.data.getToken);
              return j;
            })
            .catch(err => {
              return { isError: true, message: err.message.toString() };
            });
        }
      } else {
        setUserData(json.data.getToken);
      }
      return json;
    })
    .catch(err => {
      return { isError: true, message: err.message.toString() };
    });
};
