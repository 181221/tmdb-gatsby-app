import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';
import Typography from '@material-ui/core/Typography';
import StarRateIcon from '@material-ui/icons/StarRate';
import Chip from '@material-ui/core/Chip';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useApolloClient } from 'react-apollo-hooks';
import { Link } from 'gatsby';
import Library from './library';
import { query } from '../gql';
import Similar from './similar/similar';
import MovieSkeleton from './skeleton';
import RequestMovie from './requestMovie';
import { gen } from './card';
import { radarr_url, prisma_endpoint, landing } from '../../constants/route';
import { createOptions } from '../../utils/movieHelper';
import FlashMessage, { FlashContainer } from '../flash';
import ImageLoader from '../img';
import { FetchAllMovieData, handleRequest, getUrl, getLocationId } from './helper';
import { getUserFromCache } from '../../apollo';

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
export const MovieContainer = styled.div`
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
export const ImageSection = styled.div`
  margin-right: 20px;
  @media (max-width: 768px) {
    align-self: center;
    margin: 0;
  }
`;
export const InformationSection = styled.div`
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
const getMovie = (el, el1) => {
  if (el && Object.keys(el).length > 1) return el;
  if (el1 && Object.keys(el1).length > 1) return el1;
  return undefined;
};

const Movie = ({ location }) => {
  const [locationId, setLocationId] = useState(getLocationId(location));
  const [error, setError] = useState(undefined);
  const [imgToFetch, setImgToFetch] = useState(false);
  const [movie, setMovie] = useState(undefined);
  const { state = {} } = location;
  const [fetchMovie, setFetchMovie] = useState(false);
  const [created, setCreated] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [inRadarrCollection, setInRadarrCollection] = useState(undefined);
  const [radarrCollection, setRadarrCollection] = useState(undefined);
  const [downloaded, setDownloaded] = useState(undefined);
  const [hasFile, setHasFile] = useState(undefined);
  const [movieStatus, setMovieStatus] = useState(undefined);
  const user = getUserFromCache();
  const [click, setClick] = useState(true);

  useEffect(() => {
    if (!locationId) setError(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    if ((state && Object.keys(state).length < 2) || state.fetchAll) {
      FetchAllMovieData(getLocationId(location), setMovie, setImgToFetch, setLoading, setError);
    } else if (state && state.fetchSimilar) {
      handleRequest(getUrl(state.id, true))
        .then(json => {
          state.similar = json.results;
          setMovie({ ...state });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError({ isError: true, message: 'Failed to fetch radarr' });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    setMovie(getMovie(movie, state));
    return () => {
      setInRadarrCollection(undefined);
      setHasFile(undefined);
      setLoading(undefined);
      setDownloaded(undefined);
      setLocationId(undefined);
      setImgToFetch(undefined);
      setMovie(undefined);
    };
  }, [fetchMovie, state, error]);
  useEffect(() => {
    if (movie) {
      fetch(process.env.PRISMA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: user.token },
        body: JSON.stringify({
          query: `{ radarrCollection(tmdbId:${movie.id}) { title tmdbId hasFile downloaded} }`,
        }),
      })
        .then(res => res.json())
        .then(json => {
          if (json.data.radarrCollection.hasFile) {
            setHasFile(true);
          }
          console.log('json', json);
          /* setMovieStatus({
            status: queueElement.status,
            timeleft: queueElement.timeleft,
          }); */
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError({ isError: true, message: 'Failed to fetch radarr' });
          setLoading(false);
        });
    } else setClick(false);
  }, [movie]);

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
          setInRadarrCollection(true);
          setClick(true);
          handleRequest(prisma_endpoint, options);
          setLoading(false);
          setTimeout(() => {
            setCreated(undefined);
          }, 2000);
        })
        .catch(err => {
          console.error(err);
          setError(true);
          setLoading(false);
          setTimeout(() => {
            setError(undefined);
          }, 5000);
        });
    };
    return (
      <>
        <Wrapper>
          <FlashContainer>
            <FlashMessage
              error={error}
              success={created}
              downloaded={downloaded}
              hasFile={hasFile}
              inRadarrCollection={inRadarrCollection}
              movieStatus={movieStatus}
            />
          </FlashContainer>
          <ReturnDiv>
            <Typography variant="body1" component="p">
              <StyledLink to={landing}>
                <ArrowBackIcon />
                Go back
              </StyledLink>
            </Typography>
          </ReturnDiv>
          {loading ? (
            <MovieSkeleton />
          ) : (
            <>
              <MovieContainer>
                <ImageSection>
                  {img && img.src && <Image fixed={img} />}
                  {movie && typeof movie.img === 'string' && (
                    <ImageLoader src={movie.img} width="300px" height="450px" />
                  )}
                </ImageSection>
                <InformationSection>
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
                    <Library
                      inRadarrCollection={inRadarrCollection}
                      hasFile={hasFile}
                      movieStatus={movieStatus}
                    />
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
                  <RequestMovie handleMovieRequest={handleMovieRequest} click={click} />
                </InformationSection>
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
