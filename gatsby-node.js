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

const getOptions = () => {
  const ql = `query {
    configuration(id: "configurations") {
      radarrApiKey
      radarrEndpoint
      radarrRootFolder
      pushoverApiKey
      pushoverUserKey
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

const checkFile = (path, reporter) => {
  const fileContent = fs
    .readFileSync(path, 'utf8')
    .toString()
    .split('\n');

  const result = fileContent.reduce((map, obj) => {
    const [left, right] = obj.split('=');
    map[left] = right;
    return map;
  }, {});
  if (!result.AUTH0_DOMAIN || !result.AUTH0_CLIENTID || !result.AUTH0_CALLBACK) {
    reporter.error(`did not find AUTH0 in ${path}`);
    reporter.error('Create an auth0 spa https://auth0.com/docs/quickstart/spa');
    reporter.panic('Setup auth0 in environment file');
  }
  if (!result.PRISMA_ENDPOINT) {
    reporter.error(`did not find PRISMA_ENDPOINT in ${path}`);
    reporter.panic('Setup prisma in environment file');
  }
};

exports.onPreBootstrap = async gatsbyNodeHelpers => {
  const { actions, reporter } = gatsbyNodeHelpers;
  const prod = '.env.production';
  const dev = '.env.development';
  try {
    if (fs.existsSync(prod) && fs.existsSync(dev)) {
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
  checkFile(`${__dirname}/${dev}`, reporter);
  checkFile(`${__dirname}/${prod}`, reporter);
  reporter.info('environment file ok');
  const options = getOptions();
  const endpoint = process.env.PRISMA_ENDPOINT;
  const response = await fetch(endpoint, options);
  if (!response.ok) {
    reporter.error('Error when trying to fetch prisma endpoint, pls check connection');
  } else {
    const json = await response.json();
    const config = json.data.configuration;
    if (!json.data.configuration) {
      reporter.info(`No config found at prisma server`);
      reporter.info(`Prisma config can be created in usersettings`);
      return;
    }
    const fileContent = fs
      .readFileSync(`${__dirname}/${dev}`, 'utf8')
      .toString()
      .split('\n');

    const newContent = fileContent.map(el => {
      const [left, right] = el.split('=');
      if (!left) {
        return;
      }
      let identifier = right;
      if (left === 'RADARR_API_KEY') {
        identifier = config.radarrApiKey;
      }
      if (left === 'RADARR_API_ENDPOINT') {
        identifier = config.radarrEndpoint;
      }
      if (left === 'RADARR_ROOT_FOLDER_PATH') {
        identifier = config.radarrRootFolder;
      }
      return `${left}= ${identifier}`;
    });
    fs.writeFileSync(`${__dirname}/${dev}`, newContent.join('\n'));
    fs.writeFileSync(`${__dirname}/${prod}`, newContent.join('\n'));
  }
};
