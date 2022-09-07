import { useEffect, useState } from "react";
import styles from "./Preview.module.css";

function Preview() {
  const [count, setCount] = useState(0);

  const covers = ["taylor", "prince", "rina", "radiohead"];
  const [cover, setCover] = useState(covers[0]);

  const limit = covers.length - 1;

  useEffect(() => {
    const timerId = setInterval(() => {
      // Use a functional state update to correctly increment the count
      setCount(count => count < limit ? count + 1 : 0);
    }, 3000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    setCover(covers[count]);
  }, [count]);

  return (
    <div className="is-flex is-justify-content-center">
      <div className={styles.preview}>
        <img
          src="/assets/img/twitter-layout.png"
          className={`${styles.twitterLayout} boxShadow`}
        ></img>
        <img
          src={`/assets/img/${cover}.png`}
          className={styles.cover}
          width="100%"
        ></img>
      </div>
    </div>
  );
}

export default Preview;
