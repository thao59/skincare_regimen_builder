import {useState} from "react"; 
import "./Login.css";


function Login({resetSite})
{
    const[userAccount, setUserAccount] = useState({username: "", password: ""});

    const handleAccount = (value, fieldName) => {
        setUserAccount({...userAccount, [fieldName]: value});
    }

    const handleSubmit = async () => {
        console.log("handle submit start");
     const response = await fetch ("http://localhost:8000/login/", {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify(userAccount)
        }); 
        const data = await response.json();

        if (response.ok)
        {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            console.log("access: ", data.access);
            console.log("refresh: ", data.refresh);
            resetSite("home");
            console.log("login was successful");
            console.log("Username: ", userAccount.username);
        }
        else
        {
            console.log("Login is unsuccessful");
        }
    }


    return (
        <div>
            <form className="login_form">
                <p>Login</p>
                <input className="login_input" onChange={(field) => handleAccount(field.target.value, "username")} placeholder="Your email"/>
                <input className="login_input" type="password" onChange={(field) => handleAccount(field.target.value, "password")} placeholder="Your password" />
                <button disabled={!userAccount.username || !userAccount.password} onClick={() => {handleSubmit(); resetSite("hone")}} type="button">Login</button>
            </form>   
        </div>
    )
}

export default Login;


