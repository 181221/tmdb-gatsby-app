import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Img from "gatsby-image"
import { Link } from "gatsby"
import { graphql, useStaticQuery } from "gatsby"

import Chip from "@material-ui/core/Chip"

const Wrapper = styled.div``

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
  console.log("state", state)
  const { title, img, id, overview, genres, vote_average } = state
  const [data, isLoading] = useFetch({ id })
  console.log(data)
  const [imgIsLoading, setImgIsLoading] = useState(false)

  return (
    <>
      <Wrapper>
        <MovieContainer>
          <Left>
            <Image fixed={img} />
          </Left>
          <Right>
            <h2>{title}</h2>
            <div>{vote_average}</div>
            <Overview>
              <h3>Overview</h3>
              <p>{overview}</p>
            </Overview>
          </Right>
        </MovieContainer>
      </Wrapper>
    </>
  )
}
export default Movie
