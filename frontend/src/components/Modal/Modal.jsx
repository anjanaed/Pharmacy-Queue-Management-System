import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './modal.module.css';

const Modal = ({ show, handleClose, children }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (!show) {
    return null;
  }

  const handleDownloadHistory = () => {
    // Implement the download history functionality here
    console.log('Download History clicked');
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
   
        <div className={styles.datePickerContainer}>
          <div className={styles.datePicker}>
            <label>Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
            />
          </div>
          &nbsp;&nbsp;&nbsp;
          <div className={styles.datePicker}>
            <label>End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
            />
          </div>
        </div>
        <button className={styles.downloadButton} onClick={handleDownloadHistory}>Download History</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;