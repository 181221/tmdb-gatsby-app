import React from "react"
import styled from "styled-components"
import { graphql, useStaticQuery } from "gatsby"
import Card from "../components/card"

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 42px 42px;
  justify-content: center;
`

const Home = ({ user }) => {
  const gatsbyRepoData = useStaticQuery(graphql`
    query {
      tmdb {
        data {
          backdrop_path
        }
      }
    }
  `)
  console.log(gatsbyRepoData)
  return (
    <>
      <p>Hi, {user.name ? user.name : "friend"}!</p>
      <p>Build Time Data: Gatsby repo{` `}</p>
      <CardContainer>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </CardContainer>
    </>
  )
}
export default Home
