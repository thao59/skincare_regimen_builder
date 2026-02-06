import {useNavigate} from "react-router-dom"; 

function Step6Pregnancy({userData, handlePregnant}){
    const navigate = useNavigate();
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question">Are you currently pregnant, breastfeeding, planning on getting pregnant or post-partum?</h2>
                <label><input type="radio" name="pregnant" onChange={()=> handlePregnant("yes")} checked={userData.pregnant === true}/> Yes</label>
                <label><input type="radio" name="pregnant" onChange={()=> handlePregnant("no")} checked={userData.pregnant === false} /> No</label>
                <div className="button_container">
                    <button className="button_previous" onClick={()=> navigate("/form/step-5")}> &#8592; </button>
                    {userData.pregnant === null? <button className="button_next disabled" disabled>&#8594;</button>: <button className="button_next" onClick={() => navigate("/form/step-7")}>&#8594;</button>}
                </div>
            </div>
        </div>
    )
}

export default Step6Pregnancy;