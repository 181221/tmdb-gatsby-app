import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';
import Typography from '@material-ui/core/Typography';
import StarRateIcon from '@material-ui/icons/StarRate';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'gatsby';
import Similar from '../components/movie/similar';

import { gen } from '../components/movie/card';

import {
  radarr_url,
  pushover_endpoint,
  prisma_endpoint,
  img_tmdb,
  landing,
  tmdb_endpoint,
} from '../constants/route';

import FlashMessage from '../components/flash';

const Wrapper = styled.div`
  margin-top: 48px;
`;
const StarDiv = styled.div`
  display: flex;
  margin-top: 12px;
`;

const ImageFetch = styled.img`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
  width: 300px;
  height: 450px;
`;
export const Image = styled(Img)`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
`;
const MovieContainer = styled.div`
  display: flex;
  margin: auto;
  width: 50%;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 80%;
  }
  @media (max-width: 1100px) {
    width: 80%;
  }
`;
const Left = styled.div`
  margin-right: 20px;
  @media (max-width: 768px) {
    align-self: center;
    margin: 0;
  }
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
`;
const Overview = styled.div`
  margin-top: auto;
  margin-bottom: 24px;
`;
const ReturnDiv = styled.div`
  margin: auto;
  width: 50%;
  margin-bottom: 24px;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
const StyledLink = styled(Link)`
  color: white;
  display: flex;
`;

const ChipContent = styled.div`
  flex-wrap: wrap;
  display: flex;
  margin-top: 12px;
  max-width: 250px;
`;
const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #e4637f 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    boxShadow: '0 0px 1px 1px rgba(255, 105, 135, .3)',
  },
  disabled: {
    '&$disabled': {
      cursor: 'not-allowed',
      pointerEvents: 'all',
    },
    goBack: {
      paddingTop: '10px',
    },
  },
});
const handlePushoverRequest = async (message, title = 'New Movie Request') => {
  const obj = {
    title,
    message,
    token: process.env.PUSHOVER_TOKEN,
    user: process.env.PUSHOVER_USER_KEY,
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  };

  const response = await fetch(pushover_endpoint, options);
  await response.json();
};

const Movie = ({ location, user, collection }) => {
  const classes = useStyles();
  const { state = {} } = location;
  const [movie, setMovie] = useState(state);
  const [imgToFetch, setImgToFetch] = useState(false);
  const [loading, setLoading] = useState(undefined);
  const [created, setCreated] = useState(undefined);
  const [inCollection, setInCollection] = useState(undefined);
  const [downloaded, setDownloaded] = useState(undefined);
  const [hasFile, setHasFile] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    collection &&
      collection.map(el => {
        if (movie.id === el.tmdbId) {
          setInCollection(true);
        }
        if (el.hasFile) {
          setHasFile(true);
        }
        if (el.downloaded) {
          setDownloaded(true);
        }
        return true;
      });
    if (!state.id) {
      const regex = /account\/movie\/[0-9]*/gm;
      const location_id = location.pathname.match(regex)[0].match(/[0-9]+/)[0];
      const uri = `${tmdb_endpoint}/movie/${location_id}?api_key=${process.env.API_KEY}`;
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
          };
          setImgToFetch(img_tmdb + json.poster_path);

          state.id = json.id;
          const uri1 = `${tmdb_endpoint}/movie/${location_id}/similar?api_key=${process.env.API_KEY}`;
          fetch(uri1)
            .then(res => res.json())
            .then(j => {
              obj.similar = j.results;
              setMovie(obj);
            });
        });
    }
    if (state.image_load) {
      setImgToFetch(img_tmdb + state.img);
    }
  }, [collection, movie, movie.id, state.id]);
  const { title, img, id, overview, genres, vote_average, posterUrl, release_date } = movie;
  const handleMovieRequest = () => {
    const url = prisma_endpoint;

    const rightImg = imgToFetch || img.src;
    const ql = `mutation {
      createMovie(
        title: "${title}",
        img: "${rightImg}",
        tmdb_id: "${id}",
        overview: "${overview}",
        genres: "${genres}",
        release_date: "${release_date}",
        vote_average: "${vote_average}"
      ) {
        title
        img
        tmdb_id
        genres
        release_date
        vote_average
        overview
      }
    }`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        query: ql,
      }),
    };
    const obj = {
      title,
      qualityProfileId: 3,
      titleSlug: `${title.replace(' ', '-').toLowerCase()}-${id}`,
      images: [
        {
          coverType: 'poster',
          url: posterUrl || rightImg,
        },
      ],
      tmdbId: id,
      year: Number(new Date(release_date).getFullYear()),
      rootFolderPath: process.env.RADARR_ROOT_FOLDER_PATH,
    };
    const options1 = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
      method: 'POST',
    };

    const url_collection = `${radarr_url}/movie?apikey=${process.env.RADARR_API_KEY}`;
    setLoading(true);
    fetch(url_collection, options1)
      .then(async res => {
        if (res.ok) {
          setCreated(true);
          setInCollection(true);
          fetch(url, options)
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.error(err));
          const msg = `${user.user.email} \nhas requested the movie:\n${title}`;
          await handlePushoverRequest(msg);
          setTimeout(() => {
            setCreated(undefined);
          }, 5000);
        }
        return res.json();
      })
      .then(json => {
        setLoading(false);
        return json;
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setTimeout(() => {
          setError(undefined);
        }, 5000);
      });
  };
  const click = error || loading || created || downloaded || inCollection || hasFile;

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
        <ReturnDiv>
          <Typography variant="body1" component="p">
            <StyledLink to={landing}>
              <ArrowBackIcon />
              Go back
            </StyledLink>
          </Typography>
        </ReturnDiv>

        <MovieContainer>
          <Left>
            {img && !imgToFetch && <Image fixed={img} />}
            {imgToFetch && <ImageFetch src={imgToFetch} />}
          </Left>
          <Right>
            <div style={{ paddingLeft: '10px' }}>
              <Typography variant="h4" component="h4">
                {title}
              </Typography>
            </div>

            <StarDiv>
              <StarRateIcon style={{ fontSize: '42px', color: '#ff6987e6' }} />
              <Typography variant="h4" component="h4" style={{ lineHeigh: 2 }}>
                {vote_average}
              </Typography>
            </StarDiv>
            <ChipContent>
              {genres &&
                genres.map(el => (
                  <div
                    key={el}
                    style={{
                      margin: '5px',
                    }}
                  >
                    <StyledChip key={el} label={gen[el]} variant="outlined" />
                  </div>
                ))}
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
        <Similar key={movie.id} movies={movie.similar} />
      </Wrapper>
    </>
  );
};
const StyledChip = withStyles({
  root: {
    borderRadius: 3,
    border: 0,
    color: 'white',
    boxShadow: '0 0px 1px 2px rgba(255, 105, 135, .3)',
    '&:hover': {
      backgroundColor: '#e4637f',
      opacity: 0.9,
    },
  },
})(Chip);

export default Movie;
