import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Checkbox.module.css";

const Checkbox = (props) => {
  const { onCheckboxClicked } = props;
  const { isChecked } = props;

  const checkmarkRef = useRef();
  const [updatedCheckedState, setChecked] = useState(isChecked);

  return (
    <div
      className={styles.checkboxContainer}
      onClick={() => {
        setChecked(!updatedCheckedState);
        onCheckboxClicked(!updatedCheckedState);
      }}
    >
      <div className={styles.checkbox} ref={checkmarkRef}>
        <div
          className={
            updatedCheckedState
              ? `${styles.innerUncompletedCircle} ${styles.completed}`
              : `${styles.innerUncompletedCircle}`
          }
        ></div>
        <span
          className={
            updatedCheckedState
              ? `${styles.checkmark} ${styles.visible}`
              : `${styles.checkmark}`
          }
        >
          ✓
        </span>
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  onCheckboxClicked: PropTypes.func,
  isChecked: PropTypes.bool,
};

export default Checkbox;
