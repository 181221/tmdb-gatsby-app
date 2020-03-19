const dot = require('dotenv').config({
  path: `${process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production'}`,
});

const path = require(`path`);
console.log(dot);

module.exports = {
  pathPrefix: `${process.env.PATH_PREFIX}` || '',
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Radarr-request',
        short_name: 'request',
        start_url: '/',
        background_color: '#2C3E50',
        theme_color: '#fff',
        display: 'standalone',
        icon: 'src/images/logo.png',
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
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'tmdb-source-plugin',
      options: {
        key: process.env.TMDB_API_KEY,
        pageNr: 1,
      },
    },
    'gatsby-plugin-styled-components',
    'babel-plugin-styled-components',
    'gatsby-plugin-less',
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        appendScript: require.resolve(`./src/custom-sw-code.js`),
      },
    },
  ],
};
