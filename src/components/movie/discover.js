import React from 'react';
import styled from 'styled-components';
import { graphql, useStaticQuery, Link } from 'gatsby';
import Typography from '@material-ui/core/Typography';
import { useApolloClient } from 'react-apollo-hooks';
import Alert from '@material-ui/lab/Alert';
import Card from './card';
import SearchBar from '../search/search-bar';
import { query } from '../gql';
import { account_settings } from '../../constants/route';

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
  const client = useApolloClient();
  const data = client.readQuery({ query });
  const { user } = data;
  const gatsbyRepoData = useStaticQuery(graphql`
    query MyQuery {
      allTmdbMoviePopular(sort: { fields: title }, limit: 50) {
        nodes {
          title
          vote_average
          vote_count
          original_title
          id
          overview
          genre_ids
          release_date
          tmdb_id
          similar {
            poster_path
            id
            title
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
        {!user.hasSettings && (
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
            genres={el.genre_ids}
            vote_average={el.vote_average}
            id={el.tmdb_id}
            release_date={el.release_date}
            posterUrl={el.poster_path}
            similar={el.similar}
          />
        ))}
      </CardContainer>
    </>
  );
};
export default Discover;
