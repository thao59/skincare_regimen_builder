import {useNavigate} from "react-router-dom";

function Step11NumberProducts({userData, handleNoProducts, sendData}){
    const navigate = useNavigate();
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question"> How many products do you prefer to have in your regimen?</h2>
                <label><input type="radio" name="no_products" onChange={() => handleNoProducts(3)} checked={userData.no_products === 3}/> Simple (3 products)</label>
                <label><input type="radio" name="no_products" onChange={() => handleNoProducts(5)} checked={userData.no_products === 5}/> Essentials (4-5 products)</label>
                <label><input type="radio" name="no_products" onChange={() => handleNoProducts(6)} checked={userData.no_products === 6}/> Advanced (6+ products)</label>
                <div className="button_container">
                    <button className="button_previous" onClick={() => {
                    if(userData.advanced_user !== "")
                        navigate("/form/step-10")
                    else if (userData.routine === "no_routine")
                        navigate("/form/step-7")
                    else if (userData.active_use === false)
                        navigate("/form/step-8") 
                    }}>&#8592;</button>
                    <button disabled={userData.no_products === 0} className={`button_next ${userData.no_products === 0? "disabled": ""}`} onClick={() => {
                                                                                                                    if(localStorage.getItem("access"))
                                                                                                                        navigate("/form/step-12")
                                                                                                                    else 
                                                                                                                        sendData()}} >&#8594;</button>
                </div>
            </div>
        </div>
    )
}

export default Step11NumberProducts;