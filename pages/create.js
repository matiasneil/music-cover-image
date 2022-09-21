import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import styles from "../styles/create.module.css";
import * as Vibrant from "node-vibrant";
import Switch from "../components/switch/Switch";
import NavBar from "../components/navbar/NavBar";
import html2canvas from "html2canvas";
import ColorSelect from "../components/color-select/ColorSelect";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";

export default function Create() {
  const router = useRouter();
  const result = JSON.parse(router.query.data);

  const { t } = useTranslation();

  /* STATES */
  const [color, setColor] = useState("white");
  const [palette, setPalette] = useState([]);
  const [finished, setFinished] = useState(false);
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
      <div className="container fullHeight">
        <NavBar changeLangLabel={t("navbar.changeLangLabel")} />
        {!finished && (
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
                  src={result.album.images[0].url}
                  className={styles.albumImg}
                ></img>

                <div
                  className="is-flex is-flex-direction-column is-justify-content-space-around py-5"
                  style={{ width: "100%", paddingLeft: "60px" }}
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

                  <div className={`${styles.playerControls} is-flex is-justify-content-space-between`}>
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
                <b>{t("create.controls.label")}</b>
              </span>
              <div>
                <div className={`${styles.switchContainer} mb-5`}>
                  <small>{t("create.controls.white")}</small>
                  <Switch
                    onChangeFn={(isBlack) => {
                      setColor(isBlack ? "black" : "white");
                    }}
                  ></Switch>
                  <small>{t("create.controls.black")}</small>
                </div>
              </div>

              {/* 
              ----------------------
              ------BACKGROUND------
              ----------------------
              */}

              <span className="mb-1">
                <b>{t("create.background.label")}</b>
              </span>
              <div>
                <div className={`${styles.switchContainer} mb-5`}>
                  <small>{t("create.background.solid.label")}</small>
                  <Switch
                    onChangeFn={(isGradient) => {
                      setBackground(isGradient ? "gradient" : "solid");
                    }}
                  ></Switch>
                  <small>{t("create.background.gradient.label")}</small>
                </div>
              </div>

              {background === "solid" && (
                <>
                  <small>{t("create.background.solid.color")}</small>
                  <ColorSelect
                    palette={palette}
                    setBgColor={setBackgroundColor}
                    selectedColor={backgroundColor}
                  />
                </>
              )}

              {background === "gradient" && (
                <>
                  <small>{t("create.background.gradient.from")}</small>
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
                  <small>{t("create.background.gradient.to")}</small>
                  <ColorSelect
                    palette={palette}
                    setBgColor={(color) =>
                      setBackgroundGradient({
                        ...backgroundGradient,
                        end: color,
                      })
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
                className="button is-light is-info mb-5"
                onClick={() => {
                  saveImage(result.name);
                  setFinished(true);
                }}
              >
                {t("create.download")}
              </button>
            </div>
          </div>
        )}
        {finished && (
          <div className="is-flex is-align-items-center is-flex-direction-column">
            <div className="section mt-5">
              <h1 className="title">{t("create.done.title")}😊</h1>
              <p className="subtitle">{t("create.done.subtitle")}</p>
            </div>

            <button
              className="button is-light is-info mt-2 mb-5"
              onClick={() => router.push("/")}
            >
              {t("create.done.tryAgain")}
            </button>

            <div className="is-flex is-flex-direction-column is-align-items-start">
              <p className="my-5">
                <b>{t("create.done.doneBy")}</b>{" "}
                <a
                  href="https://www.twitter.com/matiasneil"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="tag is-info is-light">@matiasneil</span>
                </a>
              </p>
              <p>
                <b>{t("create.done.using")}</b>
                <ul className="pl-5">
                  <li>
                    <a
                      href="https://developer.spotify.com/documentation/web-api/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>spotify API</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://nextjs.org/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>next.js</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://bulma.io/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>bulma.css</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://html2canvas.hertzen.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>html2canvas</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/i18next/next-i18next"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>next-i18next</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Vibrant-Colors/node-vibrant"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>node-vibrant</span>
                    </a>
                  </li>
                </ul>
              </p>
            </div>

            <button
              className="button my-5"
              onClick={() =>
                router.push("https://github.com/matiasneil/music-cover-image")
              }
            >
              <span className="icon is-small">
                <Image
                  src="/assets/logo/github.png"
                  width={20}
                  height={20}
                ></Image>
              </span>
              <span>{t("create.done.viewGithub")}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ query, locale }) {
  if (!query.data) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
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
    windowWidth: 1920,
    scale: 2.5,
    letterRendering: 1,
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
