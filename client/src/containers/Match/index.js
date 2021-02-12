import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Badge, Button } from 'antd';

import api from '../../utils/api';
import { loadUserData } from '../../utils/hooks';
import { getMessagingToken } from '../../api/firebase';

import ProfileCard from '../../components/ProfileCard';
import MenuBar from '../../components/MenuBar';

import WordMarkIcon from '../../icons/wordmark.svg';
import LogoIcon from '../../icons/icon.svg';
import AddUserIcon from '../../icons/add-user.svg';
import RefreshIcon from '../../icons/refresh.svg';
import ChatIcon from '../../icons/direct.svg';

import './style.scss';

const Match = (props) => {
  const {
    history,
    messages,
    notifications,
    setMatchData,
    user,
    userMatch,
  } = props;
  const getMatch = async (user) => {
    try {
      const {
        data: [match],
      } = await api.get('/user/random', {
        params: {
          id: user._id,
        },
      });
      setMatchData(match || null);
    } catch (error) {
      setMatchData({});
    }
  };

  const rejectUser = async () => {
    await api.post('/user/reject', {
      userId: user._id,
      rejectedUserId: userMatch._id,
    });

    getMatch(user);
  };

  const sendRequest = async () => {
    try {
      await api.post('/user/request', {
        senderId: user._id,
        receiverId: userMatch._id,
      });

      getMatch(user);

      await api.post('/notification', {
        token: userMatch.fcmToken,
        title: 'Notificare nouă',
        message: 'Cineva vrea să vorbiți',
        icon: user.avatar,
        type: 'request',
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user.currentChatId && user._id) {
      getMatch(user);
    }
  }, [user.currentChatId]);

  useEffect(() => {
    const handleMount = async () => {
      const token = await getMessagingToken();
      loadUserData({ ...props, getMatch, token });
    };
    handleMount();
  }, []);

  const count =
    messages.length &&
    messages.sort((a, b) => a.createdAt - b.createdAt)[messages.length - 1]
      .senderId !== user._id
      ? '!'
      : null;

  return (
    <div className="walkthrough-page page-container match">
      <div className="header">
        <img src={WordMarkIcon} className="header__logo_wordmark" />
        <Link to="/chat">
          <Badge count={count}>
            <img src={LogoIcon} className="header__logo_icon" />
          </Badge>
        </Link>
      </div>
      <div className="walkthrough-page__content match__profile-card">
        {user.currentChatId && (
          <>
            <p className="paragraph">
              Ai deja o conversație în deșfășurare. Nu poți căuta alte persoane
              în timp ce vorbești cu cineva.
            </p>
            <Button
              block
              disabled={false}
              size="large"
              className="button_primary"
              onClick={() => history.push('/chat')}
              icon={<img className="button__icon" src={ChatIcon} />}
            >
              Mergi la chat
            </Button>
          </>
        )}
        {!userMatch && !user.currentChatId && (
          <p className="paragraph">
            Nu am putut găsi nici o persoană potrivită pentru tine. Te rugăm să
            revii mai târziu sau încearcă să dai un refresh.
          </p>
        )}
      </div>
      {userMatch && !user.currentChatId && (
        <>
          <div className="walkthrough-page__content match__profile-card">
            <ProfileCard collapsed user={userMatch} />
          </div>
          <div className="match__buttons">
            <Button
              block
              disabled={false}
              size="large"
              className="button_primary button_red"
              onClick={rejectUser}
              icon={<img className="button__icon" src={RefreshIcon} />}
            >
              Refuză
            </Button>
            <Button
              block
              disabled={false}
              size="large"
              className="button_primary "
              onClick={sendRequest}
              icon={<img className="button__icon" src={AddUserIcon} />}
            >
              Discută
            </Button>
          </div>
        </>
      )}
      <MenuBar hasNotifications={!!notifications && !!notifications.length} />
    </div>
  );
};

export default withRouter(Match);
