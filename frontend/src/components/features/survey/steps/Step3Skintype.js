import {useNavigate} from "react-router-dom"; 

function Step3Skintype({handlePopup, popup, skintypeInfo, handleSkinType, userData}){
    const navigate = useNavigate();
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question">What is your skin type?</h2>
                <p className="note">Select the answer that fits you best <span className="popup_info" onClick={handlePopup}>ⓘ</span></p>
                {popup && 
                    <div className="popup_backdrop"> 
                    {skintypeInfo}
                    </div>
                }
                <label><input type="radio" name="skin_type" onChange={() => handleSkinType("oily")} checked={userData.skin_type === "oily"}/> Oily</label>
                <label><input type="radio" name="skin_type" onChange={() => handleSkinType("dry")} checked={userData.skin_type === "dry"}/> Dry</label>
                <label><input type="radio" name="skin_type" onChange={() => handleSkinType("balanced")} checked={userData.skin_type === "balanced"}/> Balanced</label>
                <label><input type="radio" name="skin_type" onChange={() => handleSkinType("combination")} checked={userData.skin_type === "combination"}/> Combination</label>
                <label><input type="radio" name="skin_type" onChange={() => handleSkinType("sensitive")} checked={userData.skin_type === "sensitive"}/> Sensitive</label>
                <div className="button_container">
                    <button className="button_previous" onClick={()=> navigate("/form/step-2")}> &#8592; </button>
                    {!userData.skin_type? <button className="button_next disabled" disabled>&#8594;</button> : <button className="button_next" onClick ={() => navigate("/form/step-4")}>&#8594;</button>}
                </div>
            </div> 
      </div>
    )
}

export default Step3Skintype;