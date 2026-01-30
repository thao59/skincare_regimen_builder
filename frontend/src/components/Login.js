import {useState} from "react"; 
import "./Login.css";
import {useNavigate} from "react-router-dom";


function Login({handlePage, userData, sendData})
{
    const navigate = useNavigate();
    const[userAccount, setUserAccount] = useState({username: "", password: ""});

    const handleAccount = (value, fieldName) => {
        setUserAccount({...userAccount, [fieldName]: value});
    }

    const[error, setError] = useState("");

    const handleSubmit = async () => {
     const response = await fetch (`${process.env.REACT_APP_API_URL}/api/login/`, {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify(userAccount)
        }); 
        const data = await response.json();

        if (response.ok)
        {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            if ((userData.name && userData.age && userData.skin_type && userData.skin_concern.length>0) && (userData.products_type.length>0 ||userData.routine||userData.no_products))
            {
                console.log(userData);
                await sendData();
            }
            else 
            {
                console.log("no user data");
                handlePage("home");
                navigate("/home");
            }
        }
        else
        {
            console.log("error: ", response.status);
            //authentication errors - no credentials 
            if (data.detail)
            {
                setError(data.detail);
            }
            else if (!data.username || !data.password)
            {
                setError("Your username or password is incorrect")
            }
            else 
            {
                setError("Login failed. Please try again."); 
            }
        }
    }


    return (
        <div className="login_page">
            {error && <p className="error">{error}</p>}
            <form className="login_form" onSubmit={(e) => e.preventDefault()}>
                <p className="title">Login</p>
                <input className="login_input" onChange={(field) => handleAccount(field.target.value, "username")} placeholder="Your email"/>
                <input className="login_input" type="password" onChange={(field) => handleAccount(field.target.value, "password")} placeholder="Your password" />
                <button className={`submit_button ${!userAccount.username || !userAccount.password? "disabled": ""}`} disabled={!userAccount.username || !userAccount.password} onClick={(e) => {e.preventDefault(); handleSubmit();}} type="button">Login</button>
                <p className="reminder"> Don't have an account? <button type="button" onClick={() => {handlePage("signup"); navigate("/signup") }}>Sign up</button></p>
            </form>   
        </div>
    )
}

export default Login;


