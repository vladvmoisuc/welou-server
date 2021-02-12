import React, { useState, useRef, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import api from '../../utils/api';
import { loadUserData } from '../../utils/hooks';
import './style.scss';

const Chat = (props) => {
  const { user, messages, history, chatData, conversationPartner } = props;
  const [message, setMessage] = useState('');
  const messagesContainer = useRef(null);

  const handleCurrentMessage = (event) => {
    const { value } = event.target;

    setMessage(value);
  };

  const handleSend = async () => {
    if (message !== '') {
      try {
        await api.post('/chat/message', {
          text: message,
          senderId: user._id,
          receiverId: conversationPartner._id,
          documentId: user.currentChatId,
        });

        setMessage('');

        await api.post('/notification', {
          token: conversationPartner.fcmToken,
          title: `${user.firstName} ${user.lastName} ți-a trimis un mesaj`,
          message: `${message.substring(0, 30)}...`,
          icon: user.avatar,
          type: 'message',
        });
      } catch (error) {}
    }
  };

  const scrollToBottom = () => {
    const hasValidChat =
      user &&
      user.currentChatId &&
      !!chatData &&
      chatData.hasLeft === '' &&
      !!messagesContainer &&
      !!messagesContainer.current &&
      messagesContainer.current.scrollTo;

    if (hasValidChat) {
      setTimeout(() => {
        messagesContainer.current.scrollTo({
          top: messagesContainer.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 500);
    }
  };

  // Handle match message
  useEffect(() => {
    if (user && user.currentChatId && chatData && chatData.matches) {
      const hasPresentedMatchMessage =
        messages &&
        messages.find(
          ({ text }) =>
            text === 'Avem o potrivire. Amândoi doriți să ieșiți împreună!'
        );
      const hasMatchingUsers = Object.keys(chatData.matches).every(
        (key) => chatData.matches[key]
      );

      const sendMatchMessage = async () => {
        await api.post('/chat/message', {
          text: 'Avem o potrivire. Amândoi doriți să ieșiți împreună!',
          senderId: user._id,
          receiverId: conversationPartner._id,
          documentId: user.currentChatId,
          type: 'computer',
        });
      };

      if (chatData && hasMatchingUsers && !hasPresentedMatchMessage) {
        sendMatchMessage();
      }
    }
  }, [chatData.matches]);

  // Scroll to bottom when a new message is sent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadUserData(props);
    scrollToBottom();
  }, []);

  if (
    !!chatData &&
    chatData.hasLeft !== user._id &&
    chatData.hasLeft !== '' &&
    user.currentChatId
  ) {
    return (
      <div className="walkthrough-page chat">
        <TopBar
          label={
            !!conversationPartner &&
            user &&
            user.currentChatId &&
            conversationPartner.firstName + ' ' + conversationPartner.lastName
          }
          hasRightIcon={!!user && !!user.currentChatId ? true : false}
          hasEditIcon={false}
          linkTo={'/lets-meet'}
        />
        <p className="paragraph">
          Cealaltă persoană a părăsit conversația. 😔 Pentru a găsi o altă
          persoană cu care să discuți e nevoie să părăsești conversația.
        </p>
        <Button
          block
          disabled={false}
          size="large"
          className="button_primary button_red margin-top"
          onClick={() => history.push('/lets-meet')}
        >
          Părăsește conversația
        </Button>
      </div>
    );
  }

  return (
    <div className="walkthrough-page page-container chat">
      <TopBar
        label={
          !!conversationPartner &&
          user &&
          user.currentChatId &&
          conversationPartner.firstName !== undefined &&
          conversationPartner.firstName + ' ' + conversationPartner.lastName
        }
        hasRightIcon={!!user && !!user.currentChatId ? true : false}
        hasEditIcon={false}
        linkTo={'/lets-meet'}
      />
      {!!user && !user.currentChatId && (
        <div className="messages walkthrough-page__content">
          <h1 className="heading">Nu ai nici o conversație în desfășurare.</h1>
          <button
            className="button_primary"
            onClick={() => history.push('/match')}
          >
            Caută un partener de discuție
          </button>
        </div>
      )}

      <div
        ref={messagesContainer}
        className="messages walkthrough-page__content"
      >
        {!!messages.length &&
          conversationPartner &&
          user &&
          user.currentChatId &&
          messages
            .sort((a, b) => a.createdAt - b.createdAt)
            .map((message) => (
              <div
                className={`message ${
                  message.senderId === user._id ? 'message_reverse' : ''
                }`}
                key={message.id}
              >
                {message.type === 'message' && (
                  <img
                    src={
                      message.senderId === user._id
                        ? user.avatar
                        : conversationPartner.avatar
                    }
                    className="message__image image"
                  />
                )}
                {(message.type === 'computer' ||
                  message.type === 'initialization') && (
                  <p className="center">{message.text}</p>
                )}

                {message.type === 'message' && (
                  <span
                    className={`message__text ${
                      message.senderId !== user._id ? 'message__text_blank' : ''
                    }`}
                  >
                    {message.text}
                  </span>
                )}
              </div>
            ))}
      </div>

      {!!user && !!user.currentChatId && (
        <div className="search-box">
          <Input
            size="large"
            onChange={handleCurrentMessage}
            value={message}
            onPressEnter={handleSend}
            addonAfter={
              <Button
                onClick={handleSend}
                size="large"
                type="primary"
                icon={<SendOutlined />}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default withRouter(Chat);
