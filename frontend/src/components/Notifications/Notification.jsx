import React, { useEffect, useState } from 'react';
import styles from './Notification.module.css';

const Notification = ({ message, type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]} ${isClosing ? styles.closing : ''}`}>
      {message}
    </div>
  );
};

export default Notification;