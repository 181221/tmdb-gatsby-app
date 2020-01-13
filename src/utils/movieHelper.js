import { pushover_endpoint } from '../constants/route';

export const createOptions = (movie, img, user) => {
  const { title, id, overview, genres, vote_average, posterUrl, release_date } = movie;

  const ql = `mutation {
      createMovie(
        title: "${title}",
        img: "${img}",
        tmdb_id: "${id}",
        overview: "${overview}",
        genres: "${genres}",
        release_date: "${release_date}",
        vote_average: "${vote_average}"
      ) {
        title
        img
        tmdb_id
        genres
        release_date
        vote_average
        overview
      }
    }`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      query: ql,
    }),
  };
  const obj = {
    title,
    qualityProfileId: 3,
    titleSlug: `${title.replace(' ', '-').toLowerCase()}-${id}`,
    images: [
      {
        coverType: 'poster',
        url: posterUrl || img,
      },
    ],
    tmdbId: id,
    year: Number(new Date(release_date).getFullYear()),
    rootFolderPath: process.env.RADARR_ROOT_FOLDER_PATH,
  };
  const options1 = {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
    method: 'POST',
  };
  return {
    options,
    options1,
  };
};

export const handlePushoverRequest = async (message, title = 'New Movie Request') => {
  const obj = {
    title,
    message,
    token: process.env.PUSHOVER_TOKEN,
    user: process.env.PUSHOVER_USER_KEY,
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  };

  const response = await fetch(pushover_endpoint, options);
  await response.json();
};
