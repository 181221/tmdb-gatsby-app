/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
const fetch = require('node-fetch');
// eslint-disable-next-line import/no-extraneous-dependencies
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = async (
  { actions: { createNode, touchNode }, reporter, createContentDigest, store, cache, createNodeId },
  configOptions,
) => {
  // Create nodes here, generally by downloading data
  // from a remote API.
  if (!configOptions.key) {
    throw new Error('no tmdb api key found');
  }
  delete configOptions.plugins;
  const processData = data => {
    const nodeId = createNodeId(`tmdb-movie-${data.id}`);
    const nodeContent = JSON.stringify(data);
    const nodeData = {
      ...data,
      id: nodeId,
      tmdbId: data.id,
      parent: null,
      children: [],
      internal: {
        type: `tmdbMoviePopular`,
        content: nodeContent,
        contentDigest: createContentDigest(data),
      },
    };
    return nodeData;
  };

  const asyncStuff = async url => {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  };

  let datatmdb = await cache.get('cache-data');
  const pageNr = configOptions.pageNr ? configOptions.pageNr : 2;
  const promises = [];
  if (!datatmdb) {
    reporter.info(`No elements in cache`);
    reporter.info('Fetching https://api.themoviedb.org/3/movie/popular');
    datatmdb = [];
    for (let i = 0; i < pageNr; i++) {
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${
        configOptions.key
      }&page=${i + 1}`;
      promises.push(url);
    }
    reporter.info('Fetching Similar Movies');
    const data = await Promise.all(promises.map(el => asyncStuff(el))).then(responses => {
      const tmdbPromis = responses.map(async response => {
        const proms = [];
        for (let i = 0; i < response.results.length; i++) {
          const url = `https://api.themoviedb.org/3/movie/${response.results[i].id}/similar?api_key=${configOptions.key}`;
          proms.push(url);
        }
        const similar = await Promise.all(proms.map(el => asyncStuff(el))).then(res =>
          res.map(el => el.results),
        );
        response.results.map((el, index) => {
          el.similar = similar[index];
        });
        return response;
      });
      return Promise.all(tmdbPromis);
    });
    data.map(el => {
      datatmdb.push(...el.results);
    });
    await cache.set('cache-data', datatmdb);
  }
  return new Promise(res => {
    datatmdb.map(async el => {
      const nodeData = processData(el);

      let imageNodeId;
      const remoteDataCacheKey = nodeData.id;
      const cacheRemoteData = await cache.get(remoteDataCacheKey);
      if (cacheRemoteData) {
        imageNodeId = cacheRemoteData.imageNodeId; // eslint-disable-line prefer-destructuring
        touchNode({ nodeId: cacheRemoteData.imageNodeId });
      }
      if (!imageNodeId) {
        try {
          const fileNode = await createRemoteFileNode({
            url: `https://image.tmdb.org/t/p/w500${nodeData.poster_path}`, // string that points to the URL of the image
            parentNodeId: nodeData.id, // id of the parent node of the fileNode you are going to create
            createNode, // helper function in gatsby-node to generate the node
            createNodeId, // helper function in gatsby-node to generate the node id
            cache, // Gatsby's cache
            store, // Gatsby's redux store
          });
          if (fileNode) {
            nodeData.local_poster_path___NODE = fileNode.id;

            await cache.set(remoteDataCacheKey, nodeData);
          }
        } catch (error) {
          console.log(error);
        }
      }
      res(createNode(nodeData));
    });
  });
};
