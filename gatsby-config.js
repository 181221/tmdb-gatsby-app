const dot = require('dotenv').config({
  path: `${process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production'}`,
});

console.log(dot);

module.exports = {
  pathPrefix: `${process.env.PATH_PREFIX}` || '',
  plugins: [
    {
      resolve: 'tmdb-source-plugin',
      options: {
        key: process.env.TMDB_API_KEY,
        pageNr: 5,
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
    'gatsby-plugin-typescript',
    'gatsby-plugin-offline',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-styled-components',
    'babel-plugin-styled-components',
    'gatsby-plugin-less',
  ],
};
