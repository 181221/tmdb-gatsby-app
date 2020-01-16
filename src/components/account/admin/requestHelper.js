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
    case 'MY_REQUESTED_MOVIES':
      ql = `query{
        user(email: "${user.email}"){
          movies{
            title 
            downloaded
            createdAt 
          }
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

export const handleSimpleRequest = async (url, options, user, retry = false) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const json = await response.json();
  if (retry) {
    return json;
  }
  if (json.erros && json.errors.length > 0) {
    if (json.errors[0].message === 'jwt malformed') {
      const res = await fetch(url, getOptions('GET_TOKEN', user));
      const data = await res.json();
      const opt = options;
      opt.headers.Authorization = `Bearer ${data.data.getToken.token}`;
      return handleSimpleRequest(url, opt, user, true);
    }
    throw new Error(json.errors[0].message);
  }
  return json;
};
