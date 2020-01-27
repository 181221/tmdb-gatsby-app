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
      return { ...state, radarrUrl: el.value, radarrUrlFeilmelding: '', radarrIsValid: true };
    }
    case 'pushOver': {
      if (!el.value) {
        return {
          ...state,
          pushOverFeilmelding: 'key cannot be undefined',
          pushOverIsValid: false,
        };
      }
      return { ...state, pushOver: el.value, pushOverFeilmelding: '', pushOverIsValid: true };
    }
    case 'nickname': {
      if (!el.value) {
        return {
          ...state,
          nicknameFeilmelding: 'nickname cannot be null',
          nicknameIsValid: false,
        };
      }
      return { ...state, nickname: el.value, nicknameFeilmelding: '', nicknameIsValid: true };
    }
    case 'checkbox': {
      return { ...state, notification: el.value === 'true' };
    }
    case 'submit': {
      // validate everything and submit the form

      console.log('state', state);
      const isValid = state.pushOverIsValid && state.radarrIsValid && state.nicknameIsValid;
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
