import "./Profile.css";

function Profile({imageArray, username})
{
    return(
        <div>
            {username && <p>{username}</p>}
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