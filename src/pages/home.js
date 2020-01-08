import React, { useState } from "react"
import styled from "styled-components"
import { graphql, useStaticQuery } from "gatsby"
import Card from "../components/card"

import SearchBar from "../components/search-bar"
import Img from "gatsby-image"

import Typography from "@material-ui/core/Typography"

const Heading = styled.div`
  margin: 24px;
`

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 42px 42px;
  justify-content: center;
`
const AutoSuggest = styled.div``
const AutoContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const Home = ({ user }) => {
  const [value, setValue] = useState("")
  const gatsbyRepoData = useStaticQuery(graphql`
    query MyQuery {
      allTmdbMiscPopularMovies(sort: { fields: title }, limit: 10) {
        nodes {
          title
          vote_average
          vote_count
          original_title
          id
          overview
          miscPopularMoviesId
          genre_ids
          poster_path {
            childImageSharp {
              fixed(height: 450, quality: 100) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  `)
  const nodes = gatsbyRepoData.allTmdbMiscPopularMovies.nodes

  const [autoSuggestions, setAutoSuggestions] = useState([])
  console.log("autoSuggestions", autoSuggestions)
  return (
    <>
      <Heading>
        <Typography variant="h4" component="h4" align="center">
          Discover
        </Typography>
      </Heading>

      <SearchBar />
      <AutoContainer>
        {autoSuggestions && autoSuggestions.map(el => <select>{el}</select>)}
      </AutoContainer>

      <CardContainer>
        {nodes.map(el => {
          return (
            <Card
              key={el.id}
              img={el.poster_path.childImageSharp.fixed}
              title={el.title}
              overview={el.overview}
              genres={el.genre_ids}
              vote_average={el.vote_average}
              id={el.miscPopularMoviesId}
            />
          )
        })}
      </CardContainer>
    </>
  )
}
const onChange = (value, setAutoSuggestions) => {
  if (value && value.length >= 2) {
    const request = setTimeout(
      () => handleRequestoffline(value, setAutoSuggestions),
      2000
    )
    console.log(request)
    console.log(request.results)
    //setAutoSuggestions(["hei", "hadet"])
    //setAutoSuggestions(request.results)
  }
}

const handleRequestoffline = (query, setAutoSuggestions) => {
  console.log("asdasd")
  const uri = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${process.env.API_KEY}`
  const encodedsearch = encodeURI(uri)
  setAutoSuggestions(["lion king", " king kong"])

  console.log(uri)
}
const handleRequest = query => {
  const uri = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${process.env.API_KEY}`
  const encodedsearch = encodeURI(uri)
  fetch(encodedsearch)
    .then(res => res.json())
    .then(json => console.log(json))
  console.log(uri)
}
export default Home
