import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import styles from "../styles/create.module.css";
import * as Vibrant from "node-vibrant";
import Switch from "../components/switch/Switch";
import html2canvas from "html2canvas";

export default function Create() {
  const router = useRouter();
  const [color, setColor] = useState("white");
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [palette, setPalette] = useState([]);

  const result = JSON.parse(router.query.data);

  const trackLengthInSeconds = Math.floor(result.duration_ms / 1000);
  const currentTimeInSeconds = Math.floor(trackLengthInSeconds * 0.7);

  useEffect(() => {
    Vibrant.from(`${result.album.images[1].url}`).getPalette((err, palette) => {
      let paletteArray = [];
      paletteArray.push(palette.DarkMuted.getHex());
      paletteArray.push(palette.LightMuted.getHex());
      paletteArray.push(palette.Muted.getHex());
      paletteArray.push(palette.DarkVibrant.getHex());
      paletteArray.push(palette.LightVibrant.getHex());
      paletteArray.push(palette.Vibrant.getHex());
      setPalette(paletteArray);
    });
  }, []);

  const saveImage = () => {
    html2canvas(document.querySelector("#capture"), {
      logging: true,
      letterRendering: 1,
      allowTaint: false,
      useCORS: true,
    }).then((canvas) => {
      saveAs(canvas.toDataURL(), "cover.png");
    });
  };

  const saveAs = (uri, filename) => {
    var link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  };

  return (
    <>
      <div className="container is-flex is-align-items-center is-flex-direction-column">
        <div
          className={`${styles.cover} is-flex is-flex-direction-column is-justify-content-center`}
          style={{
            backgroundColor: backgroundColor ? backgroundColor : "white",
          }}
          id="capture"
        >
          <div className="is-flex">
            <img
              src={result.album.images[1].url}
              width={result.album.images[1].width}
              height={result.album.images[1].height}
            ></img>

            <div
              className="is-flex is-flex-direction-column is-justify-content-space-around py-5"
              style={{ width: "100%", paddingLeft: "20px" }}
            >
              <div>
                <div
                  className="is-flex is-flex-direction-column"
                  style={{ color: color }}
                >
                  <span className={styles.song}>{result.name}</span>
                  <span className={styles.artist}>
                    {result.artists.map((artist, i) =>
                      i > 0 ? (
                        <span key={i}>, {artist.name}</span>
                      ) : (
                        <span key={i}>{artist.name}</span>
                      )
                    )}
                  </span>
                </div>
              </div>

              <div
                className={styles.timeBar}
                style={{ backgroundColor: color }}
              >
                <div
                  className={styles.currentTimeBar}
                  style={{ backgroundColor: color }}
                >
                  <div
                    className={styles.currentTimeDot}
                    style={{ backgroundColor: color }}
                  ></div>
                </div>
              </div>

              <div
                className={`${styles.trackTime} is-flex is-justify-content-space-between`}
                style={{ color: color }}
              >
                <div>{getFormattedTime(currentTimeInSeconds)}</div>
                <div>{getFormattedTime(trackLengthInSeconds)}</div>
              </div>

              <div className="is-flex is-justify-content-space-between">
                <img src={`/assets/svg/${color}/random.svg`}></img>
                <img src={`/assets/svg/${color}/prev.svg`}></img>
                <img src={`/assets/svg/${color}/pause.svg`}></img>
                <img src={`/assets/svg/${color}/next.svg`}></img>
                <img src={`/assets/svg/${color}/repeat.svg`}></img>
              </div>
            </div>
          </div>
        </div>
        <span className="mb-1"><b>player controls</b></span>
        <div>
          <div className={`${styles.switchContainer} mb-5`}>
            <p>white</p>
            <Switch
              onChangeFn={(isBlack) => {
                setColor(isBlack ? "black" : "white");
              }}
            ></Switch>
            <p>black</p>
          </div>
        </div>
        <span className="mb-1"><b>background</b></span>
        <div className="is-flex is-justify-content-center mb-5">
          {palette.length > 0 &&
            palette.map((color, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: color,
                  height: "50px",
                  width: "50px",
                  border: backgroundColor === color ? "4px solid" : "0px",
                }}
                onClick={() => setBackgroundColor(color)}
              ></div>
            ))}
        </div>
        <button className="button is-light is-info" onClick={saveImage}>
          Download
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  if (!query.data) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return { props: {} };
}

function getFormattedTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  let finalTime =
    str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);

  return finalTime;
}

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}
