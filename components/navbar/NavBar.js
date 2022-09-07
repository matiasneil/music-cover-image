import Link from "next/link";

function NavBar() {
  return (
    <nav className="navbar is-light" role="navigation" aria-label="main navigation">
      <div className="navbar-brand ml-0">
        <Link href="/">
          <a className="navbar-item"><img src="/assets/logo/sc-logo.png" width="112" height="28"></img></a>
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
