import "./SendEmail.css"
import {useState} from "react";

function SendEmail(){
    const [msg, setMsg] = useState("");

    const sendToEmail = async() => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sendtoemail/`, {
            method: "POST", 
            headers: {"Authorization": `Bearer ${localStorage.getItem("access")}`}
        })

        const data = await response.json()

        if(response.ok)
        {
            console.log(response.status);
            console.log(data.message);
            setMsg("Results sent to your email!");
        }

        else 
        {
            console.log(response.status);
        }
    }
    return (
        <div>
            <button className="send_result_butt" onClick={sendToEmail}>Email Results</button>
            {msg && <p className="msg">{msg}</p>}
        </div>
    )
}

export default SendEmail;