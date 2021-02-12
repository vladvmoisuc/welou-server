import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { notification as notificationComponent } from 'antd';

import { database, onMessageListener } from './api/firebase';
import { loadUserData } from './utils/hooks';

import routes from './routes';

import './App.scss';

const App = ({ history }) => {
  const [chatData, setChatData] = useState({});
  const [conversationPartner, setConversationPartner] = useState({});
  const [userMatch, setMatchData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUserData] = useState({});
  const props = {
    chatData,
    conversationPartner,
    userMatch,
    messages,
    notifications,
    setChatData,
    setConversationPartner,
    setMatchData,
    setMessages,
    setNotifications,
    setUserData,
    user,
    history,
  };
  const handleNotifications = () => {
    onMessageListener(({ data: { type }, notification }) => {
      const { pathname } = window.location;
      const onNotificationClick = (type) => {
        console.log(type);
        if (type === 'message') {
          history.push(!messages.length ? '/match' : '/chat');
        } else {
          history.push('/notifications');
        }
      };

      if (type === 'message' && pathname === '/chat') return;
      if (type === 'request' && pathname === '/notifications') return;

      notificationComponent.open({
        message: notification.title,
        description: notification.body,
        duration: 2,
        onClick: onNotificationClick,
      });
    });
  };

  const handleMessagesListening = () => {
    if (user && user.currentChatId) {
      database
        .collection('chats')
        .doc(user.currentChatId)
        .collection('messages')
        .onSnapshot((snapshot) => {
          const messagesList = [];
          snapshot.forEach((doc) => messagesList.push(doc.data()));
          setMessages(messagesList);
        });
    }
  };

  useEffect(() => {
    handleMessagesListening();
  }, [user.currentChatId]);

  useEffect(() => {
    loadUserData(props);
    handleNotifications();
    handleMessagesListening();
  }, []);

  return (
    <div className="app">
      <div className="app__containers">
        <Switch>
          {routes.map(({ route, component }) => {
            return (
              <Route path={route} exact={true} key={route}>
                {component(props)}
              </Route>
            );
          })}
          <Redirect from="*" to="/match" />
        </Switch>
      </div>
    </div>
  );
};

export default withRouter(App);
