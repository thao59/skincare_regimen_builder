import "./Profile.css";
import {useState} from "react";
import Chatbox from "./Chatbox";

function Profile({imageArray, product_list, skinProfile, handlePage, profileName})
{
    const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const URL = "http://localhost:8000";
    
    const [time, setTime] = useState("am")
    const handleTime = (string) => {
        setTime(string);
    }
     
    const sunIcon = (<svg class="sun_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>);
    
    const moonIcon = (<svg class="moon_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="15" height="15">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg> );

    const bothIcon = <>{sunIcon} {moonIcon}</>;

    const Icon = {"am" : sunIcon, "pm": moonIcon, "am_pm": bothIcon};

    const[button, setButton] = useState("all");
    const handleButton = (string) => 
    {
        setButton(string);
    }

    console.log(profileName);
    if (!skinProfile) 
        if(profileName)
        {
            return<>
                <p className="username">{profileName}</p>
                <p>You don't have a profile yet. </p>
                <Chatbox/>
            </>
        }
        else
        {
            return <p>Loading profile...</p>
        }
        
    
    console.log(product_list);
    console.log(product_list.cleanser);
    console.log(product_list.toner);
    console.log(product_list.serum);
    console.log(product_list.moisturiser);
    console.log(product_list.eye);
    console.log(product_list.sunscreen);
    console.log(product_list.oilcleanser);
    console.log(product_list.micellarwater);

    return(
        <>
            <div className="profile_page">
                {skinProfile.username && typeof skinProfile.username === "string"  && <h3 className="username">{cap(skinProfile.username)}</h3>}
                <div className="skininfo_display">
                    <div className="info_box">
                        <p className="info_title"> 📅  AGE</p>
                        <p>{skinProfile.age}</p>
                    </div>
                    <div className="info_box">
                        <p className="info_title">💧  SKIN TYPE</p>
                        <p>{cap(skinProfile.skintype)}</p>
                    </div>
                    <div className="info_box">
                        <p className="info_title"> ⚠️  SKIN CONCERN </p>
                        <p>{skinProfile.skin_concern.map(concern => cap(concern)).join(", ")}</p>
                    </div>
                    {skinProfile.eye_concern.length > 0 &&
                        <div className="info_box">
                            <p className="info_title"> 👁️  EYE CONCERN</p>
                            <p>{skinProfile.eye_concern.map(concern => cap(concern)).join(", ")}</p>
                        </div>
                    }
                    {skinProfile.products_type.length > 0 &&
                        <div className="info_box">
                            <p className="info_title"> ✨ CURRENT ROUTINE</p>
                            <p>{skinProfile.products_type.map(product => cap(product)).join(", ")}</p>
                        </div>
                    }
                    {skinProfile.routine && 
                        <div className="info_box">
                            <p className="info_title"> 🧴  CURRENT ROUTINE</p>
                            <p>{cap(skinProfile.routine).replace(/_/g," ")}</p>
                        </div>
                    }
                    {skinProfile.active_ingre.length > 0 && 
                        <div className="info_box">
                            <p className="info_title"> 🧪  ACTIVE INGREDIENTS</p>
                            <p>{skinProfile.active_ingre.map(item => cap(item)).join(", ")}</p>
                        </div>
                    }
                    {skinProfile.advanced_active_use && 
                        <div className="info_box">
                            <p className="info_title"> 📊  ACTIVE USER LEVEL</p>
                            <p>{cap(skinProfile.advanced_active_use)}</p>
                        </div>
                    } 
                    {skinProfile.no_products !== 0 &&
                        <div className="info_box">
                            <p className="info_title">  📦  ROUTINE PRODUCTS </p>
                            <p>{skinProfile.no_products}</p>
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
            
            <div className="product_page">
                <div className="info_left">
                    <div className="profile">
                        <h2 className="result_title">Here are your regimen results.</h2>
                        <p className="return_button" onClick={() => handlePage("home")}>Retake survey &#8594;</p>
                    </div>

                </div>

                <div className="customisation">
                    <div className="button_cont">
                        <button onClick={() => handleTime("am")}  className={`am_button ${time === "am" ? "active" : ""}`}>
                            {Icon.am}
                            <span>AM</span>
                        </button>
                        <button onClick={() => handleTime("pm")} className={`pm_button ${time === "pm" ? "active" : ""}`}>
                            {Icon.pm}
                            <span>PM </span>
                        </button>
                    </div>
                </div>

                <div className="price_list">
                    <button id="price" onClick={() => handleButton("all")} className={`all_price ${button === "all" ? "active" : ""}`}> All prices </button>
                    <button id="price" onClick={() => handleButton("low")} className={`low_price ${button === "low" ? "active" : ""}`}> Under $40</button>
                    <button id="price" onClick={() => handleButton("mid")} className={`mid_price ${button === "mid" ? "active" : ""}`}>$40 - $80</button>
                    <button id="price" onClick={() => handleButton("high")} className={`high_price ${button === "high" ? "active" : ""}`}>Over $80</button>
                </div>

                {Object.entries(product_list).map(([key, value]) =>
                {
                    {/* recommend products based on user's preferred number of products */}
                    if (skinProfile.no_products && skinProfile.no_products === 3)
                    {
                        if(key === "cleanser" || key === "moisturiser" || key === "sunscreen")
                            return (
                                <div key={key} className="product_cat">
                                    {button === "all" && (value.low.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 || value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 || value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 ) && <h2 className="category">{key === "oilcleanser"? "Oil Cleanser": key === "micellarwater"? "Micellar Water": cap(key)}</h2>}
                                    {button === "low" && (value.low.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0) && <h2 className="category">{key === "oilcleanser"? "Oil Cleanser": key === "micellarwater"? "Micellar Water": cap(key)}</h2>}
                                    {button === "mid" && (value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0) && <h2 className="category">{key === "oilcleanser"? "Oil Cleanser": key === "micellarwater"? "Micellar Water": cap(key)}</h2>}
                                    {button === "high" && (value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0) && <h2 className="category">{key === "oilcleanser"? "Oil Cleanser": key === "micellarwater"? "Micellar Water": cap(key)}</h2>}
            
                                    <div className="product_row">
                                        {(button === "all" || button === "low") && value.low.length > 0 && value.low.map(x => {
                                            if (x.product_time === time || x.product_time === "am_pm")
                                            {
                                                return(
                                                    <div key={x.product_name} className="product_display">
                                                        <p className="class_affordable">Affordable</p>
                                                        <p className="product_brand">{x.product_brand} </p>
                                                        <p className="product_name">{x.product_name} </p>
                                                        <p>{Icon[x.product_time]}</p>
                                                        <div className="img_container">
                                                            <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                                        </div>
                                                        <p className="product_price">${x.product_price}</p>
                                                        {x.skintypes && x.skintypes.length > 1 ? <p className="product_skintype">Skin type: {x.skintypes.map(x => cap(x)).join(", ")}</p> : <p className="product_skintype">Skin type: {x.skintypes.map(x=> cap(x))}</p>}
                                                        <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                                        <p className="product_des">{x.product_des}</p>
                                                        <a className="shop_button" href={x.product_link}>Shop now</a>
                                                    </div>)
                                            }
                                            return null;
                                        })}
                                        {button ==="all" && value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 && <p className="divider"></p>}
                                    </div>
            
                                    <div className="product_row">
                                        {(button === "all" || button === "mid") && value.mid.length > 0 && value.mid.map(x => {
                                            if (x.product_time === time || x.product_time === "am_pm")
                                            {
                                                return (
                                                    <div key={x.product_name} className="product_display"> 
                                                    <p className="class_mid">Mid-Range</p>
                                                    <p className="product_brand">{x.product_brand} </p>
                                                    <p className="product_name">{x.product_name} </p>
                                                    <p>{Icon[x.product_time]}</p>
                                                    <div className="img_container">
                                                        <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                                    </div>
                                                    <p className="product_price">${x.product_price}</p>
                                                    {x.skintypes && x.skintypes.length > 1 ? <p className="product_skintype">Skin type: {x.skintypes.map(x => cap(x)).join(", ")}</p> : <p className="product_skintype">Skin type: {x.skintypes.map(x=> cap(x))}</p>}
                                                    <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                                    <p className="product_des">{x.product_des}</p>
                                                    <a className="shop_button" href={x.product_link}>Shop now </a> 
                                                </div>)
                                            } 
                                            return null;
                                        })}
                                        {button ==="all" && value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0  && <p className="divider"></p>}
                                    </div>
            
                                    <div className="product_row">
                                        {(button === "all" || button === "high") && value.high.length > 0 && value.high.map(x => {
                                            if (x.product_time === time || x.product_time === "am_pm")
                                            {
                                                return (
                                                    <div key={x.product_name} className="product_display">
                                                        <p className="class_premium">Premium</p>
                                                        <p className="product_brand">{x.product_brand} </p>
                                                        <p className="product_name">{x.product_name} </p>
                                                        <p>{Icon[x.product_time]}</p>
                                                        <div className="img_container">
                                                            <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                                        </div>
                                                        <p className="product_price">${x.product_price}</p>
                                                        {x.skintypes && x.skintypes.length > 1 ? <p className="product_skintype">Skin type: {x.skintypes.map(x => cap(x)).join(", ")}</p> : <p className="product_skintype">Skin type: {x.skintypes.map(x=> cap(x))}</p>}
                                                        <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                                        <p className="product_des">{x.product_des}</p>
                                                        <a className="shop_button" href={x.product_link}> Shop now </a> 
                                                    </div>)
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            )
                    }

                    else if (skinProfile.no_products && skinProfile.no_products === 5)
                    {
                        if (key !== "toner")
                        {
                            return (
                                <div key={key} className="product_cat">
                                    {button === "all" && (value.low.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 || value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 || value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 ) && <h2 className="category">{cap(key)}</h2>}
                                    {button === "low" && (value.low.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0) && <h2 className="category">{cap(key)}</h2>}
                                    {button === "mid" && (value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0) && <h2 className="category">{cap(key)}</h2>}
                                    {button === "high" && (value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0) && <h2 className="category">{cap(key)}</h2>}
            
                                    <div className="product_row">
                                        {(button === "all" || button === "low") && value.low.length > 0 && value.low.map(x => {
                                            if (x.product_time === time || x.product_time === "am_pm")
                                            {
                                                return(
                                                    <div key={x.product_name} className="product_display">
                                                        <p className="class_affordable">Affordable</p>
                                                        <p className="product_brand">{x.product_brand} </p>
                                                        <p className="product_name">{x.product_name} </p>
                                                        <p>{Icon[x.product_time]}</p>
                                                        <div className="img_container">
                                                            <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                                        </div>
                                                        <p className="product_price">${x.product_price}</p>
                                                        {x.skintypes && x.skintypes.length > 1 ? <p className="product_skintype">Skin type: {x.skintypes.map(x => cap(x)).join(", ")}</p> : <p className="product_skintype">Skin type: {x.skintypes.map(x=> cap(x))}</p>}
                                                        <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                                        <p className="product_des">{x.product_des}</p>
                                                        <a className="shop_button" href={x.product_link}>Shop now</a>
                                                    </div>)
                                            }
                                            return null;
                                        })}
                                        {button ==="all" && value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 && <p className="divider"></p>}
                                    </div>
            
            
                                    <div className="product_row">
                                        {(button === "all" || button === "mid") && value.mid.length > 0 && value.mid.map(x => {
                                            if (x.product_time === time || x.product_time === "am_pm")
                                            {
                                                return (
                                                    <div key={x.product_name} className="product_display"> 
                                                    <p className="class_mid">Mid-Range</p>
                                                    <p className="product_brand">{x.product_brand} </p>
                                                    <p className="product_name">{x.product_name} </p>
                                                    <p>{Icon[x.product_time]}</p>
                                                    <div className="img_container">
                                                        <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                                    </div>
                                                    <p className="product_price">${x.product_price}</p>
                                                    {x.skintypes && x.skintypes.length > 1 ? <p className="product_skintype">Skin type: {x.skintypes.map(x => cap(x)).join(", ")}</p> : <p className="product_skintype">Skin type: {x.skintypes.map(x=> cap(x))}</p>}
                                                    <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                                    <p className="product_des">{x.product_des}</p>
                                                    <a className="shop_button" href={x.product_link}>Shop now </a> 
                                                </div>)
                                            } 
                                            return null;
                                        })}
                                        {button ==="all" && value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0  && <p className="divider"></p>}
                                    </div>
            
                                    <div className="product_row">
                                        {(button === "all" || button === "high") && value.high.length > 0 && value.high.map(x => {
                                            if (x.product_time === time || x.product_time === "am_pm")
                                            {
                                                return (
                                                    <div key={x.product_name} className="product_display">
                                                        <p className="class_premium">Premium</p>
                                                        <p className="product_brand">{x.product_brand} </p>
                                                        <p className="product_name">{x.product_name} </p>
                                                        <p>{Icon[x.product_time]}</p>
                                                        <div className="img_container">
                                                            <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                                        </div>
                                                        <p className="product_price">${x.product_price}</p>
                                                        {x.skintypes && x.skintypes.length > 1 ? <p className="product_skintype">Skin type: {x.skintypes.map(x => cap(x)).join(", ")}</p> : <p className="product_skintype">Skin type: {x.skintypes.map(x=> cap(x))}</p>}
                                                        <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                                        <p className="product_des">{x.product_des}</p>
                                                        <a className="shop_button" href={x.product_link}> Shop now </a> 
                                                    </div>)
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            )
                        }
                    }
                    else
                    {
                        return(
                            <div key={key} className="product_cat">
                                {button === "all" && (value.low.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 || value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 || value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 ) && <h2 className="category">{cap(key)}</h2>}
                                {button === "low" && (value.low.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0) && <h2 className="category">{cap(key)}</h2>}
                                {button === "mid" && (value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0) && <h2 className="category">{cap(key)}</h2>}
                                {button === "high" && (value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0) && <h2 className="category">{cap(key)}</h2>}

                                <div className="product_row">
                                    {(button === "all" || button === "low") && value.low.length > 0 && value.low.map(x => {
                                        if (x.product_time === time || x.product_time === "am_pm")
                                        {
                                            return(
                                                <div key={x.product_name} className="product_display">
                                                    <p className="class_affordable">Affordable</p>
                                                    <p className="product_brand">{x.product_brand} </p>
                                                    <p className="product_name">{x.product_name} </p>
                                                    <p>{Icon[x.product_time]}</p>
                                                    <div className="img_container">
                                                        <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                                    </div>
                                                    <p className="product_price">${x.product_price}</p>
                                                    {x.skintypes && x.skintypes.length > 1 ? <p className="product_skintype">Skin type: {x.skintypes.map(x => cap(x)).join(", ")}</p> : <p className="product_skintype">Skin type: {x.skintypes.map(x=> cap(x))}</p>}
                                                    <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                                    <p className="product_des">{x.product_des}</p>
                                                    <a className="shop_button" href={x.product_link}>Shop now</a>
                                                </div>)
                                        }
                                        return null;
                                    })}
                                    {button ==="all" && value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 && <p className="divider"></p>}
                                </div>

                                <div className="product_row">
                                    {(button === "all" || button === "mid") && value.mid.length > 0 && value.mid.map(x => {
                                        if (x.product_time === time || x.product_time === "am_pm")
                                        {
                                            return (
                                                <div key={x.product_name} className="product_display"> 
                                                <p className="class_mid">Mid-Range</p>
                                                <p className="product_brand">{x.product_brand} </p>
                                                <p className="product_name">{x.product_name} </p>
                                                <p>{Icon[x.product_time]}</p>
                                                <div className="img_container">
                                                    <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                                </div>
                                                <p className="product_price">${x.product_price}</p>
                                                {x.skintypes && x.skintypes.length > 1 ? <p className="product_skintype">Skin type: {x.skintypes.map(x => cap(x)).join(", ")}</p> : <p className="product_skintype">Skin type: {x.skintypes.map(x=> cap(x))}</p>}
                                                <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                                <p className="product_des">{x.product_des}</p>
                                                <a className="shop_button" href={x.product_link}>Shop now </a> 
                                            </div>)
                                        } 
                                        return null;
                                    })}
                                    {button ==="all" && value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0  && <p className="divider"></p>}
                                </div>

                                <div className="product_row">
                                    {(button === "all" || button === "high") && value.high.length > 0 && value.high.map(x => {
                                        if (x.product_time === time || x.product_time === "am_pm")
                                        {
                                            return (
                                                <div key={x.product_name} className="product_display">
                                                    <p className="class_premium">Premium</p>
                                                    <p className="product_brand">{x.product_brand} </p>
                                                    <p className="product_name">{x.product_name} </p>
                                                    <p>{Icon[x.product_time]}</p>
                                                    <div className="img_container">
                                                        <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                                    </div>
                                                    <p className="product_price">${x.product_price}</p>
                                                    {x.skintypes && x.skintypes.length > 1 ? <p className="product_skintype">Skin type: {x.skintypes.map(x => cap(x)).join(", ")}</p> : <p className="product_skintype">Skin type: {x.skintypes.map(x=> cap(x))}</p>}
                                                    <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                                    <p className="product_des">{x.product_des}</p>
                                                    <a className="shop_button" href={x.product_link}> Shop now </a> 
                                                </div>)
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
            <Chatbox/> 
    </>)
}
export default Profile;