
function Navbar({onPageChange, resetStage, handleLogout, retrieveImg}){

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" onClick={() => {onPageChange("home") }} href="#">Home</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                {localStorage.getItem("access") === null && <a className="nav-link" onClick={() => {onPageChange("login"); resetStage(0)}}  aria-current="page" href="#">Login</a>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem("access") === null && <a className="nav-link" onClick ={() => {onPageChange("signup"); resetStage(0)}} href="#">Signup</a>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem("access") && <a className="nav-link" onClick={() => {onPageChange("profile"); resetStage(0); retrieveImg()}} href="#">Profile</a>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem("access") && <a className="nav-link" href="#" onClick={handleLogout}>Signout</a>}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

    )
}

export default Navbar;