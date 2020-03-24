/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { graphql, useStaticQuery, navigate } from 'gatsby';
import LoadingApp from '../../components/LoadingApp';
import Error from '../../components/error';
import { addUserToCache } from '../../apollo/index';
import { landing } from '../../constants/route';
import { silentAuth } from './auth';

const SessionCheck = ({ children, location }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasSettings = useStaticQuery(graphql`
    query RadarrSettings {
      radarrSettings {
        internal {
          content
        }
      }
    }
  `);
  const settings = hasSettings.radarrSettings.internal.content;

  const handleCheckSession = user => {
    if (!user) {
      localStorage.setItem('isLoggedIn', false);
    } else {
      if (user.role === 'ADMIN') {
        user.hasSettings = settings === 'true';
      } else {
        user.hasSettings = false;
      }
      addUserToCache(user);
    }
    if (user && !user.error !== undefined) {
      setError(user.error);
    }
    setLoading(false);
    if (location.pathname === '/callback/' || location.pathname === '/callback') {
      navigate(landing);
    }
    navigate(location.pathname);
  };
  useEffect(() => {
    silentAuth(handleCheckSession);
  }, []);
  if (error) return <Error />;
  if (!loading) return <>{children}</>;

  return <LoadingApp />;
};

export default SessionCheck;
