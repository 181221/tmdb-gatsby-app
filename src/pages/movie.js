import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Img from "gatsby-image"
import { Link } from "gatsby"
import { graphql, useStaticQuery } from "gatsby"
import Typography from "@material-ui/core/Typography"
import StarRateIcon from "@material-ui/icons/StarRate"
import Chip from "@material-ui/core/Chip"
import { gen } from "../components/card"
const Wrapper = styled.div`
  margin-top: 48px;
`
const StarDiv = styled.div`
  display: flex;
  margin-top: 12px;
`

const Image_fetch = styled.img`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
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
`
const ImgCards = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`
const ImgCard = styled.div`
  margin: 0 20px;
`
const ChipContent = styled.div`
  flex-wrap: wrap;
  display: flex;
  margin-top: 12px;
  max-width: 250px;
`

const useFetch = ({ id }) => {
  console.log("useFetch", id)
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const fetchData = async () => {
    setLoading(true)
    const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.API_KEY}`
    console.log("url", url)
    const response = await fetch(url)
    const json = await response.json()
    console.log("json", json)
    setData(json)
    setLoading(false)
  }
  useEffect(() => {
    fetchData()
  }, [])

  return [data, isLoading]
}

const Movie = ({ location }) => {
  const { state = {} } = location
  let img_test = false
  if (state && state.image_load) {
    console.log("need to render another image")
    img_test = `http://image.tmdb.org/t/p/original${state.img}`
  }
  const { title, img, id, overview, genres, vote_average } = state
  //const [data, isLoading] = useFetch({ id })
  //console.log(data)
  const [imgIsLoading, setImgIsLoading] = useState(false)
  if (!state) {
    console.log("no state")
  }
  return (
    <>
      <Wrapper>
        <MovieContainer>
          <Left>
            {img && <Image fixed={img} />}
            {img_test && <Image_fetch src={img_test} />}
          </Left>
          <Right>
            <Typography variant="h4" component="h4">
              {title}
            </Typography>
            <StarDiv>
              <StarRateIcon style={{ "font-size": "42px" }} />
              <Typography
                variant="h4"
                component="h4"
                style={{ "line-heigh": 2 }}
              >
                {vote_average}
              </Typography>
            </StarDiv>
            <ChipContent>
              {genres &&
                genres.map((el, index) => {
                  return (
                    <div
                      style={{
                        margin: "2px",
                      }}
                    >
                      <Chip
                        key={el}
                        label={gen[el]}
                        clickable
                        variant="outlined"
                        style={{ background: "white" }}
                      />
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
          </Right>
        </MovieContainer>
      </Wrapper>
    </>
  )
}
export default Movie
