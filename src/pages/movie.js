import React from "react"
import styled from "styled-components"
import Img from "gatsby-image"
import Typography from "@material-ui/core/Typography"
import StarRateIcon from "@material-ui/icons/StarRate"
import Chip from "@material-ui/core/Chip"
import { gen } from "../components/card"
import Button from "@material-ui/core/Button"
import { withStyles } from "@material-ui/core/styles"

const Wrapper = styled.div`
  margin-top: 48px;
`
const StarDiv = styled.div`
  display: flex;
  margin-top: 12px;
`

const ImageFetch = styled.img`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
  width: 300px;
  height: 450px;
`
const Image = styled(Img)`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
`
const MovieContainer = styled.div`
  display: flex;
  margin: auto;
  width: 50%;
`
const Left = styled.div`
  margin-right: 20px;
`
const Right = styled.div`
  display: flex;
  flex-direction: column;
`
const Overview = styled.div`
  margin-top: auto;
  margin-bottom: 24px;
`
const ChipContent = styled.div`
  flex-wrap: wrap;
  display: flex;
  margin-top: 12px;
  max-width: 250px;
`

const Movie = ({ location, user }) => {
  const { state = {} } = location
  let imgToFetch = false
  if (state && state.image_load) {
    imgToFetch = `http://image.tmdb.org/t/p/original${state.img}`
  }
  const { title, img, id, overview, genres, vote_average } = state
  const handleMovieRequest = () => {
    const url = "http://localhost:4000"
    const ql = `mutation {
      createMovie(
        title: "${title}",
        img: "${img.src}",
        tmdb_id: "${id}",
        overview: "${overview}",
        genres: "${genres}",
        vote_average: "${vote_average}"
      ) {
        title
        img
        tmdb_id
        genres
        vote_average
        overview
      }
    }`
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        query: ql,
      }),
    }
    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error(err))
  }

  return (
    <>
      <Wrapper>
        <MovieContainer>
          <Left>
            {img && !imgToFetch && <Image fixed={img} />}
            {imgToFetch && <ImageFetch src={imgToFetch} />}
          </Left>
          <Right>
            <div style={{ paddingLeft: "10px" }}>
              <Typography variant="h4" component="h4">
                {title}
              </Typography>
            </div>

            <StarDiv>
              <StarRateIcon style={{ fontSize: "42px", color: "#ff6987e6" }} />
              <Typography variant="h4" component="h4" style={{ lineHeigh: 2 }}>
                {vote_average}
              </Typography>
            </StarDiv>
            <ChipContent>
              {genres &&
                genres.map((el, index) => {
                  return (
                    <div
                      key={el}
                      style={{
                        margin: "5px",
                      }}
                    >
                      <StyledChip key={el} label={gen[el]} variant="outlined" />
                    </div>
                  )
                })}
            </ChipContent>
            <Overview>
              <Typography variant="h4" component="h4">
                Overview
              </Typography>
              <Typography variant="body1" component="p">
                {overview}
              </Typography>
            </Overview>
            <StyledButton onClick={handleMovieRequest} color="primary">
              <Typography variant="body1" component="p">
                Request Movie
              </Typography>
            </StyledButton>
          </Right>
        </MovieContainer>
      </Wrapper>
    </>
  )
}
const StyledChip = withStyles({
  root: {
    borderRadius: 3,
    border: 0,
    color: "white",
    boxShadow: "0 0px 1px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      backgroundColor: "#e4637f",
      opacity: 0.9,
    },
  },
})(Chip)
const StyledButton = withStyles({
  root: {
    background: "linear-gradient(45deg, #e4637f 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    boxShadow: "0 0px 1px 1px rgba(255, 105, 135, .3)",
  },
})(Button)

export default Movie
