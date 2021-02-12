import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import TopBar from '../../components/TopBar';
import ProfileCard from '../../components/ProfileCard';

import api from '../../utils/api';
import { loadUserData } from '../../utils/hooks';

import './style.scss';

const Profile = (props) => {
  const { user } = props;
  const [userProfile, setUserProfile] = useState(null);
  const [isDifferentProfile, setIsDifferentProfile] = useState(false);

  useEffect(() => {
    const getUser = async (id) => {
      const { data } = await api.get('/user', {
        params: {
          id,
        },
      });
      setUserProfile(data);
    };

    if (window.location.href.includes('id=')) {
      setIsDifferentProfile(true);
      getUser(window.location.href.split('id=')[1]);
    } else {
      loadUserData(props);
    }
  }, []);
  const profile = userProfile ? userProfile : user;

  return profile.firstName ? (
    <div className="profile page-container">
      <TopBar
        label={`${profile.firstName} ${profile.lastName}`}
        hasRightIcon={!isDifferentProfile}
        goToNotifications={isDifferentProfile}
      />
      <ProfileCard user={profile} />
    </div>
  ) : (
    <></>
  );
};

export default withRouter(Profile);
