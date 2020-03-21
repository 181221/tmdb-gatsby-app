import React from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';
import Typography from '@material-ui/core/Typography';
import { graphql } from 'gatsby';

const BackgroundContainer = styled.div``;

const StyledImg = styled(Img)`
  background-size: cover;
  background-position: center;
  height: 91vh;
`;
export default ({ data }) => {
  return (
    <BackgroundContainer>
      <StyledImg title="astronaut" fluid={data.file.childImageSharp.fluid} />
      <Typography
        variant="h1"
        component="h1"
        style={{ position: 'fixed', top: '50%', opacity: '0.8' }}
      >
        Requesterr
      </Typography>
    </BackgroundContainer>
  );
};

export const query = graphql`
  query {
    file(relativePath: { eq: "background.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
