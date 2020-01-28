export const reducer = (state, { el, type }) => {
  switch (type) {
    case 'url': {
      if (!el.value) {
        return {
          ...state,
          urlFeilmelding: 'Not a valid url',
          urlIsValid: false,
        };
      }
      return { ...state, url: el.value, urlFeilmelding: '', urlIsValid: true };
    }
    case 'api': {
      if (!el.value) {
        return {
          ...state,
          apiFeilmelding: 'Not a valid api key',
          apiIsValid: false,
        };
      }
      return { ...state, api: el.value, apiFeilmelding: '', apiIsValid: true };
    }
    case 'folder': {
      if (!el.value) {
        return {
          ...state,
          folderFeilmelding: 'Not a folder path',
          folderIsValid: false,
        };
      }
      return { ...state, folder: el.value, folderFeilmelding: '', folderIsValid: true };
    }
    case 'submit': {
      // validate everything and submit the form
      console.log('submit');
      console.log('state', state);
      const isValid = state.urlIsValid && state.apiIsValid && state.folderIsValid;
      if (isValid) {
        console.log('form is valid');
        // form is valid and we can submit
        return { ...state, isValid };
      }
      // form is not valid
      console.log('form is not valid');
      return { ...state, isValid };
    }
    default: {
      return state;
    }
  }
};
