import { tmdb_endpoint } from '../../constants/route';

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
