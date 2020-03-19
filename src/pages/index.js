import React from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';
import { graphql } from 'gatsby';

const BackgroundContainer = styled.div``;

export default ({ data }) => {
  return (
    <BackgroundContainer>
      {
        // <Img fixed={data.file.childImageSharp.fixed} />
      }
    </BackgroundContainer>
  );
};

export const query = graphql`
  query {
    file(relativePath: { eq: "background.jpg" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;
