import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { Modal } from 'antd';
import TopBar from '../../components/TopBar';
import Notification from '../../components/Notification';

import { loadUserData } from '../../utils/hooks';
import api from '../../utils/api';

import './style.scss';

const Notifications = (props) => {
  const {
    user,
    setUserData,
    history,
    notifications,
    setNotifications,
    setMessages,
    conversationPartner,
  } = props;
  const [isModalVisible, setModalVisibility] = useState(false);
  const [partner, setPartner] = useState({});

  const handleAcceptRequest = async (fromId) => {
    if (user.currentChatId) {
      const { data: partner } = await api.get('/user', {
        params: {
          id: fromId,
        },
      });

      setModalVisibility(true);
      setPartner(partner);
    } else {
      await acceptRequest(fromId);
    }
  };

  const acceptRequest = async (fromId) => {
    try {
      setMessages([]);

      const { data: chatId } = await api.post('/chat', {
        receiverId: user._id,
        senderId: fromId,
      });
      await api.post('/user/notification/accept', {
        id: user._id,
        from_id: fromId,
        chatId,
      });

      const { data: partner } = await api.get('/user', {
        params: {
          id: fromId,
        },
      });

      history.push('/chat');

      await api.post('/notification', {
        token: partner.fcmToken,
        title: 'Notificare nouă',
        message: `${user.firstName} ${user.lastName} ți-a acceptat cererea.`,
        icon: user.avatar,
        type: 'request',
      });
    } catch (error) {}
  };

  const declineRequest = async (fromId) => {
    await api.post('/user/notification/decline', {
      id: user._id,
      from_id: fromId,
    });

    const { data } = await api.get('/user/notifications', {
      params: {
        id: user._id,
      },
    });

    setNotifications(!!data ? data : []);
  };

  useEffect(() => {
    loadUserData(props);
  }, []);

  return (
    <div className="notifications walkthrough-page page-container match">
      <TopBar label="Notificări" hasRightIcon={false} />
      <div className="notifications__content">
        {!!notifications &&
          !!notifications.length &&
          notifications.map((notification) => (
            <Notification
              image={notification.avatar}
              name={`${notification.firstName} ${notification.lastName}`}
              id={notification._id}
              key={notification.avatar}
              acceptRequest={() => handleAcceptRequest(notification._id)}
              declineRequest={() => declineRequest(notification._id)}
            />
          ))}
        {!!!notifications.length && (
          <p className="paragraph">Nu ai nici o notificare.</p>
        )}
      </div>
      <Modal
        visible={isModalVisible && !!partner}
        onOk={() => acceptRequest(partner._id)}
        okText="Sunt de acord"
        cancelText="Refuz"
        onCancel={() => setModalVisibility(false)}
      >
        <p className="paragraph">
          Dacă accepți această cerere discuția pe care o ai acum va fi ștearsă
          și nu vei mai putea vorbi cu{' '}
          {conversationPartner && conversationPartner.firstName}{' '}
          {conversationPartner && conversationPartner.lastName}.
        </p>
      </Modal>
    </div>
  );
};

export default withRouter(Notifications);
