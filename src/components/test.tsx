import React from 'react';
import { useMovieListQuery } from '../generated/graphql';

const Test = () => {
  const { data, loading, error } = useMovieListQuery();
  console.log(data);
  return (
    <>
      <h1>Hi people</h1>
    </>
  );
};

export default Test;
