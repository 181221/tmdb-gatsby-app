require('dotenv').config({
  path: '.env.development',
});

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-material-ui',
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    'gatsby-plugin-offline',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-styled-components',
    'babel-plugin-styled-components',
    'gatsby-plugin-less',
    {
      resolve: 'gatsby-source-tmdb',
      options: {
        // apiKey and sessionID are mandatory
        apiKey: process.env.API_KEY,
        sessionID: process.env.SESSION_ID,
        language: 'en-US',
        timezone: 'Europe/Berlin',
        reqPerTenSeconds: 36,
        poster: true,
        backdrop: false,
        modules: {
          account: {
            activate: false,
          },
          tv: {
            activate: false,
          },
          misc: {
            activate: true,
            endpoints: [['miscPopularMovies', 3]],
          },
        },
      },
    },
  ],
};
