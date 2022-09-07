import Search from "../components/search/Search";
import Preview from "../components/preview/Preview";
import { getAccessToken } from "../lib/spotify";

export default function Home({ data }) {
  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">Show your music taste</h1>
          <p className="subtitle">
            Search for a track, build your cover and upload it to Twitter <strong>now!</strong>
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column">
              <Search accessToken={data.access_token}></Search>

              <Preview />
            </div>
          </div>
        </div>
      </section>
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