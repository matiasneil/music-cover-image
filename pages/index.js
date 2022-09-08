import Search from "../components/search/Search";
import Preview from "../components/preview/Preview";
import { getAccessToken } from "../lib/spotify";
import NavBar from "../components/navbar/NavBar";
import { useState } from "react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function Home({ data }) {
  const [resultsShowing, setResultsShowing] = useState(false);
  const { t } = useTranslation('common');

  return (
    <>
      <div className="container fullHeight boxShadow">
        <NavBar changeLangLabel={t("navbar.changeLangLabel")}/>
        <section className="section pb-0">
          <div className="columns is-centered">
            <div className="column is-two-thirds">
              <h1 className="title">{t('index.title')}</h1>
              <p className="subtitle">{t("index.subtitle")}</p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="columns is-centered">
            <div className="column is-two-thirds">
              <Search
                placeholder={t('search.placeholder')}
                buttonLabel={t('search.buttonLabel')}
                selectSongLabel={t('search.selectSongLabel')}
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

export const getServerSideProps = async ({ locale }) => {
  const { access_token } = await getAccessToken();

  return {
    props: {
      data: {
        access_token: access_token,
      },
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default Home;