/* eslint-disable no-dupe-keys */
export const theme = {
  container: {
    position: 'relative',
  },
  input: {
    width: '240px',
    height: 30,
    padding: '10px 20px',
    minWidth: '-webkit-fill-available',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    border: '1px solid #aaa',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  sectionTitle: {
    width: '100%',
    color: 'blue',
  },
  inputFocused: {
    outline: 'none',
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  suggestionsContainer: {
    display: 'none',
    widht: '100%',
  },
  suggestionsContainerOpen: {
    display: 'block',
    top: 51,
    width: '100%',
    color: 'black',
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontSize: '1.25rem',
    fontFamily: 'Roboto, Helvetica Arial sans-serif',
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2,
    transition: 'all 300ms',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px',
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd',
  },
};
