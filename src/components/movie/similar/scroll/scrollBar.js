import React from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import './App.css';
import { Link } from 'gatsby';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { img_tmdb_small, account_movie } from '../../../../constants/route';
import ImageLoader from '../../../img';

export const Menu = movies => {
  if (movies && movies.length > 0) {
    return movies.map(el => {
      return (
        <Link
          key={el.tmdbId}
          to={`${account_movie}/${el.tmdbId}`}
          state={{
            tmdbId: el.tmdbId,
            title: el.title,
            voteAverage: el.voteAverage,
            voteCount: el.voteCount,
            year: el.year,
            genres: el.genres,
            img: `https://image.tmdb.org/t/p/w500/${el.img}`,
            overview: el.overview,
            fetchSimilar: true,
          }}
        >
          <ImageLoader src={img_tmdb_small + el.img} />
        </Link>
      );
    });
  }
};

const Arrow = ({ text, className }) => {
  return <div className={className}>{text === '<' ? <ArrowBackIcon /> : <ArrowForwardIcon />}</div>;
};

const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

const ScrollBar = ({ movies }) => {
  return (
    <div className="App">
      <ScrollMenu
        data={Menu(movies)}
        arrowLeft={ArrowLeft}
        arrowRight={ArrowRight}
        wheel={false}
        dragging={false}
      />
    </div>
  );
};
export default ScrollBar;
