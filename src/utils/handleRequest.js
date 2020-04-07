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
        release_date
        createdAt
        vote_average
        overview
        downloaded
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
