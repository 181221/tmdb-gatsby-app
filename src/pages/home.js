import React from 'react';
import styled from 'styled-components';
import { graphql, useStaticQuery } from 'gatsby';
import Typography from '@material-ui/core/Typography';
import Card from '../components/movie/card';
import SearchBar from '../components/search/search-bar';
import Test from '../components/test';

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

const Home = () => {
  const gatsbyRepoData = useStaticQuery(graphql`
    query MyQuery {
      allTmdbMoviePopular(sort: { fields: title }, limit: 60) {
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
      <Heading>
        <Typography variant="h4" component="h4" align="center">
          Discover
        </Typography>
      </Heading>
      <Test />
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
export default Home;
