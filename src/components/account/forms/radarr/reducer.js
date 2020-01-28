export const reducer = (state, { el, type }) => {
  switch (type) {
    case 'url': {
      const regex = /^(http|https):\/\/[0-9a-zA-Z.-:/]*/gm;
      if (el.value.match(regex) === null) {
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
          apiFeilmelding: 'api key cannot be empty',
          apiIsValid: false,
        };
      }
      return { ...state, api: el.value, apiFeilmelding: '', apiIsValid: true };
    }
    case 'folder': {
      if (!el.value) {
        return {
          ...state,
          folderFeilmelding: 'path cannot be empty',
          folderIsValid: false,
        };
      }
      return { ...state, folder: el.value, folderFeilmelding: '', folderIsValid: true };
    }
    case 'test': {
      const isValid = state.urlIsValid && state.apiIsValid;
      if (isValid && el) {
        let uri;
        try {
          uri = new URL(`${state.url}/system/status?apikey=${state.api}`);
        } catch (error) {
          return { ...state, error: true, errorMessage: error };
        }
        return { ...state, uri };
      }
      return state;
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
