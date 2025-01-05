import React, { useEffect, useState } from 'react';
import styles from './Notification.module.css';

const Notification = ({ message, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${isClosing ? styles.closing : ''}`}>
      {message}
    </div>
  );
};

export default Notification;