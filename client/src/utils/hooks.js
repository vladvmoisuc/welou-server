import { useState } from 'react';
import api from '../utils/api';
import {} from '../api/firebase';

export const useAutocompleteSelect = () => {
  const [value, setValue] = useState('');

  const handleSelect = (option, { label: value }) => {
    setValue(value);
  };

  return [value, setValue, handleSelect];
};

export const useAutocompleteMethods = () => {
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const handleOnSelect = (option, { label: value }) => {
    if (options.indexOf(value) < 0) {
      setOptions(options.concat(value));
      setSearchValue('');
    }
  };

  const handleKeyPress = ({ target: { value }, key }) => {
    if (value !== '' && key === 'Enter') {
      handleOnSelect('', { label: value });
    }
  };

  const handleOnRemove = (event) => {
    const { value } = event.currentTarget;

    options.findIndex((sport) => sport === value);

    setOptions(options.filter((sport) => sport !== value));
  };

  return [
    options,
    searchValue,
    setSearchValue,
    handleKeyPress,
    handleOnRemove,
    handleOnSelect,
  ];
};

const getMessages = async (user, setMessages, messages) => {
  if (!user.currentChatId) {
    setMessages([]);
    return;
  }

  if (!messages.length) {
    const { data } = await api.get('/chat/messages', {
      params: {
        chatId: user.currentChatId,
      },
    });

    setMessages(data);
  }
};

const getNotifications = async (user, setNotifications) => {
  const { data } = await api.get('/user/notifications', {
    params: {
      id: user._id,
    },
  });

  setNotifications(data);
};

const handleToken = async (token, user, setUserData) => {
  if (token) {
    try {
      await api.post('/user/update', {
        _id: user._id,
        fcmToken: token,
      });
      setUserData({ ...user, fcmToken: token });
    } catch (error) {}
  }
};

const getChatData = async (user, setChatData) => {
  if (user.currentChatId) {
    try {
      const { data } = await api.get('/chat/chatroom', {
        params: { chatId: user.currentChatId },
      });
      setChatData(data);
      return data;
    } catch (error) {}
  }
  return null;
};

const getConversationPartner = async (
  chatData,
  user,
  setConversationPartner
) => {
  if (chatData) {
    const partnerId = chatData.usersIds.find((id) => id !== user._id);

    const { data } = await api.get('/user', {
      params: {
        id: partnerId,
      },
    });

    setConversationPartner(data);
  }
};

export const loadUserData = async ({
  setUserData,
  setMessages,
  setNotifications,
  history,
  messages,
  fcmToken,
  setChatData,
  setMatchData,
  userMatch,
  getMatch,
  setConversationPartner,
}) => {
  const facebookId = sessionStorage.getItem('facebookId');
  const token = sessionStorage.getItem('token');
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };
  if (facebookId) {
    try {
      await api.get(`https://graph.facebook.com/me?access_token=${token}`);
      const { data } = await api.get('/user', {
        params: {
          facebookId,
        },
      });

      setUserData({ ...data });

      if (data === null || data.walkthrough !== 'completed') {
        history.push('/walkthrough/description');
        return;
      }

      getMessages(data, setMessages, messages);
      const chatData = await getChatData(data, setChatData);
      getNotifications(data, setNotifications);
      getConversationPartner(chatData, data, setConversationPartner);
      fcmToken && handleToken(fcmToken, data, setUserData);

      if (getMatch && history.location.pathname === '/match' && !!!userMatch) {
        getMatch(data);
      }

      if (history.location.pathname === '/') {
        history.push('/match');
      }
    } catch (error) {
      handleLogout();
    }
  } else if (history.location.pathname === '/') {
    return;
  } else handleLogout();
};
