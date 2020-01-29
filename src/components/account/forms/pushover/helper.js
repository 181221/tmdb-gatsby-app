export const getOptions = (user, state) => {
  const ql = `mutation {
      updateConfiguration(
        pushoverEndpoint: "${state.url}"
        pushoverApiKey: "${state.api}"
        pushoverUserKey: "${state.key}"
      ) {
        user {
          name
        }
        pushoverEndpoint
        pushoverApiKey
        pushoverUserKey
      }
    }
    `;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      query: ql,
    }),
  };
  return options;
};

export const getOptionsRead = user => {
  const ql = `query {
        configurationPrivate {
          pushoverEndpoint
          pushoverApiKey
          pushoverUserKey
        }
      }
      `;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      query: ql,
    }),
  };
  return options;
};
