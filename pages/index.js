import Search from "../components/search/Search";
import Preview from "../components/preview/Preview";
import { getAccessToken } from "../lib/spotify";
import NavBar from "../components/navbar/NavBar";
import { useState } from "react";

export default function Home({ data }) {
  const [resultsShowing, setResultsShowing] = useState(false);

  return (
    <>
      <div className="container fullHeight boxShadow">
        <NavBar />
        <section className="section pb-0">
          <div className="columns is-centered">
            <div className="column is-two-thirds">
              <h1 className="title">Show your music taste</h1>
              <p className="subtitle">
                Search for a track, build your cover and upload it to Twitter{" "}
                <strong>now!</strong>
              </p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="columns is-centered">
            <div className="column is-two-thirds">
              <Search
                accessToken={data.access_token}
                setResultsShowing={setResultsShowing}
              ></Search>

              {!resultsShowing && <Preview />}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export const getServerSideProps = async () => {
  const { access_token } = await getAccessToken();

  return {
    props: {
      data: {
        access_token: access_token,
      },
    },
  };
};
