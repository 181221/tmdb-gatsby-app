const fetch = require(`node-fetch`);
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/account/)) {
    page.matchPath = '/account/*';

    // Update the page.
    createPage(page);
  }
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    /*
     * During the build step, `auth0-js` will break because it relies on
     * browser-specific APIs. Fortunately, we don’t need it during the build.
     * Using Webpack’s null loader, we’re able to effectively ignore `auth0-js`
     * during the build. (See `src/utils/auth.js` to see how we prevent this
     * from breaking the app.)
     */
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /auth0-js/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};

const fs = require('fs');

const updateRadarrSettings = (fileContent, config) => {
  const newContent = fileContent.map(el => {
    const [left, right] = el.split('=');
    if (!left) {
      return;
    }
    let identifier = right;
    if (left === 'RADARR_API_KEY' && identifier) {
      identifier = config.radarrApiKey;
    }
    if (left === 'RADARR_API_ENDPOINT' && identifier) {
      identifier = config.radarrEndpoint;
    }
    if (left === 'RADARR_ROOT_FOLDER_PATH' && identifier) {
      identifier = config.radarrRootFolder;
    }
    return `${left}=${identifier}`;
  });
  return newContent;
};

const getOptions = () => {
  const ql = `query {
    configuration(id: "configurations") {
      radarrApiKey
      radarrEndpoint
      radarrRootFolder
    }
  }
  `;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: ql,
    }),
  };
  return options;
};
const templateFile = `
AUTH0_DOMAIN=""
AUTH0_CLIENTID=""
AUTH0_CALLBACK=""
TMDB_API_KEY=""
PRISMA_ENDPOINT="http://localhost:4000"
RADARR_API_KEY=""
RADARR_API_ENDPOINT="http://localhost:7878/api"
RADARR_ROOT_FOLDER_PATH=""
`;

const getEnvironmentVariables = async path => {
  const fileContent = fs
    .readFileSync(path, 'utf8')
    .toString()
    .split('\n');

  const result = fileContent.reduce((map, obj) => {
    const [left, right] = obj.split('=');
    map[left] = right;
    return map;
  }, {});
  return result;
};
const checkRadarr = result => {
  if (!result.RADARR_API_KEY || !result.RADARR_API_ENDPOINT || !result.RADARR_ROOT_FOLDER_PATH) {
    return false;
  }
  return true;
};
const hasPrisma = async (result, reporter, path) => {
  if (!result.PRISMA_ENDPOINT) {
    reporter.error(
      `did not find PRISMA_ENDPOINT in ${path}\nBe sure that the graphql-server is setup correctly https://github.com/181221/graphql-server-prisma`,
    );
    reporter.info(`Adding default prisma endpoint to environment`);
    fs.appendFileSync(path, '\nPRISMA_ENDPOINT="http://localhost:4000"');
    reporter.info(`Added PRISMA_ENDPOINT="http://localhost:4000"`);
    return false;
  }
  return true;
};
const checkAuth0 = (result, reporter, path) => {
  if (!result.AUTH0_DOMAIN || !result.AUTH0_CLIENTID || !result.AUTH0_CALLBACK) {
    reporter.error(`did not find AUTH0 in ${path}`);
    reporter.error('Create an auth0 spa https://auth0.com/docs/quickstart/spa');
    reporter.panic('Setup auth0 in environment file');
    return false;
  }
  return true;
};

exports.onPreBootstrap = async gatsbyNodeHelpers => {
  const { actions, reporter, createNodeId, createContentDigest } = gatsbyNodeHelpers;
  const env = process.env.NODE_ENV;
  const prod = '.env.production';
  const dev = '.env.development';
  const path = env === 'development' ? `${__dirname}/${dev}` : `${__dirname}/${prod}`;
  try {
    if (fs.existsSync(path)) {
      reporter.info(`Environment exists`);
    } else {
      reporter.info('Creating evironment files');
      fs.writeFileSync(`${__dirname}/${dev}`, templateFile);
      fs.writeFileSync(`${__dirname}/${prod}`, templateFile);
      reporter.info('Created .env.development!');
      reporter.info('Created .env.production!');
      reporter.error(
        'No tmdb api-key found, set TMDB_API_KEY in environment file. Create api key here https://developers.themoviedb.org/3/getting-started/introduction',
      );
      reporter.error('Create an auth0 spa https://auth0.com/docs/quickstart/spa');
      reporter.panic('build failed');
    }
  } catch (err) {
    reporter.info('Creating evironment files');
    return;
  }
  const envVariables = await getEnvironmentVariables(path);
  checkAuth0(envVariables, reporter, path);
  const prismaUrl = hasPrisma(envVariables, reporter, path)
    ? 'http://localhost:4000'
    : process.env.PRISMA_ENDPOINT;
  reporter.info('Environment file - OK');
  let hasRadarrSetup = false;
  const options = getOptions();
  const response = await fetch(prismaUrl, options).catch(error => {
    return { ok: false, message: error.message };
  });
  if (!response.ok) {
    reporter.error(
      'Error when trying to fetch prisma endpoint\nBe sure that graphql-server is setup correctly\nhttps://github.com/181221/graphql-server-prisma',
    );
  } else {
    const json = await response.json();
    const config = json.data.configuration;
    if (!json.data.configuration) {
      reporter.info(
        `No configuration found in the database, please create a config\nConfiguration can be created when you login at account/settings or you can setup the config in the .env file`,
      );
    }
    if (config) {
      if (config.radarrApiKey && config.radarrEndpoint && config.radarrRootFolder) {
        const radarrEndpoint =
          env === 'development' ? 'http://localhost:7878/api' : config.radarrEndpoint;
        const res = await fetch(`${radarrEndpoint}/movie?apikey=${config.radarrApiKey}`, {
          method: 'HEAD',
        });
        if (res.ok) {
          reporter.info(`Radarr Endpoint - OK`);
          hasRadarrSetup = true;
        } else {
          reporter.error(
            `Failed to request Radarr ${res.status} ${res.statusText} \nCheck Radarr configuration at prisma http://localhost:4466/_admin`,
          );
        }
      }
    }
  }
  const node = {
    id: createNodeId('hasRadarrSetup'),
    parent: null,
    children: [],
    internal: {
      type: 'RadarrSettings',
      content: hasRadarrSetup.toString(),
    },
  };
  node.internal.contentDigest = createContentDigest(node);
  return actions.createNode(node);
};
