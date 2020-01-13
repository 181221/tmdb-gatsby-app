import React, { Component, useState } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import './App.css';
import Skeleton from '@material-ui/lab/Skeleton';
import { Link } from 'gatsby';
import styled from 'styled-components';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { img_tmdb, account_movie } from '../../constants/route';

const SkeletonImg = styled(Skeleton)`
  margin: 12px 12px;
  display: ${props => (props.loading === 'true' ? '' : 'none')};
`;
const ImageFetch = styled.img`
  box-shadow: rgba(0, 0, 0, 0.4) 0px 12px 40px -5px;
  box-sizing: border-box;
  border-radius: 10px;
  width: 200px;
  height: 280px;
  margin: 12px 12px;
  display: ${props => props.loading && 'none'};
`;
const ImageLoader = ({ src }) => {
  const [loading, setLoading] = useState(true);
  const onLoad = () => {
    setLoading(false);
  };
  return (
    <>
      <ImageFetch src={src} onLoad={onLoad} loading={loading} />
      <SkeletonImg variant="rect" width={210} height={280} loading={loading.toString()} />
    </>
  );
};
export const Menu = movies => {
  if (movies && movies.length > 0) {
    return movies.map(el => {
      return (
        <Link
          key={el.id}
          to={`${account_movie}/${el.id}`}
          state={{
            id: '',
            fetchAll: true,
          }}
        >
          <ImageLoader src={img_tmdb + el.poster_path} />
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

const selected = 'item1';

class ScrollBar extends Component {
  constructor(props) {
    super(props);
    // call it again if items count change
    this.menuItems = Menu(this.props.movies, selected);
  }

  render() {
    // Create menu from items
    const menu = this.menuItems;

    return (
      <div className="App">
        <ScrollMenu
          data={menu}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          wheel={false}
          dragging={false}
        />
      </div>
    );
  }
}
export default ScrollBar;
