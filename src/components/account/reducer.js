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
    case 'pushoverUrl': {
      if (!el.value) {
        return {
          ...state,
          pushoverFeilmelding: 'Not a valid url',
          pushoverIsValid: false,
        };
      }
      return { ...state, pushOver: el.value, pushoverFeilmelding: '', pushoverIsValid: true };
    }
    case 'name': {
      if (!el.value) {
        return {
          ...state,
          nameFeilmelding: 'nickname cannot be null',
          nameIsValid: false,
        };
      }
      return { ...state, name: el.value, nameFeilmelding: '', nameIsValid: true };
    }
    case 'checkbox': {
      return { ...state, notification: el.value === 'true' };
    }
    case 'submit': {
      // validate everything and submit the form
      console.log('submit');
      console.log('state', state);
      const isValid = state.pushoverIsValid && state.radarrIsValid && state.nameIsValid;
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
