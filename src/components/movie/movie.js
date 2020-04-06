import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';
import Typography from '@material-ui/core/Typography';
import StarRateIcon from '@material-ui/icons/StarRate';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'gatsby';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import Library from './library';
import { Similar, SimilarFetch } from './similar/similar';
import MovieSkeleton from './skeleton';
import { MovieContainer, ImageSection, InformationSection } from './movie-styles';
import RequestMovie from './requestMovie';
import { gen } from './card';
import { landing } from '../../constants/route';
import FlashMessage, { FlashContainer } from '../flash';
import ImageLoader from '../img';
import { FetchAllMovieData, getLocationId } from './helper';
import { GET_IN_RADARR_COLLECTION, CREATE_MOVIE } from '../gql';

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

const Movie = ({ location }) => {
  const [locationId, setLocationId] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [imgToFetch, setImgToFetch] = useState(false);
  const [movie, setMovie] = useState(undefined);
  const { state = {} } = location;
  const [created, setCreated] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [inRadarrCollection, setInRadarrCollection] = useState(undefined);
  const [downloaded, setDownloaded] = useState(undefined);
  const [hasFile, setHasFile] = useState(undefined);
  const [movieStatus, setMovieStatus] = useState(undefined);
  const [click, setClick] = useState(true);
  const onCompleted = () => {
    setCreated(true);
    setClick(true);
  };
  const [createMovie] = useMutation(CREATE_MOVIE, {
    onCompleted,
    update(cache, { data }) {
      const movieInCollection = cache.readQuery({
        query: GET_IN_RADARR_COLLECTION,
        variables: { tmdbId: movie.id },
      });
      movieInCollection.radarrCollection.isRequested = true;
      cache.writeQuery({
        query: GET_IN_RADARR_COLLECTION,
        data: { ...movieInCollection },
      });
    },
  });
  const { data } = useQuery(GET_IN_RADARR_COLLECTION, {
    variables: { tmdbId: locationId },
  });
  console.log('data', data);
  useEffect(() => {
    const loc = getLocationId(location);
    if (loc) {
      if (locationId && Number(loc) !== locationId) {
        setMovie(state);
      }
      setLocationId(Number(loc));
    } else {
      setError(true);
    }
  }, [location]);
  useEffect(() => {
    if (data && data.radarrCollection) {
      const { hasFile: h, downloaded: d, isRequested } = data.radarrCollection;
      setClick(isRequested);
      setInRadarrCollection(isRequested);
      setHasFile(h);
      setDownloaded(d);
    }
  }, [data]);

  useEffect(() => {
    setLoading(true);
    if ((state && Object.keys(state).length < 2) || state.fetchAll) {
      FetchAllMovieData(getLocationId(location), setMovie, setImgToFetch, setLoading, setError);
    } else {
      setMovie(state);
      setLoading(false);
    }
    return () => {
      setInRadarrCollection(undefined);
      setHasFile(undefined);
      setLoading(undefined);
      setDownloaded(undefined);
      setImgToFetch(undefined);
      setMovie(undefined);
      setCreated(undefined);
    };
  }, [state, error]);

  if (movie) {
    const { title, img, id, overview, release_date, genres, vote_average } = movie;
    const handleMovieRequest = () => {
      const rightImg = imgToFetch || img.src;
      createMovie({
        variables: {
          title,
          img: rightImg,
          tmdbId: id,
          genres,
          vote_average,
          release_date,
          overview,
        },
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
          {state.similar ? (
            <Similar movies={state.similar} />
          ) : (
            <SimilarFetch key={movie.id} id={locationId} />
          )}
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
