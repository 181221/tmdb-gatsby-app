/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
const fetch = require('node-fetch');
// eslint-disable-next-line import/no-extraneous-dependencies
const { createRemoteFileNode } = require('gatsby-source-filesystem');

const genresMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const mapTmdbObject = tmdbMovie => {
  return {
    title: tmdbMovie.title,
    tmdbId: tmdbMovie.id,
    img: tmdbMovie.poster_path,
    genres: Object.values(tmdbMovie.genre_ids).map(id => genresMap[id]),
    overview: tmdbMovie.overview,
    voteCount: tmdbMovie.vote_count,
    voteAverage: tmdbMovie.vote_average,
    year: new Date(tmdbMovie.release_date).getFullYear(),
  };
};

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
    const tmdbMovie = mapTmdbObject(data);
    const nodeData = {
      ...tmdbMovie,
      ...data,
      local_poster_path: data.local_poster_path,
      id: nodeId,
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
        const similar = await Promise.all(proms.map(el => asyncStuff(el))).then(res => {
          return res.map(el => el.results);
        });
        response.results.map((el, index) => {
          const item = similar[index];
          el.similar = Object.values(item).map(tmdbMovie => {
            return mapTmdbObject(tmdbMovie);
          });
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
