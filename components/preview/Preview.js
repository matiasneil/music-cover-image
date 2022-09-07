import { useEffect, useState } from "react";
import styles from "./Preview.module.css";

function Preview() {
  const [count, setCount] = useState(0);

  const covers = ["taylor", "prince", "rina", "radiohead"];
  const [cover, setCover] = useState(covers[0]);

  const limit = covers.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCover(covers[count]);

      if (count < limit - 1) {
        setCount((count) => count + 1);
      } else {
        setCount(0);
      }
    }, 2000);

    return () => {
      console.log("clear interval");
      clearInterval(interval);
    };
  }, [count]);

  return (
    <div className="is-flex is-justify-content-center">
      <div className={styles.preview}>
        <img
          src="/assets/img/twitter-layout.png"
          className={styles.twitterLayout}
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
