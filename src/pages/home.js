import React from "react"
import styled from "styled-components"
import { graphql, useStaticQuery } from "gatsby"
import Card from "../components/card"
import SearchBar from "../components/search/search-bar"
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

const Home = () => {
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
  return (
    <>
      <Heading>
        <Typography variant="h4" component="h4" align="center">
          Discover
        </Typography>
      </Heading>
      <SearchBar />
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
export default Home
