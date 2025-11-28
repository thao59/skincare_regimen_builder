import "./Profile.css";

function Profile({imageArray, username, retrieveData})
{
    console.log(username);
    if (!retrieveData)
        return <p>Loading profile...</p>

    const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    
    return(
        <div className="profile_page">
            {username && typeof username === "string"  && <h3 className="username">{cap(username)}</h3>}
            <div className="skininfo_display">
                <div className="info_box">
                    <p className="info_title"> 📅  AGE</p>
                    <p>{retrieveData.age}</p>
                </div>
                <div className="info_box">
                    <p className="info_title">💧  SKIN TYPE</p>
                    <p>{cap(retrieveData.skintype)}</p>
                </div>
                <div className="info_box">
                    <p className="info_title"> ⚠️  SKIN CONCERN </p>
                    <p>{retrieveData.skin_concern.map(concern => cap(concern)).join(", ")}</p>
                </div>
                {retrieveData.eye_concern.length > 0 &&
                    <div className="info_box">
                        <p className="info_title"> 👁️  EYE CONCERN</p>
                        <p>{retrieveData.eye_concern.map(concern => cap(concern)).join(", ")}</p>
                    </div>
                }
                {retrieveData.products_type.length > 0 &&
                    <div className="info_box">
                        <p className="info_title"> ✨ CURRENT ROUTINE</p>
                        <p>{retrieveData.products_type.map(product => cap(product)).join(", ")}</p>
                    </div>
                }
                {retrieveData.routine && 
                    <div className="info_box">
                        <p className="info_title"> 🧴  CURRENT ROUTINE</p>
                        <p>{cap(retrieveData.routine).replace(/_/g," ")}</p>
                    </div>
                }
                {retrieveData.active_ingre.length > 0 && 
                    <div className="info_box">
                        <p className="info_title"> 🧪  ACTIVE INGREDIENTS</p>
                        <p>{retrieveData.active_ingre.map(item => cap(item)).join(", ")}</p>
                    </div>
                }
                {retrieveData.advanced_active_use && 
                    <div className="info_box">
                        <p className="info_title"> 📊  ACTIVE USER LEVEL</p>
                        <p>{cap(retrieveData.advanced_active_use)}</p>
                    </div>
                } 
                {retrieveData.no_products !== 0 &&
                    <div className="info_box">
                        <p className="info_title">  📦  ROUTINE PRODUCTS </p>
                        <p>{retrieveData.no_products}</p>
                    </div>
                }
            </div>
            <div className="image_display">
                <h3 className="image_title">PROGRESS PHOTO</h3>
                {imageArray && Object.entries(imageArray).map(([date, photo_obj]) => (
                    <div className="img_container" key={date}>
                        <p className="date">{date}</p>
                        <div className="display_profile_img">   
                            {photo_obj.map(x => (            
                                <img key={x.id} className="preview_image" src={`http://localhost:8000/${x.image}`}/>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Profile;