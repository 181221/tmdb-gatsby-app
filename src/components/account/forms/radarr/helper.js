export const getOptions = (user, state) => {
  const ql = `mutation {
    updateConfiguration(
      radarrApiKey: "${state.api}"
      radarrEndpoint: "${state.url}"
      radarrRootFolder: "${state.folder}"
    ) {
      radarrApiKey
      radarrEndpoint
      radarrRootFolder
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
