require('dotenv').config({
  path: '.env.development',
});

module.exports = {
  plugins: [
    {
      resolve: 'tmdb-source-plugin',
      options: {
        key: process.env.TMDB_API_KEY,
        pageNr: 1,
      },
    },
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
  ],
};
