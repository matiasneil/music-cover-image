import Link from "next/link";
import { useRouter } from "next/router";

function NavBar(props) {
  const router = useRouter();
  const changeLocale = (locale) => {
    router.push(
      {
        route: router.pathname,
        query: router.query,
      },
      router.asPath,
      { locale }
    );
  };

  const currentLocale = router.locale;
  return (
    <nav
      className="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand ml-0 is-align-items-center is-justify-content-space-between">
        <Link href="/">
          <a className="navbar-item">
            <img src="/assets/logo/sc-logo.png" width="112" height="28"></img>
          </a>
        </Link>
        {/* <span
            onClick={() =>
              currentLocale == 'en' ? changeLocale("es") : changeLocale("en")
            }
            style={{cursor: 'pointer', padding: '0.5rem 0.75rem'}}
          >
            {props.changeLangLabel}
          </span> */}
      </div>
    </nav>
  );
}

export default NavBar;
