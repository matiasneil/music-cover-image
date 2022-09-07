import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import styles from "../styles/create.module.css";
import * as Vibrant from "node-vibrant";
import Switch from "../components/switch/Switch";
import NavBar from "../components/navbar/NavBar";
import html2canvas from "html2canvas";
import ColorSelect from "../components/color-select/ColorSelect";

export default function Create() {
  const router = useRouter();
  const result = JSON.parse(router.query.data);

  /* STATES */
  const [color, setColor] = useState("white");
  const [palette, setPalette] = useState([]);
  const [background, setBackground] = useState("solid");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [backgroundGradient, setBackgroundGradient] = useState({
    start: "",
    end: "",
  });

  /* GET VALUES FROM SONG */
  const trackLengthInSeconds = Math.floor(result.duration_ms / 1000);
  const currentTimeInSeconds = Math.floor(trackLengthInSeconds * 0.7);

  const trackName =
    result.name.length > 60
      ? result.name.substring(0, 60).concat("...")
      : result.name;

  const trackArtists = (artists) => {
    let artistsLabel = "";
    artists.forEach((artist, i) =>
      i > 0
        ? (artistsLabel = artistsLabel.concat(`, ${artist.name}`))
        : (artistsLabel = artistsLabel.concat(`${artist.name}`))
    );

    return artistsLabel.length > 60
      ? artistsLabel.substring(0, 60).concat("...")
      : artistsLabel;
  };

  /* LOAD PALETTE AND SET COLORS */
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

  return (
    <>
      <div className='container fullHeight boxShadow'>
        <NavBar />
        <div className="is-flex is-align-items-center is-flex-direction-column">
          {/* 
        ----------------------
        --------COVER---------
        ----------------------
        */}

          <div
            className={`${styles.cover} is-flex is-flex-direction-column is-justify-content-center my-5`}
            style={{
              background:
                background == "solid"
                  ? backgroundColor
                  : `linear-gradient(90deg, ${backgroundGradient.start} 0%, ${backgroundGradient.end} 100%)`,
            }}
            id="capture"
          >
            <div className="is-flex is-align-items-center">
              <img
                src={result.album.images[1].url}
                className={styles.albumImg}
              ></img>

              <div
                className="is-flex is-flex-direction-column is-justify-content-space-around py-5"
                style={{ width: "100%", paddingLeft: "20px" }}
              >
                <div className="mb-3">
                  <div
                    className="is-flex is-flex-direction-column"
                    style={{ color: color }}
                  >
                    <span className={styles.song}>{trackName}</span>
                    <span className={styles.artist}>
                      {trackArtists(result.artists)}
                    </span>
                  </div>
                </div>

                <div
                  className={`${styles.timeBar} mb-2`}
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
                  className={`${styles.trackTime} is-flex is-justify-content-space-between mb-3`}
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
                    setBackgroundGradient({
                      ...backgroundGradient,
                      start: color,
                    })
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

            <button
              className="button is-light is-info"
              onClick={() => saveImage(result.name)}
            >
              Download
            </button>
          </div>
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

/* FUNCTIONS */

const getFormattedTime = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  let finalTime =
    str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);

  return finalTime;
};

const str_pad_left = (string, pad, length) => {
  return (new Array(length + 1).join(pad) + string).slice(-length);
};

const saveImage = (songName) => {
  html2canvas(document.querySelector("#capture"), {
    logging: true,
    letterRendering: 1,
    allowTaint: false,
    useCORS: true,
  }).then((canvas) => {
    saveAs(canvas.toDataURL(), `${songName} - Cover`);
  });
};

const saveAs = (uri, filename) => {
  var link = document.createElement("a");

  if (typeof link.download === "string") {
    link.href = uri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
};
