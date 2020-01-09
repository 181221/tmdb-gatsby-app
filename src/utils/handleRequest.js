export const handleRequest = (user, url, setUserData) => {
  const ql = `mutation {
        createToken(
          email: "${user.email}"
        ) {
          token
          user {
            id
          }
        }
      }`

  const ql1 = `mutation {
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
      }`
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: ql,
    }),
  }
  const options_getToken = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: ql1,
    }),
  }
  fetch(url, options)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      return Promise.reject(Error(res.statusText))
    })
    .then(json => {
      if (json.errors && json.errors.length > 0) {
        let error = json.errors[0]
        if (error.message === "user already exists") {
          fetch(url, options_getToken)
            .then(res => res.json())
            .then(json => {
              setUserData(json.data.getToken)
            })
            .catch(err => console.error(err))
        }
      } else {
        setUserData(json.data.getToken)
      }
    })
    .catch(err => console.error(err))
}
