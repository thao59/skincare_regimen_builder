import {useNavigate} from "react-router-dom"; 

function Step7Products({handleProductsType, userData, handleHavingRoutine}){
    const navigate = useNavigate();
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question"> Which products are you currently using in your routine? </h2>
                <p className="note">Select all that apply.</p>
                    <label><input type="checkbox" onChange={() => handleProductsType("cleanser")} checked={userData.products_type.includes("cleanser")}/> Cleanser</label>
                    <label><input type="checkbox" onChange={() => handleProductsType("exfoliator")} checked={userData.products_type.includes("exfoliator")}/> Exfoliator</label>
                    <label><input type="checkbox" onChange={() => handleProductsType("toner")} checked={userData.products_type.includes("toner")}/> Toner</label>
                    <label><input type="checkbox" onChange={() => handleProductsType("serum")} checked={userData.products_type.includes("serum")}/> Serum</label>
                    <label><input type="checkbox" onChange={() => handleProductsType("moisturiser")} checked={userData.products_type.includes("moisturiser")}/> Moisturiser</label>
                    <label><input type="checkbox"  onChange={() => handleHavingRoutine("no_routine")} checked={userData.routine === "no_routine"} /> I don't have a skincare routine</label>
                    <div className="button_container">
                        <button className="button_previous" onClick={()=> navigate("/form/step-6")}> &#8592; </button>
                        <button className={`button_next ${userData.products_type.length < 1 && userData.routine === ""? "disabled": ""}`} disabled={userData.products_type.length < 1 && userData.routine === ""} onClick={() => userData.routine === "no_routine"? navigate("/form/step-11"): navigate("/form/step-8")}>&#8594;</button>
                    </div>
            </div>        
        </div>
    )
}

export default Step7Products;