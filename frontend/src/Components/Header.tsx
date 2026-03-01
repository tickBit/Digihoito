const Header = () => {
  return (
    <>
    <header className="header">
        <h3 className="page-title">Digihoito</h3>
        <div className="nav-links">
            <a className="nav-link" href="/patients">Henkilökunta</a>
            <a className="nav-link" href="/doctors">Potilaat</a>
        </div>
    </header>
    </>
  )
}

export default Header;