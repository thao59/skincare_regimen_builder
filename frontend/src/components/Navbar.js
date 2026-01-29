import "./Navbar.css";
import {useNavigate} from "react-router-dom";

function Navbar({handleLogout, handlePage}){
    const navigate = useNavigate();

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" onClick={() => {navigate("/home"); handlePage("home")}} href="#">Home</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                {localStorage.getItem("access") === null && <a className="nav-link" onClick={() => {navigate("/login"); handlePage("login")}}  aria-current="page">Login</a>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem("access") === null && <a className="nav-link" onClick ={() => {navigate("/signup"); handlePage("signup")}}>Signup</a>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem("access") && <a className="nav-link" onClick={() => {navigate("/profile"); handlePage("profile")}}>Profile</a>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem("access") && <a className="nav-link" onClick={handleLogout}>Signout</a>}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

    )
}

export default Navbar;