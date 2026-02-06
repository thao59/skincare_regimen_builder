import {useNavigate} from "react-router-dom"; 

function Step2Age({userData, handleAge, validateAge, error}){

    const navigate = useNavigate();

    return(
        <div className="labels_container">
            <div className="content_container">
            <h2 className="question">How old are you?</h2>
            <input className="input_field" type="number" onChange={(field) => handleAge(field.target.value)} value={userData.age > 0 ? userData.age : ""} onBlur={validateAge}/>
            <div className="button_container">
                <button className="button_previous" onClick={()=> navigate("/form/step-1")}> &#8592; </button>
                {userData.age < 12 || userData.age > 100 || isNaN(userData.age)? <button className="button_next disabled" disabled>&#8594;</button> : <button className="button_next" onClick ={() => navigate("/form/step-3")}>&#8594;</button>}
            </div>
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    )
}

export default Step2Age;