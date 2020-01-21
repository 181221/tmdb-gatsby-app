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
import Similar from './similar';
import { gen } from './card';
import { getProfile } from '../../utils/auth';
import {
  radarr_url,
  prisma_endpoint,
  img_tmdb,
  landing,
  tmdb_endpoint,
} from '../../constants/route';
import { createOptions, handlePushoverRequest } from '../../utils/movieHelper';
import FlashMessage from '../flash';
import ImageLoader from '../img';

const Wrapper = styled.div`
  margin-top: 48px;
`;
const StarDiv = styled.div`
  display: flex;
  margin-top: 12px;
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
  @media (min-width: 1100px) {
    width: 65%;
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
  margin: 0 10%;
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
  margin-bottom: 12px;
`;
const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #e4637f 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    boxShadow: '0 0px 1px 1px rgba(255, 105, 135, .3)',
  },
  white: {
    color: 'white',
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

const getLocationId = ({ pathname }) => {
  const regex = /account\/movie\/[0-9]+/gm;
  const location_id = pathname.match(regex);
  if (location_id) {
    return location_id[0].match(/[0-9]+/)[0];
  }
  return false;
};
const getUrl = (locationId, similarEndPoint = false) => {
  const similar = similarEndPoint ? '/similar' : '';
  const url = `${tmdb_endpoint}/movie/${locationId}${similar}?api_key=${process.env.TMDB_API_KEY}`;
  return url;
};

const handleRequest = async (url, options = { method: 'GET' }) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const json = await res.json();
  return json;
};
const FetchAllMovieData = async (locationId, setMovie, setImgToFetch) => {
  handleRequest(getUrl(locationId))
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
      handleRequest(getUrl(locationId, true)).then(data => {
        obj.similar = data.results;
        setMovie(obj);
      });
    })
    .catch(err => console.error(err));
};

const Movie = ({ location }) => {
  const classes = useStyles();
  const [locationId, setLocationId] = useState(getLocationId(location));
  const [error, setError] = useState(undefined);
  const [imgToFetch, setImgToFetch] = useState(false);
  const [movie, setMovie] = useState(undefined);
  const { state = {} } = location;
  const [fetchMovie, setFetchMovie] = useState(false);
  const [created, setCreated] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [inCollection, setInCollection] = useState(undefined);
  const [downloaded, setDownloaded] = useState(undefined);
  const [hasFile, setHasFile] = useState(undefined);
  const user = getProfile();
  useEffect(() => {
    if (!locationId) {
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (state) {
      if (state.fetchAll) {
        setFetchMovie(true);
      } else {
        setFetchMovie(Object.keys(state).length === 1 && getLocationId(location));
      }

      if (state.fetchSimilar) {
        handleRequest(getUrl(locationId, true)).then(data => {
          state.similar = data.results;
          setMovie({ ...state });
        });
      }
    }
    if (fetchMovie) {
      FetchAllMovieData(getLocationId(location), setMovie, setImgToFetch);
    }
    if (!error && !movie) {
      setMovie(state);
    }
    return () => {
      setInCollection(undefined);
      setHasFile(undefined);
      setLoading(undefined);
      setDownloaded(undefined);
      setLocationId(undefined);
      setImgToFetch(undefined);
      setMovie(undefined);
    };
  }, [fetchMovie, state, error]);

  useEffect(() => {
    if (!error) {
      const collectionCheck = movie || state;
      const url_collection = `${radarr_url}/movie?apikey=${process.env.RADARR_API_KEY}`;
      fetch(url_collection)
        .then(res => res.json())
        .then(json => {
          json.map(el => {
            if (Number(getLocationId(location)) === el.tmdbId && collectionCheck.id === el.tmdbId) {
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
        })
        .catch(err => console.error(err));
    }
  }, [error, movie]);

  if (error) {
    return <div>error</div>;
  }

  if (movie) {
    const { title, img, overview, genres, vote_average } = movie;
    const handleMovieRequest = () => {
      const rightImg = imgToFetch || img.src;
      const { options, options1 } = createOptions(movie, rightImg, user);
      const url_collection = `${radarr_url}/movie?apikey=${process.env.RADARR_API_KEY}`;
      setLoading(true);
      handleRequest(url_collection, options1)
        .then(() => {
          setCreated(true);
          setInCollection(true);
          handleRequest(prisma_endpoint, options);
          setLoading(false);
          const msg = `${user.email} \nhas requested the movie:\n${title}`;
          handlePushoverRequest(msg);
          setTimeout(() => {
            setCreated(undefined);
          }, 2000);
        })
        .catch(err => {
          console.error(err);
          setError(true);
          setTimeout(() => {
            setError(undefined);
          }, 5000);
        });
    };
    const click = created || downloaded || inCollection || hasFile;
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
          {loading ? (
            <div>loading</div>
          ) : (
            <>
              <MovieContainer>
                <Left>
                  {img && img.src && <Image fixed={img} />}
                  {imgToFetch && <ImageLoader src={imgToFetch} width="300px" height="450px" />}
                  {!imgToFetch && img && !img.src && (
                    <ImageLoader src={img} width="300px" height="450px" />
                  )}
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
                    className={`${classes.root} ${click && classes.disabled}`}
                    style={{ maxWidth: '70%' }}
                  >
                    <Typography
                      className={`${!click && classes.white}`}
                      variant="body1"
                      component="p"
                    >
                      Request Movie
                    </Typography>
                  </Button>
                </Right>
              </MovieContainer>
            </>
          )}

          <Similar key={movie.id} movies={movie.similar} />
        </Wrapper>
      </>
    );
  }
  return null;
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
