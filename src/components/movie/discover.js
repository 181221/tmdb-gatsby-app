import React from 'react';
import styled from 'styled-components';
import { graphql, useStaticQuery, Link } from 'gatsby';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Card from './card';
import SearchBar from '../search/search-bar';
import { account_settings } from '../../constants/route';
import { getUserFromCache } from '../../apollo';

const genresMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const Heading = styled.div`
  margin: 24px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 42px 42px;
  justify-content: center;
`;

const Discover = () => {
  const user = getUserFromCache();
  const gatsbyRepoData = useStaticQuery(graphql`
    query MyQuery {
      allTmdbMoviePopular(sort: { fields: title }, limit: 50) {
        nodes {
          id
          title
          img
          tmdbId
          genres
          year
          voteCount
          voteAverage
          overview
          similar {
            tmdbId
            img
            title
            overview
            genres
            voteCount
            voteAverage
            year
          }
          local_poster_path {
            url
            childImageSharp {
              fixed(height: 450, quality: 100) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  `);

  let { nodes } = gatsbyRepoData.allTmdbMoviePopular;
  nodes = nodes.filter(el => el.local_poster_path !== null);
  return (
    <>
      <div style={{ margin: '24px 10%' }}>
        {user.role === 'ADMIN' && !user.hasSettings && (
          <Link to={`${account_settings}`}>
            <Alert severity="info">You need to settup radarr settings click here to setup</Alert>
          </Link>
        )}
      </div>
      <Heading>
        <Typography variant="h4" component="h4" align="center">
          Discover
        </Typography>
      </Heading>
      <SearchBar />
      <CardContainer>
        {nodes.map(el => (
          <Card
            key={el.id}
            img={el.local_poster_path.childImageSharp.fixed}
            title={el.title}
            overview={el.overview}
            genres={el.genres}
            voteAverage={el.voteAverage}
            voteCount={el.voteCount}
            tmdbId={el.tmdbId}
            year={el.year}
            similar={el.similar}
          />
        ))}
      </CardContainer>
    </>
  );
};
export default Discover;
