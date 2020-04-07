import { img_tmdb_medium, tmdb_endpoint } from '../../constants/route';

export const getLocationId = ({ pathname }) => {
  const regex = /account\/movie\/[0-9]+/gm;
  const location_id = pathname.match(regex);
  if (location_id) {
    return location_id[0].match(/[0-9]+/)[0];
  }
  return false;
};
export const getUrl = (locationId, similarEndPoint = false) => {
  const similar = similarEndPoint ? '/similar' : '';
  const url = `${tmdb_endpoint}/movie/${locationId}${similar}?api_key=${process.env.TMDB_API_KEY}`;
  return url;
};

export const handleRequest = async (url, options = { method: 'GET' }) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const json = await res.json();
  return json;
};
export const FetchAllMovieData = async (
  locationId,
  setMovie,
  setImgToFetch,
  setLoading,
  setError,
) => {
  handleRequest(getUrl(locationId))
    .then(json => {
      const obj = {
        title: json.title,
        posterUrl: img_tmdb_medium + json.poster_path,
        img: img_tmdb_medium + json.poster_path,
        id: json.id,
        overview: json.overview,
        genres: json.genres.map(el => el.id),
        vote_average: json.vote_average,
        release_date: json.release_date,
      };
      setImgToFetch(img_tmdb_medium + json.poster_path);
      handleRequest(getUrl(locationId, true)).then(data => {
        obj.similar = data.results;
        setMovie(obj);
        setLoading(false);
      });
    })
    .catch(err => {
      setError({ isError: true, message: err.message.toString() });
      setLoading(false);
    });
};
