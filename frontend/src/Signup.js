import {useState} from "react"; 
import "./Signup.css";

function Signup({resetSite}){

    const[userData, setUserData] = useState({email: "", username: "", password: "", confirm_password: ""})
    
    const handleUser = (value, fieldName) => {
        setUserData({...userData, [fieldName]: value});
    }

    const handleSubmit = async () => {
           const response = await fetch ("http://localhost:8000/signup/", {
            method: "POST", 
            headers: {"Content-type": "application/json"}, 
            body: JSON.stringify(userData), 
           }); 

           const data = await response.json(); 

           if (response.ok)
           {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            console.log("access token :", localStorage.getItem("access"));
            console.log("refresh token: ", localStorage.getItem("refresh"));
            resetSite("home");
           }
           else 
           {
            console.log("Response status: ", response.status);
           }
    }

    return(
    <div className="signup_page">
        <form className="signup_form">
            <p className="title">Signup</p>
            <input className="signup_input" onChange={(field) => handleUser(field.target.value, "email")} placeholder="Your email"/>
            <input className="signup_input" onChange={(field) => handleUser(field.target.value, "username")} placeholder="Username"/>
            <input className="signup_input" type="password" placeholder="Set your password" onChange={(field) => handleUser(field.target.value, "password")} />
            <input className="signup_input" type="password" placeholder="Confirm password" onChange={(field) => handleUser(field.target.value, "confirm_password")}/>
            <button className={`submit_button ${!userData.email || !userData.username || !userData.password || !userData.confirm_password? "disabled":""}`} disabled={!userData.email || !userData.username || !userData.password || !userData.confirm_password} onClick={handleSubmit} type="button">Signup</button>
        </form>   
    </div>
    )
}

export default Signup;