import {useNavigate} from "react-router-dom"; 

function Step4Skinconcern({handleConcern, userData}){ 
    const navigate = useNavigate();
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question"> Identify your top 4 concerns </h2>
                <label><input type="checkbox" onChange={() => handleConcern("acne")} checked={userData.skin_concern.includes("acne")}/> Acne</label>
                <label><input type="checkbox" onChange={() => handleConcern("congestion")} checked={userData.skin_concern.includes("congestion")}/> Congestion</label>
                <label><input type="checkbox" onChange={() => handleConcern("aging")} checked={userData.skin_concern.includes("aging")}/> Aging</label>
                <label><input type="checkbox" onChange={() => handleConcern("pigmentation")} checked={userData.skin_concern.includes("pigmentation")}/> Dark spots/Hyperpigmentation</label>
                <label><input type="checkbox" onChange={() => handleConcern("dehydrated")} checked={userData.skin_concern.includes("dehydrated")}/> Dehydrated</label>
                <label><input type="checkbox" onChange={() => handleConcern("dryness")} checked={userData.skin_concern.includes("dryness")}/> Dry</label>
                <label><input type="checkbox" onChange={() => handleConcern("pores")} checked={userData.skin_concern.includes("pores")}/> Large pores </label> 
                <label><input type="checkbox" onChange={() => handleConcern("sensitive")} checked={userData.skin_concern.includes("sensitive")}/> Sensitive</label>
                <label><input type="checkbox" onChange={() => handleConcern("redness")} checked={userData.skin_concern.includes("redness")}/> Redness</label>
                <label><input type="checkbox" onChange={() => handleConcern("dullness")} checked={userData.skin_concern.includes("dullness")}/> Dullness</label>
                <label><input type="checkbox" onChange={() => handleConcern("texture")} checked={userData.skin_concern.includes("texture")}/> Uneven texture</label>
                <div className="button_container">
                    <button className="button_previous" onClick={()=> navigate("/form/step-3")}> &#8592; </button>
                    {userData.skin_concern.length < 1? <button className="button_next disabled" disabled>&#8594;</button> : <button className="button_next" onClick ={() => navigate("/form/step-5")}>&#8594;</button>}
                </div>
            </div>  
      </div>
    )
}

export default Step4Skinconcern;
