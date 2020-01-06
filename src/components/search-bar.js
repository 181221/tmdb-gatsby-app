import React, { useState, useEffect } from "react"
import Autosuggest from "react-autosuggest"
import AwesomeDebouncePromise from "awesome-debounce-promise"
import { Link } from "gatsby"
import styled from "styled-components"
import { navigate } from "@reach/router"

const StyledLink = styled(Link)``

const handleRequest = query => {
  const uri = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${process.env.API_KEY}`
  const encodedsearch = encodeURI(uri)
  return fetch(encodedsearch)
    .then(res => res.json())
    .then(json => json)
}
const searchAPIDebounced = AwesomeDebouncePromise(handleRequest, 100)

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = req => {
  const arr = req.results.slice(0, 5).map(el => {
    let date = new Date(el.release_date).getFullYear()
    const obj = {
      name: `${el.title} - ${date}`,
      id: el.id,
      title: el.title,
      overview: el.overview,
      genres: el.genres_id,
      vote_average: el.vote_average,
      img: el.poster_path,
      release: el.release_date,
    }
    return obj
  })
  return arr
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => {
  const { img, title, genres, id, vote_average, overview, name } = suggestion
  return (
    <div>
      <StyledLink
        to={`/account/movies/${id}`}
        state={{
          img,
          title,
          genres,
          id,
          vote_average,
          overview,
          image_load: true,
        }}
      >
        {name}
      </StyledLink>
    </div>
  )
}
const useSuggestion = (val, sugges) => {
  const [value, setValue] = useState(val)
  const [suggestions, setSuggestions] = useState(sugges)

  const onChange = e => {
    setValue(e.target.value)
  }
  const onSuggestionsFetchRequested = async val => {
    const req = await searchAPIDebounced(val.value)
    setSuggestions(getSuggestions(req))
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }
  const onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    let test = event
  }

  return {
    value,
    suggestions,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    onChange,
    onSuggestionSelected,
  }
}

const SearchBar = () => {
  const {
    value,
    suggestions,
    onSuggestionsFetchRequested,
    onSuggestionSelected,
    onSuggestionsClearRequested,
    onChange,
  } = useSuggestion("", [""])

  const inputProps = {
    placeholder: "Type a movie",
    value,
    onChange: onChange,
  }
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
  )
}

export default SearchBar
const theme = {
  container: {
    position: "relative",
    width: "50%",
    margin: "auto",
  },
  input: {
    width: "100%",
    height: 30,
    padding: "10px 20px",
    fontFamily: "Helvetica, sans-serif",
    fontWeight: 300,
    fontSize: 16,
    border: "1px solid #aaa",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  inputFocused: {
    outline: "none",
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  suggestionsContainer: {
    display: "none",
    widht: "100%",
  },
  suggestionsContainerOpen: {
    display: "block",
    top: 51,
    width: "100%",
    color: "black",
    border: "1px solid #aaa",
    backgroundColor: "#fff",
    fontFamily: "Helvetica, sans-serif",
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    paddingRight: "40px",
    borderBottomRightRadius: 4,
    zIndex: 2,
    transition: "all 300ms",
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  },
  suggestion: {
    cursor: "pointer",
    padding: "10px 20px",
  },
  suggestionHighlighted: {
    backgroundColor: "#ddd",
  },
}
