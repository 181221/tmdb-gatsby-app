import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import { Link } from "gatsby"

export const MovieBlock = styled.div`
  margin-top: 20px;
  margin-right: 20px;
  width: 350px;
  position: relative;
`
const MoviePoster = styled.div`
  min-height: 300px;
  align-items: center;
  margin: 0 20px;
  justify-content: center;
`
const Img = styled.img`
  content: url(${props => props.url});
  max-width: 100%;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
`
const P = styled.p`
  text-align: center;
`
const Card = () => {
  return (
    <>
      <MovieBlock>
        <MoviePoster>
          <Link to={`/account/movies/${123}`} state={{ title: "breaking bad" }}>
            <Img url="https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg" />
          </Link>
          <Typography variant="h3" component="h3" align="center">
            Breaking bad
          </Typography>
          <P>Adventure, Drama, Mystery, Science Fiction, Thriller</P>
        </MoviePoster>
      </MovieBlock>
    </>
  )
}
export default Card
