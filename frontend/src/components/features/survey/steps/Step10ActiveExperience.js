import {useNavigate} from "react-router-dom"; 

function Step10ActiveExperience({userData, handleAdvancedUser}){
    const navigate = useNavigate(); 
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question"> Are you an experienced user of acids, retinoids and vitamin C?</h2>
                <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("beginner")} checked={userData.advanced_user === "beginner"}/> Beginner </label>
                <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("intermediate")} checked={userData.advanced_user === "intermediate"}/> Intermediate</label>
                <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("advanced")} checked={userData.advanced_user === "advanced"}/> Advanced </label>
                <div className="button_container">
                    <button className="button_previous" onClick={()=> navigate("/form/step-9")}> &#8592; </button>
                    {userData.advanced_user === ""? <button className="button_next disabled" disabled={userData.advanced_user === ""}>&#8594;</button>: <button className="button_next" onClick={() => navigate("/form/step-11")}>&#8594;</button>}
                </div>
            </div>
        </div>
    )
}

export default Step10ActiveExperience;