import React, { useState, useEffect } from "react"
import { Router } from "@reach/router"
import { login, isAuthenticated, getProfile } from "../utils/auth"
import Home from "./home"
import ButtonAppBar from "../components/navbar/nav"
import Movie from "./movie"
import Layout from "../components/layout"
import { handleRequest } from "../utils/handleRequest"

const Account = () => {
  const [userData, setUserData] = useState("")

  const user = getProfile()
  useEffect(() => {
    handleRequest(user, "http://localhost:4000", setUserData)
  }, [user])
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }
  return (
    <Layout>
      <ButtonAppBar user={user} />
      <Router>
        <Home path="/account/" user={user} />
        <Movie path="/account/movies/:movieId" user={userData} />
      </Router>
    </Layout>
  )
}
export default Account
