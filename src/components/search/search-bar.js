import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { theme } from './styles';
import { tmdb_endpoint, account_movie, img_tmdb_medium } from '../../constants/route';

const SuggestContainer = styled.div`
  margin: 0 20%;
  @media screen and (max-width: 668px) {
    margin: 0 12px 0 12px;
  }
`;
const StyledLink = styled(Link)`
  color: black;
  min-width: 200px;
`;
const StyledSpan = styled.span`
  min-width: 200px;
`;
const StyledContainer = styled.div``;

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

const handleRequest = query => {
  const uri = `${tmdb_endpoint}/search/movie?query=${query}&api_key=${process.env.TMDB_API_KEY}`;
  const encodedsearch = encodeURI(uri);
  return fetch(encodedsearch)
    .then(res => res.json())
    .then(json => json);
};
const searchAPIDebounced = AwesomeDebouncePromise(handleRequest, 100);

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = req => {
  const arr = req.results.slice(0, 5).map(el => {
    const date = new Date(el.release_date).getFullYear();
    const obj = {
      name: `${el.title} - ${date}`,
      tmdbId: el.id,
      title: el.title,
      overview: el.overview,
      genres: Object.values(el.genre_ids).map(id => genresMap[id]),
      voteAverage: el.vote_average,
      img: img_tmdb_medium + el.poster_path,
      voteCount: el.vote_count,
      year: el.date,
      fetchSimilar: true,
    };
    return obj;
  });
  return arr;
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = ({ name }) => {
  if (name) return name;
  return '';
};

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => {
  const {
    img,
    title,
    genres,
    voteAverage,
    overview,
    year,
    voteCount,
    tmdbId,
    name,
    fetchSimilar,
  } = suggestion;
  return (
    <StyledContainer>
      <StyledLink
        to={`${account_movie}/${tmdbId}`}
        state={{
          img,
          title,
          genres,
          voteAverage,
          tmdbId,
          year,
          voteCount,
          overview,
          fetchSimilar,
          image_load: true,
        }}
      >
        <StyledSpan>{name}</StyledSpan>
      </StyledLink>
    </StyledContainer>
  );
};
const useSuggestion = (val, sugges) => {
  const [value, setValue] = useState(val);
  const [suggestions, setSuggestions] = useState(sugges);

  const onChange = e => {
    if (e.target.value) {
      setValue(e.target.value);
    } else {
      setValue('');
    }
  };
  const onSuggestionsFetchRequested = async el => {
    if (value) {
      const req = await searchAPIDebounced(el.value);
      setSuggestions(getSuggestions(req));
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  const onSuggestionSelected = event => event.name;

  return {
    value,
    suggestions,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    onChange,
    onSuggestionSelected,
  };
};

const SearchBar = () => {
  const {
    value,
    suggestions,
    onSuggestionsFetchRequested,
    onSuggestionSelected,
    onSuggestionsClearRequested,
    onChange,
  } = useSuggestion('', ['']);

  const inputProps = {
    placeholder: 'Type a movie..',
    value,
    onChange,
  };
  return (
    <SuggestContainer>
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    </SuggestContainer>
  );
};

export default SearchBar;
