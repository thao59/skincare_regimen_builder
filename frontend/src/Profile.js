import "./Profile.css";

function Profile({imageArray, username, retrieveData})
{
    if (!retrieveData)
        return <p>Loading profile...</p>
    
    return(
        <div>
            {username && <p>{username}</p>}
            <div className="skininfo_display">
                <p>Age: {retrieveData.age}</p>
                <p>Skin type: {retrieveData.skintype}</p>
                <p> Skin concern: {retrieveData.skin_concern.join(", ")}</p>
                {retrieveData.eye_concern.length>0 && <p>Eye concern: {retrieveData.eye_concern}</p>}
                {retrieveData.products_type.length > 0 && <p>Currently used in routine: {retrieveData.products_type.join(", ")}</p>}
                {retrieveData.routine && <p>Routine: no routine</p>}
                {retrieveData.active_ingre.length>0 && <p>Active in current routine: {retrieveData.active_ingre.join(", ")}</p>}
            </div>
        
            {imageArray && Object.entries(imageArray).map(([date, photo_obj]) => (
                <div className="date" key={date}>
                    <p>{date}</p>
                    <div className="display_profile_img">   
                        {photo_obj.map(x => (            
                            <img key={x.id} className="preview_image" src={`http://localhost:8000/${x.image}`}/>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
export default Profile;