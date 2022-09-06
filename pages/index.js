import Search from "../components/search/Search";
import { getAccessToken } from "../lib/spotify";

export default function Home({ data }) {
  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">Create the perfect musical cover</h1>
          <p className="subtitle">
            Search for a track <strong>now!</strong>
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column">
              <Search accessToken={data.access_token}></Search>
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