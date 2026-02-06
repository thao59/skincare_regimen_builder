import {useNavigate} from "react-router-dom";

function Step5Eyeconcern({handleEyeConcern, userData}){
    const navigate = useNavigate();
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question">Do you have any eye area concerns?</h2>
                <p className="note">Select all that apply</p>
                <label><input type="checkbox" onChange={()=> handleEyeConcern("wrinkles")} checked={userData.eye_concern.includes("wrinkles")}/> Fine Lines and Wrinkles</label>
                <label><input type="checkbox" onChange={()=> handleEyeConcern("dark circles")}  checked={userData.eye_concern.includes("dark circles")}/> Dark Circles</label>
                <label><input type="checkbox" onChange={()=> handleEyeConcern("puffiness")}  checked={userData.eye_concern.includes("puffiness")}/> Puffiness</label>
                <label><input type="checkbox" onChange={()=> handleEyeConcern("dryness")}  checked={userData.eye_concern.includes("dryness")}/> Dryness</label>
                <div className="button_container">
                    <button className="button_previous" onClick={()=> navigate("/form/step-4")}> &#8592; </button>
                    {userData.skin_concern.length < 1? <button className="button_next disabled" disabled>&#8594;</button>:<button className="button_next" onClick ={() => navigate("/form/step-6")}>&#8594;</button>}
                </div>
            </div>
      </div>
    )
}

export default Step5Eyeconcern;