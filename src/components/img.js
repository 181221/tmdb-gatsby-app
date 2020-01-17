import React, { useState } from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import styled from 'styled-components';

const SkeletonImg = styled(Skeleton)`
  margin: 12px 12px;
  display: ${props => (props.loading === 'true' ? '' : 'none')};
`;
const ImageFetch = styled.img`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
  width: ${props => (props.width ? `${props.width};` : '200px;')}
  height: ${props => (props.height ? `${props.height};` : '280px;')}
  display: ${props => (props.loading === 'true' ? 'none;' : '')};
  margin: 12px 12px;
  
`;

const ImageLoader = ({ src, width = '200px', height = '280px' }) => {
  const [loading, setLoading] = useState(true);
  const onLoad = () => {
    setLoading(false);
  };
  return (
    <>
      <ImageFetch
        src={src}
        width={width}
        height={height}
        onLoad={onLoad}
        loading={loading.toString()}
      />
      <SkeletonImg variant="rect" width={width} height={height} loading={loading.toString()} />
    </>
  );
};
export default ImageLoader;
