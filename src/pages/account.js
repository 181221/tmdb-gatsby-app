import React from "react"
import { Router } from "@reach/router"
import { login, logout, isAuthenticated, getProfile } from "../utils/auth"
import { Link } from "gatsby"
import Home from "./home"
import { Button } from "@material-ui/core"
import ButtonAppBar from "./nav"
import Card from "../components/card"
import styled from "styled-components"
import Chip from "@material-ui/core/Chip"

const Settings = () => <p>Settings</p>
const Billing = () => <p>Billing</p>

const Account = () => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }

  const user = getProfile()

  return (
    <>
      <ButtonAppBar />

      <Button color="inherit">Login</Button>
      <nav>
        <Link to="/account/">Home</Link>{" "}
        <Link to="/account/settings/">Settings</Link>{" "}
        <Link to="/account/billing/">Billing</Link>{" "}
        <Link to="/account/movies">Movies</Link>{" "}
        <a
          href="#logout"
          onClick={e => {
            logout()
            e.preventDefault()
          }}
        >
          Log Out
        </a>
      </nav>
      <Router>
        <Home path="/account/" user={user} />
        <Settings path="/account/settings" />
        <Billing path="/account/billing" />
        <Movies path="/account/movies/" />
        <Movie path="/account/movies/:movieId" />
      </Router>
    </>
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

const Img = styled.img`
  content: url(${props => props.url});
  max-width: 100%;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
  width: ${props => props.size}
  margin: ${props => props.margin};
`
const MovieContainer = styled.div`
  display: flex;
  margin: auto;
  width: 50%;
`
const Left = styled.div`
  min-width: 400px;
  margin-right: 20px;
`
const Right = styled.div`
  display: flex;
  flex-direction: column;
`
const Overview = styled.div`
  margin-top: auto;
`
const Movie = ({ location }) => {
  const { state = {} } = location
  const { title } = state
  return (
    <>
      <Wrapper>
        <div>Welcome to the Some Page Component! {title}</div>
        <MovieContainer>
          <Left>
            <Img url="https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg" />
          </Left>
          <Right>
            <h2>Breaking Bad (2008)</h2>
            <div>rating</div>
            <Overview>
              <h3>Overview</h3>
              <p>
                When Walter White, a New Mexico chemistry teacher, is diagnosed
                with Stage III cancer and given a prognosis of only two years
                left to live. He becomes filled with a sense of fearlessness and
                an unrelenting desire to secure his family's financial future at
                any cost as he enters the dangerous world of drugs and crime.
              </p>
            </Overview>
          </Right>
        </MovieContainer>
        <div>
          <h2>Top Billed Cast</h2>
          <ImgCards>
            <ImgCard>
              <Img
                url="https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg"
                size={"250px"}
              />
              <p>Bryan Cranston</p>
              <p>Walter White</p>
            </ImgCard>
            <ImgCard>
              <Img
                url="https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg"
                size={"250px"}
              />
              <p>Bryan Cranston</p>
              <p>Walter White</p>
            </ImgCard>
            <ImgCard>
              <Img
                url="https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg"
                size={"250px"}
              />
              <p>Bryan Cranston</p>
              <p>Walter White</p>
            </ImgCard>
            <ImgCard>
              <Img
                url="https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg"
                size={"250px"}
              />
              <p>Bryan Cranston</p>
              <p>Walter White</p>
            </ImgCard>
          </ImgCards>
        </div>
        <div>
          <h2>Similar Shows</h2>
          <Chip
            label="Clickable link"
            component="a"
            clickable
            variant="outlined"
          />
        </div>
      </Wrapper>
    </>
  )
}
const Wrapper = styled.div``

const ImgCards = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`
const ImgCard = styled.div`
  margin: 0 20px;
`
export default Account
