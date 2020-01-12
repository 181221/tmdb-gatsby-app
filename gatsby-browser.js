import React from 'react';
import { Location } from '@reach/router';
import { navigate } from 'gatsby';
import { silentAuth } from './src/utils/auth';
import { landing } from './src/constants/route';

class SessionCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    silentAuth(this.handleCheckSession);
  }

  handleCheckSession = () => {
    this.setState({ loading: false });
    if (
      this.props.location.pathname === '/callback/' ||
      this.props.location.pathname === '/callback'
    ) {
      navigate(landing);
    }
    console.log(this.props);
    navigate(this.props.location.pathname);
  };

  render() {
    return this.state.loading === false && <>{this.props.children}</>;
  }
}

export const wrapRootElement = ({ element }) => {
  return (
    <Location>
      {({ location }) => <SessionCheck location={location}>{element}</SessionCheck>}
    </Location>
  );
};
