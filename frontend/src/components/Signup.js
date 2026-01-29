import {useState} from "react"; 
import "./Signup.css";
import {useNavigate} from "react-router-dom";

function Signup({handlePage, userData, sendData}){
    const navigate = useNavigate();

    const[userDeets, setUserDeets] = useState({email: "", username: "", password: "", confirm_password: ""})
    
    const handleUser = (value, fieldName) => {
        setUserDeets({...userDeets, [fieldName]: value});
    }

    const[error, setError] = useState("");

    const handleSubmit = async () => {
           const response = await fetch (`${process.env.REACT_APP_API_URL}/api/signup/`, {
            method: "POST", 
            headers: {"Content-type": "application/json"}, 
            body: JSON.stringify(userDeets), 
           }); 

           const data = await response.json(); 

           if (response.ok)
           {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            if (userData)
            {
                sendData();
            }
            else
            {
                handlePage("home");
                navigate("/home");
            }
           }
           else 
           {
            console.log("Response status: ", response.status);
            setError(data.error);
            console.log(error);
           }
    }

    return(
    <div className="signup_page">
        {error && <p className="error">{error}</p>}
        <form className="signup_form" onSubmit={(e)=> e.preventDefault()}>
            <p className="title">Signup</p>
            <input className="signup_input" onChange={(field) => handleUser(field.target.value, "email")} placeholder="Your email"/>
            <input className="signup_input" onChange={(field) => handleUser(field.target.value, "username")} placeholder="Username"/>
            <input className="signup_input" type="password" placeholder="Set your password" onChange={(field) => handleUser(field.target.value, "password")} />
            <input className="signup_input" type="password" placeholder="Confirm password" onChange={(field) => handleUser(field.target.value, "confirm_password")}/>
            <button className={`submit_button ${!userDeets.email || !userDeets.username || !userDeets.password || !userDeets.confirm_password? "disabled":""}`} disabled={!userDeets.email || !userDeets.username || !userDeets.password || !userDeets.confirm_password} onClick={(e) => {e.preventDefault(); handleSubmit();}} type="button">Signup</button>
        </form>   
    </div>
    )
}

export default Signup;