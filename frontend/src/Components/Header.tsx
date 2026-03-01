const Header = () => {
  return (
    <>
    <header>
    <div className="navbar">
        <h2 className="heading">Digihoito</h2>
        <div className="nav-links">
            <a className="nav-link" href="/patients">Henkilökunta</a>
            <a className="nav-link" href="/doctors">Potilaat</a>
        </div>
    </div>
    </header>
    </>
  )
}

export default Header;