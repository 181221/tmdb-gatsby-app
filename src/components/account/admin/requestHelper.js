const getQuery = (query, user, limit) => {
  let ql;
  switch (query) {
    case 'ALL_MOVIES':
      ql = `query{
          users	{
            email
            movies{
              title
              img
              tmdb_id
              genres
              vote_average
              overview
            }
          }
        }`;
      break;
    case 'NEWLY_REQUESTED':
      ql = `query{
          movies(orderBy: createdAt_DESC, first: ${limit}){
            title
            img
            createdAt
            tmdb_id
            genres
            vote_average
            overview
          }
        }`;
      break;
    case 'GET_TOKEN':
      ql = `mutation {
            getToken(
              email: "${user.email}"
            ) {
              token
              user {
                email
                role
                movies {id title }
              }
            }
          }`;
      break;
    default:
    // code block
  }
  return ql;
};

export const getOptions = (user, ql, limit = 10) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      query: getQuery(ql, user, limit),
    }),
  };
  return options;
};
