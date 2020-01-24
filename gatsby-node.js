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

exports.onPreBootstrap = gatsbyNodeHelpers => {
  console.log(gatsbyNodeHelpers);
  const { actions, reporter } = gatsbyNodeHelpers;
  const prod = '.env.production';
  const dev = '.env.development';

  reporter.info(`Checking environment file`);
  try {
    if (fs.existsSync(prod) && fs.existsSync(dev)) {
      reporter.info(`Environment exists`);
      // Should check keys and also do a patch request for dependencies.
    } else {
      reporter.error(
        `Pls create an .env.production and .env.development in root dir`,
        new Error('err'),
      );
    }
  } catch (err) {
    reporter.error(
      `Pls create an .env.production and .env.development in root dir`,
      new Error(err),
    );
  }
};
