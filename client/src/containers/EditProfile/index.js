import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { Modal, Button } from 'antd';
import TopBar from '../../components/TopBar';

import api from '../../utils/api';
import { handleUserDelete } from '../../api/firebase';
import { loadUserData } from '../../utils/hooks';

import './style.scss';

const EditProfile = (props) => {
  const { user, history } = props;
  const [isModalVisible, setModalVisibility] = useState(false);

  const onOk = async () => {
    await handleUserDelete();
    await api.post('/user/delete', {
      id: user.facebookId,
    });
    sessionStorage.clear();
    history.push('/');

    setModalVisibility(false);
  };

  const handleDisconnect = () => {
    sessionStorage.clear();
    history.push('/');
  };

  useEffect(() => {
    loadUserData(props);
  }, []);

  return user.firstName ? (
    <div className="profile page-container">
      <TopBar
        label={`${user.firstName} ${user.lastName}`}
        hasRightIcon={false}
      />
      <div className="container">
        <p className="paragraph">Dorești ca profilul tău să fie șters?</p>
        <Button
          block
          disabled={false}
          size="large"
          className="button_primary button_red"
          onClick={() => setModalVisibility(true)}
        >
          Șterge contul
        </Button>
        <p className="paragraph">Vrei să te deconectezi?</p>
        <Button
          block
          disabled={false}
          size="large"
          className="button_primary "
          onClick={handleDisconnect}
        >
          Deconectează-mă
        </Button>
      </div>
      <Modal
        visible={isModalVisible}
        onOk={onOk}
        okText="Da"
        cancelText="Nu"
        onCancel={() => setModalVisibility(false)}
      >
        <p className="paragraph">
          Ești {user.gender === 'm' ? 'sigur' : 'sigură'} că vrei să îți fie
          șters contul? Toate informațiile despre tine for fi distruse.
        </p>
      </Modal>
    </div>
  ) : (
    <></>
  );
};

export default withRouter(EditProfile);
