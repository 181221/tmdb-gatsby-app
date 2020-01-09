import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Img from "gatsby-image"
import Typography from "@material-ui/core/Typography"
import StarRateIcon from "@material-ui/icons/StarRate"
import Chip from "@material-ui/core/Chip"
import { gen } from "../components/card"
import Button from "@material-ui/core/Button"
import { withStyles } from "@material-ui/core/styles"
import {
  radarr_url,
  prisma_endpoint,
  img_tmdb,
  tmdb_endpoint,
} from "../constants/route"
import FlashMessage from "../components/flash"

import { makeStyles } from "@material-ui/core/styles"

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
const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #e4637f 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    boxShadow: "0 0px 1px 1px rgba(255, 105, 135, .3)",
  },
  disabled: {
    "&$disabled": {
      cursor: "not-allowed",
      pointerEvents: "all",
    },
  },
})

const Movie = ({ location, user, collection }) => {
  const classes = useStyles()
  let { state = {} } = location
  const [movie, setMovie] = useState(state)
  let [imgToFetch, setImgToFetch] = useState(false)
  const [loading, setLoading] = useState(undefined)
  const [created, setCreated] = useState(undefined)
  const [inCollection, setInCollection] = useState(undefined)
  const [downloaded, setDownloaded] = useState(undefined)
  const [hasFile, setHasFile] = useState(undefined)

  const [error, setError] = useState(undefined)
  useEffect(() => {
    collection &&
      collection.map(el => {
        if (movie.id === el.tmdbId) {
          setInCollection(true)
        }
        if (el.hasFile) {
          setHasFile(true)
        }
        if (el.downloaded) {
          setDownloaded(true)
        }
      })
    if (!state.id) {
      const regex = /account\/movie\/[0-9]*/gm
      const location_id = location.pathname.match(regex)[0].match(/[0-9]+/)[0]
      const uri = `${tmdb_endpoint}/movie/${location_id}?api_key=${process.env.API_KEY}`
      fetch(uri)
        .then(res => res.json())
        .then(json => {
          const obj = {
            title: json.title,
            posterUrl: img_tmdb + json.poster_path,
            img: img_tmdb + json.poster_path,
            id: json.id,
            overview: json.overview,
            genres: json.genres.map(el => el.id),
            vote_average: json.vote_average,
            release_date: json.release_date,
          }
          setImgToFetch(img_tmdb + json.poster_path)
          setMovie(obj)
        })
    }
  }, [collection, movie, movie.id])
  if (state && state.image_load) {
    imgToFetch = img_tmdb + state.img
  }
  const {
    title,
    img,
    id,
    overview,
    genres,
    vote_average,
    posterUrl,
    release_date,
  } = movie
  const handleMovieRequest = () => {
    const url = prisma_endpoint
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

    const obj = {
      title: title,
      qualityProfileId: 3,
      titleSlug: title.replace(" ", "-").toLowerCase() + "-" + id,
      images: [
        {
          coverType: "poster",
          url: posterUrl,
        },
      ],
      tmdbId: id,
      year: Number(new Date(release_date).getFullYear()),
      rootFolderPath: process.env.RADARR_ROOT_FOLDER_PATH,
    }
    console.log("obj", obj)
    const options1 = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
      method: "POST",
    }

    let url_collection = `${radarr_url}/movie?apikey=${process.env.RADARR_API_KEY}`
    setLoading(true)
    fetch(url_collection, options1)
      .then(res => {
        if (res.ok) {
          setCreated(true)
          setInCollection(true)
          fetch(url, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error(err))
          setTimeout(() => {
            setCreated(undefined)
          }, 5000)
        }
        return res.json()
      })
      .then(json => {
        setLoading(false)
        console.log("json")
        return json
      })
      .catch(err => {
        console.error(err)
        setError(true)
        setTimeout(() => {
          setError(undefined)
        }, 5000)
      })
  }
  const click =
    error || loading || created || downloaded || inCollection || hasFile

  return (
    <>
      <Wrapper>
        <FlashMessage
          error={error}
          success={created}
          downloaded={downloaded}
          hasFile={hasFile}
          inCollection={inCollection}
        />
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
            <Button
              onClick={handleMovieRequest}
              disabled={click}
              color="primary"
              className={`${classes.root} ${click && classes.disabled}`}
            >
              <Typography variant="body1" component="p">
                Request Movie
              </Typography>
            </Button>
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

export default Movie
