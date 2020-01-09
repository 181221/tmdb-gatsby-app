import React, { useState, useEffect } from "react"
import { Router } from "@reach/router"
import { login, isAuthenticated, getProfile } from "../utils/auth"
import Home from "./home"
import ButtonAppBar from "../components/navbar/nav"
import Movie from "./movie"
import Layout from "../components/layout"
import { handleRequest } from "../utils/handleRequest"
import { radarr_url, account_movie, landing } from "../constants/route"

const Account = () => {
  const [userData, setUserData] = useState("")
  const [collection, setCollection] = useState(undefined)

  const user = getProfile()
  useEffect(() => {
    handleRequest(user, "http://localhost:4000", setUserData)
    let url_collection = `${radarr_url}/movie?apikey=${process.env.RADARR_API_KEY}`
    fetch(url_collection)
      .then(res => res.json())
      .then(json => {
        setCollection(json)
      })
      .catch(err => console.error(err))
  }, [user])
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }
  return (
    <Layout>
      <ButtonAppBar user={user} />
      <Router>
        <Home path={`${landing}`} user={user} />
        <Movie
          path={`${account_movie}/:movieId`}
          user={userData}
          collection={collection}
        />
      </Router>
    </Layout>
  )
}
export default Account
