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
            resetSite("home");
           }
           else 
           {
            console.log("Response status: ", response.status);
           }
        
    }

    return(
    <div>
        <form className="login_form">
            <p>Signup</p>
            <input className="signup_input" onChange={(field) => handleUser(field.target.value, "email")} placeholder="Your email"/>
            <input className="signup_input" onChange={(field) => handleUser(field.target.value, "username")} placeholder="Username"/>
            <input className="signup_input" type="password" placeholder="Set your password" onChange={(field) => handleUser(field.target.value, "password")} />
            <input className="signup_input" type="password" placeholder="Confirm password" onChange={(field) => handleUser(field.target.value, "confirm_password")}/>
            <button onClick={handleSubmit} type="button">Signin</button>
        </form>   
    </div>
    )
}

export default Signup;