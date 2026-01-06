import "./SendEmail.css"

function SendEmail(){
    const sendToEmail = async() => {
        const response = await fetch("http://localhost:8000/sendtoemail/", {
            method: "POST", 
            headers: {"Authorization": `Bearer ${localStorage.getItem("access")}`}
        })

        const data = await response.json()

        if(response.ok)
        {
            console.log(response.status);
            console.log(data.message);
        }

        else 
        {
            console.log(response.status);
        }
    }
    return (
        <div>
            <button className="send_result_butt" onClick={sendToEmail}>Email Results</button>
        </div>
    )
}

export default SendEmail;