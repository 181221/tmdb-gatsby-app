export const getOptions = (user, state) => {
  const ql = `mutation {
    updateUser(
        email: "${user.email}"
        notification: ${state.notification}
        name: "${state.name}"
      ) {
        role
        subscription
        id
        name
        email
        notification
      }
  }`;
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
