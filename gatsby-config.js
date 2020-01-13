require('dotenv').config({
  path: '.env.development',
});

module.exports = {
  plugins: [
    {
      resolve: 'tmdb-source-plugin',
      options: {
        key: 'cfe422613b250f702980a3bbf9e90716',
        pageNr: 4,
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
