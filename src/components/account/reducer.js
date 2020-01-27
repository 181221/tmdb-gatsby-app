export const reducer = (state, { el, type }) => {
  switch (type) {
    case 'radarrUrl': {
      if (!el.value) {
        return {
          ...state,
          radarrUrlFeilmelding: 'Not a valid url',
          radarrIsValid: false,
        };
      }
      return { ...state, radarrUrlFeilmelding: '', radarrIsValid: true };
    }
    case 'pushOver': {
      if (!el.value) {
        return {
          ...state,
          pushOverFeilmelding: 'key cannot be undefined',
          pushOverIsValid: false,
        };
      }
      return { ...state, pushOverFeilmelding: '', pushOverIsValid: true };
    }
    case 'nickname': {
      if (!el.value) {
        return {
          ...state,
          nicknameFeilmelding: 'nickname cannot be null',
          nicknameIsValid: false,
        };
      }
      return { ...state, nicknameFeilmelding: '', nicknameIsValid: true };
    }
    case 'submit': {
      // validate everything and submit the form

      console.log('state', state);
      if (state.pushOverIsValid && state.radarrIsValid && state.nicknameIsValid) {
        console.log('form is valid');
        // form is valid and we can submit
        return { ...state, isValid: true };
      }
      // form is not valid
      console.log('form is not valid');
      return { ...state, isValid: false };
    }
    default: {
      return state;
    }
  }
};
