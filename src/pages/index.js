import React from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';
import Typography from '@material-ui/core/Typography';
import { graphql } from 'gatsby';

const StyledImg = styled(Img)`
  background-size: cover;
  background-position: center;
  height: 91vh;
`;
export default ({ data }) => {
  return (
    <>
      <StyledImg title="astronaut" fluid={data.file.childImageSharp.fluid} />
      <Typography
        variant="h1"
        component="h1"
        style={{ position: 'fixed', top: '40%', opacity: '0.8' }}
      >
        Requesterr
      </Typography>
    </>
  );
};

export const query = graphql`
  query {
    file(relativePath: { eq: "background.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1920, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
