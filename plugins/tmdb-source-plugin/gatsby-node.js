/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
const fetch = require('node-fetch');
// eslint-disable-next-line import/no-extraneous-dependencies
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = async (
  { actions: { createNode }, createContentDigest, store, cache, createNodeId },
  configOptions,
) => {
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
      tmdb_id: data.id,
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
  const pageNr = configOptions.pageNr ? configOptions.pageNr : 2;
  const promises = [];
  const asyncStuff = async url => {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  };
  for (let i = 0; i < pageNr; i++) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${configOptions.key}&page=${i +
      1}`;
    promises.push(url);
  }
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
  const datatmdb = [];
  data.map(el => {
    datatmdb.push(...el.results);
  });

  return new Promise(res => {
    datatmdb.map(async el => {
      const nodeData = processData(el);
      try {
        const fileNode = await createRemoteFileNode({
          url: `http://image.tmdb.org/t/p/original${nodeData.poster_path}`, // string that points to the URL of the image
          parentNodeId: nodeData.id, // id of the parent node of the fileNode you are going to create
          createNode, // helper function in gatsby-node to generate the node
          createNodeId, // helper function in gatsby-node to generate the node id
          cache, // Gatsby's cache
          store, // Gatsby's redux store
        });
        if (fileNode) {
          nodeData.local_poster_path___NODE = fileNode.id;
        }
      } catch (error) {
        console.log(error);
      }
      createNode(nodeData);
      res(nodeData);
    });
  });
};
