# Gatsby-tmdb-radarr

## Dependencies

This project requires a server to be running, it can be found here [Graphql-server-prisma](https://github.com/181221/graphql-server-prisma)
Auth0 [single page app](<[https://auth0.com/docs/quickstart/spa/react](https://auth0.com/docs/quickstart/spa/react)>)

## Install

```sh
$ yarn
```

Then you can start the development server with.

```sh
$ gatsby develop
```

This requires gatsby to be install globally, guide can be found here
[Quick Start Gatsby](https://www.gatsbyjs.org/docs/quick-start/)

## Environment variables

1. touch a .env.development and a .env.production in root dir

| Key                     |             Value              |
| ----------------------- | :----------------------------: |
| AUTH0_DOMAIN            |          your domain           |
| AUTH0_CLIENTID          |         your clientId          |
| AUTH0_CALLBACK          | http://localhost:8000/callback |
| TMDB_API_KEY            |   The movie database api key   |
| RADARR_API_KEY          |         Radarr Api key         |
| RADARR_API_ENDPOINT     |        Radarr endpoint         |
| RADARR_ROOT_FOLDER_PATH | Folder where movies are added  |
| PUSHOVER_TOKEN          |        Pushover Api Key        |
| PUSHOVER_USER_KEY       |       Pushover user key        |

## Build and deploy

When ready for production stop the development server and run

```shell
gatsby build
```

View the production site locally. Run:

```shell
gatsby serve
```

More info in this can be found [here](<[https://www.gatsbyjs.org/tutorial/part-eight/](https://www.gatsbyjs.org/tutorial/part-eight/)>)
