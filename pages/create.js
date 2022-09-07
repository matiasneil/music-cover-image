import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import styles from "../styles/create.module.css";
import * as Vibrant from "node-vibrant";
import Switch from "../components/switch/Switch";
import html2canvas from "html2canvas";
import ColorSelect from "../components/color-select/ColorSelect";

export default function Create() {
  const router = useRouter();
  const [color, setColor] = useState("white");

  const [background, setBackground] = useState("solid");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [backgroundGradient, setBackgroundGradient] = useState({
    start: "",
    end: "",
  });

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

      const firstColor = paletteArray[0];
      setBackgroundColor(firstColor);

      setBackgroundGradient({ start: firstColor, end: paletteArray[1] });
    });
  }, []);

  const saveImage = () => {
    html2canvas(document.querySelector("#capture"), {
      logging: true,
      letterRendering: 1,
      allowTaint: false,
      useCORS: true,
    }).then((canvas) => {
      saveAs(canvas.toDataURL(), `${result.name} - Cover`);
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
        {/* 
        ----------------------
        --------COVER---------
        ----------------------
        */}

        <div
          className={`${styles.cover} is-flex is-flex-direction-column is-justify-content-center`}
          style={{
            background:
              background == "solid"
                ? backgroundColor
                : `linear-gradient(90deg, ${backgroundGradient.start} 0%, ${backgroundGradient.end} 100%)`,
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

        <div
          className={`${styles.configurations} is-flex is-flex-direction-column is-justify-content-center`}
        >
          {/* 
          ----------------------
          ------CONTROLS------
          ----------------------
          */}

          <span className="mb-1">
            <b>player controls</b>
          </span>
          <div>
            <div className={`${styles.switchContainer} mb-5`}>
              <small>white</small>
              <Switch
                onChangeFn={(isBlack) => {
                  setColor(isBlack ? "black" : "white");
                }}
              ></Switch>
              <small>black</small>
            </div>
          </div>

          {/* 
          ----------------------
          ------BACKGROUND------
          ----------------------
          */}

          <span className="mb-1">
            <b>background</b>
          </span>
          <div>
            <div className={`${styles.switchContainer} mb-5`}>
              <small>solid</small>
              <Switch
                onChangeFn={(isGradient) => {
                  setBackground(isGradient ? "gradient" : "solid");
                }}
              ></Switch>
              <small>gradient</small>
            </div>
          </div>

          {background === "solid" && (
            <>
              <small>color</small>
              <ColorSelect
                palette={palette}
                setBgColor={setBackgroundColor}
                selectedColor={backgroundColor}
              />
            </>
          )}

          {background === "gradient" && (
            <>
              <small>from</small>
              <ColorSelect
                palette={palette}
                setBgColor={(color) =>
                  setBackgroundGradient({ ...backgroundGradient, start: color })
                }
                selectedColor={backgroundGradient.start}
              />
              <small>to</small>
              <ColorSelect
                palette={palette}
                setBgColor={(color) =>
                  setBackgroundGradient({ ...backgroundGradient, end: color })
                }
                selectedColor={backgroundGradient.end}
              />
            </>
          )}

          {/* 
          ----------------------
          -------DOWNLOAD-------
          ----------------------
          */}

          <button className="button is-light is-info" onClick={saveImage}>
            Download
          </button>
        </div>
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
