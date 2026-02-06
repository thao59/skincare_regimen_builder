import {useNavigate} from "react-router-dom"; 

function Step9ActiveIngredient({handleActiveUsage, userData}){
    const navigate = useNavigate(); 
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question"> What actives are in your routine? </h2>
                <label><input type="checkbox" onChange={() => handleActiveUsage("vitaminC")} checked={userData.activeIngre.includes("vitaminC")}/> Vitamin C</label>
                <label><input type="checkbox" onChange={() => handleActiveUsage("niacinamide")} checked={userData.activeIngre.includes("niacinamide")}/> Niacinamide</label>
                <label><input type="checkbox" onChange={() => handleActiveUsage("bha")} checked={userData.activeIngre.includes("bha")}/> BHA</label>
                <label><input type="checkbox" onChange={() => handleActiveUsage("aha")} checked={userData.activeIngre.includes("aha")}/> AHA</label>
                <label><input type="checkbox" onChange={() => handleActiveUsage("pha")} checked={userData.activeIngre.includes("pha")}/> PHA</label>
                <label><input type="checkbox" onChange={() => handleActiveUsage("retinol")} checked={userData.activeIngre.includes("retinol")}/> Retinol</label>
                <label><input type="checkbox" onChange={() => handleActiveUsage("tretinoin")} checked={userData.activeIngre.includes("tretinoin")}/> Tretinoin </label>
                <label><input type="checkbox" onChange={() => handleActiveUsage("azelaicAcid")} checked={userData.activeIngre.includes("azelaicAcid")}/> Azelaic Acid</label>
                <label><input type="checkbox" onChange={() => handleActiveUsage("benzoylPeroxide")} checked={userData.activeIngre.includes("benzoylPeroxide")}/> Benzoyl Peroxide</label>
                <div className="button_container">
                    <button className="button_previous" onClick={()=> navigate("/form/step-8")}> &#8592; </button>
                    {userData.activeIngre.length < 1? <button className="button_next disabled" disabled={userData.activeIngre.length < 1}>&#8594;</button> :<button className="button_next" onClick={() => navigate("/form/step-10")}>&#8594;</button>}
                </div>
            </div>
        </div>
    )
}

export default Step9ActiveIngredient;