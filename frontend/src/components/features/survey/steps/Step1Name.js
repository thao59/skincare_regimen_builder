import {useNavigate} from "react-router-dom"; 

function Step1Name({userData, handleName})
{
    const navigate = useNavigate();
    return(
        <div className="labels_container">
            <h1 className="title"> My Skincare Routine Tracker</h1>
            <p> Track your skincare journey and get personalised recommendations!</p>
            <div className="content_container">
            <h2 className="question">What's your name?</h2>
            <input className="input_field" type="text" onChange={(field) => handleName(field.target.value)} value={userData.name} placeholder="Enter your name"/>
            {!userData.name? <button className="button_next disabled" disabled>&#8594;</button>: <button className="button_next" onClick ={() => navigate("/form/step-2")}>&#8594;</button>}
            </div>
        </div>
    )
}

export default Step1Name;