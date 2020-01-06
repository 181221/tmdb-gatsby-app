import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import { Link } from "gatsby"
import Img from "gatsby-image"

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
const Image = styled(Img)`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
`
const P = styled.p`
  text-align: center;
  min-height: 24px;
  max-height: 24px;
  margin: 0;
`
const Card = ({ img, title, genres, id, vote_average, overview }) => {
  return (
    <>
      <MovieBlock>
        <MoviePoster>
          <Link
            to={`/account/movies/${id}`}
            state={{ img, title, genres, id, vote_average, overview }}
          >
            <Image fixed={img} />
          </Link>
          <Typography variant="h4" component="h4" align="center">
            {title}
          </Typography>
          <P>
            {genres.map((el, index) => {
              return genres.length - 1 === index ? gen[el] + "" : gen[el] + ", "
            })}
          </P>
        </MoviePoster>
      </MovieBlock>
    </>
  )
}
export default Card
export const gen = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
}
