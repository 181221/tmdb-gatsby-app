require("dotenv").config({
  path: `.env.development`,
})
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    "gatsby-plugin-offline",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-less`,
    {
      resolve: "gatsby-source-tmdb",
      options: {
        // apiKey and sessionID are mandatory
        apiKey: process.env.API_KEY,
        sessionID: process.env.SESSION_ID,
        modules: {
          account: {
            activate: false,
          },
          tv: {
            activate: false,
            endpoints: [["tvAiringToday"], ["tvOnTheAir", 2]],
          },
          misc: {
            activate: true,
            endpoints: [
              ,
              //["miscUpcomingMovies"]
              ["miscPopularMovies", 2],
            ],
          },
        },
      },
    },
    /*
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GatsbyJS`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: "#272B35",
        theme_color: "#00d374",
        display: `standalone`,
      },
    },*/
  ],
}
