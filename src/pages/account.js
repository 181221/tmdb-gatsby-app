import React, { useState, useEffect } from "react"
import { Router } from "@reach/router"
import { login, isAuthenticated, getProfile } from "../utils/auth"
import Home from "./home"
import ButtonAppBar from "./nav"
import Card from "../components/card"
import Movie from "./movie"
import styled from "styled-components"
import Layout from "../components/layout"
import { handleRequest } from "../utils/handleRequest"

const Settings = () => <p>Settings</p>
const Billing = () => <p>Billing</p>

const Account = () => {
  const [userData, setUserData] = useState("")
  useEffect(() => {
    console.log("useEffect from user", user)
    handleRequest(user, "http://localhost:4000", setUserData)
  }, [user])
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }

  const user = getProfile()
  console.log(userData)
  return (
    <Layout>
      <ButtonAppBar user={user} />
      <Router>
        <Home path="/account/" user={user} />
        <Settings path="/account/settings" />
        <Billing path="/account/billing" />
        <Movies path="/account/movies/" />
        <Movie path="/account/movies/:movieId" user={userData} />
      </Router>
    </Layout>
  )
}

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 42px 42px;
  justify-content: center;
`

const Movies = props => (
  <div>
    <h2>movies</h2>
    <CardContainer>
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
    </CardContainer>

    {props.children}
  </div>
)

export default Account
