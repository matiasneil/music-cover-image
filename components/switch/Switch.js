import styles from "./Switch.module.css";

function Switch(props) {
  return (
    <label className={styles.switch}>
        <input type="checkbox" onChange={(event) => props.onChangeFn(event.target.checked)}></input>
        <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  );
}

export default Switch;
