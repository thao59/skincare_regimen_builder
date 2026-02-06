import {useNavigate} from "react-router-dom"; 

function Step8Active({handleActive, userData, handlePopup, popup, activeInfo}){
    const navigate = useNavigate(); 
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question"> Are you using actives in your skincare routine? <span className="note popup_info" onClick={handlePopup}>ⓘ</span></h2>
                {popup && <div className="popup_backdrop">
                    {activeInfo}
                </div>}
                <label><input type="radio" name="active" onChange={() => handleActive("yes")} checked={userData.active_use === true}/> Yes</label>
                <label><input type="radio" name="active" onChange={() => handleActive("no")} checked={userData.active_use === false}/> No</label>
                <div className="button_container">
                    <button className="button_previous" onClick={()=> navigate("/form/step-7")}> &#8592; </button>
                    <button className={`button_next ${userData.active_use === null? "disabled": ""}`} disabled={userData.active_use === null} onClick={() => userData.active_use === false? navigate("/form/step-11"): navigate("/form/step-9")}>&#8594;</button>
                </div>
            </div>
        </div>
    )
}

export default Step8Active;