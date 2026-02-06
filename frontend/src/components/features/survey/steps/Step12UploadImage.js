import {useNavigate} from "react-router-dom";

function Step12UploadImage({handleImage, image, sendData, userData, handleSendImage}){
    const navigate = useNavigate();
    return(
        <div className="labels_container">
            <div className="content_container">
                <h2 className="question">Upload photos of your skin <span className="opt">(optional)</span></h2>
                <p className="opt">Please upload file smaller than 5MB </p>
                <input className="upload_img" type="file" accept="image/*" onChange ={(img) => handleImage(img.target.files[0])}/>
                {image && <img className="preview_image" src={image} alt="preview"/>}
                <button className="photo_button" onClick={() => {sendData()}}> Skip for now </button>
                <div className="button_container">
                    {userData.no_products !== 0 &&  <button className="button_previous" onClick={()=> navigate("/form/step-11")}> &#8592; </button>}
                    <button className={`photo_button ${!image? "disabled": ""}`} onClick={() => {handleSendImage()}} disabled={!image}> Upload photo </button>
                </div>
            </div>
        </div> 
    )
}

export default Step12UploadImage;