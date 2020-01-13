import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { theme } from './styles';
import { tmdb_endpoint, account_movie } from '../../constants/route';

const StyledLink = styled(Link)`
  color: black;
  min-width: 200px;
`;
const StyledSpan = styled.span`
  min-width: 200px;
`;
const StyledContainer = styled.div``;

const handleRequest = query => {
  const uri = `${tmdb_endpoint}/search/movie?query=${query}&api_key=${process.env.TMDB_API_KEY}`;
  const encodedsearch = encodeURI(uri);
  return fetch(encodedsearch)
    .then(res => res.json())
    .then(json => json)
    .catch(err => console.error(err));
};
const searchAPIDebounced = AwesomeDebouncePromise(handleRequest, 100);

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = req => {
  const arr = req.results.slice(0, 5).map(el => {
    const date = new Date(el.release_date).getFullYear();
    const obj = {
      name: `${el.title} - ${date}`,
      id: el.id,
      title: el.title,
      overview: el.overview,
      genres: el.genre_ids,
      vote_average: el.vote_average,
      img: el.poster_path,
      posterUrl: el.poster_path ? el.poster_path.url : '',
      release_date: el.release_date,
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
    id,
    vote_average,
    overview,
    release_date,
    name,
    posterUrl,
  } = suggestion;
  return (
    <StyledContainer>
      <StyledLink
        to={`${account_movie}/${id}`}
        state={{
          img,
          title,
          genres,
          id,
          vote_average,
          release_date,
          posterUrl,
          overview,
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
  );
};

export default SearchBar;
