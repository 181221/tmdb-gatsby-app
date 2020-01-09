import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { graphql, useStaticQuery } from "gatsby"
import Card from "../components/card"
import SearchBar from "../components/search/search-bar"
import Typography from "@material-ui/core/Typography"
import { radarr_url } from "../constants/route"

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
  const [collection, setCollection] = useState(undefined)
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
          release_date
          poster_path {
            url
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
  useEffect(() => {
    let url_collection = `${radarr_url}/movie?apikey=${process.env.RADARR_API_KEY}`
    fetch(url_collection)
      .then(res => res.json())
      .then(json => {
        setCollection(json)
      })
      .catch(err => console.error(err))
  }, [])
  console.log("collectin", collection)
  console.log("nodes", nodes)
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
              release_date={el.release_date}
              posterUrl={el.poster_path.url}
            />
          )
        })}
      </CardContainer>
    </>
  )
}
export default Home
