import {useState} from "react";
import "./Product.css"
import Chatbox from "./Chatbox";


function Productrec({product_list, skinProfile, handlePage})
{
    console.log(product_list.cleanser);
    console.log(product_list.toner);
    console.log(product_list.serum);
    console.log(product_list.moisturiser);
    console.log(product_list.eye);
    console.log(product_list.sunscreen);
    console.log(product_list.oilcleanser);
    console.log(product_list.micellarwater);
    console.log(skinProfile);

    //capitalise the first letter of key 
    const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const URL = "http://localhost:8000";

    //when am/pm button is clicked, displayed products marked as am/pm
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

    const [msgbox, setMsgbox] = useState(false); 
    const handleMsg = () => {
        setMsgbox(true);
    }

    return (
        <div className="product_page">
            <div className="info_left">
                <div className="profile">
                    <h2 className="result_title">Hi {cap(skinProfile.username)}, here are your regimen results.</h2>
                    <p className="skin_title">SKIN TYPE: <span className="skintype">{cap(skinProfile.skintype)}</span></p>
                    <p className="concern_title">CONCERNS</p>
                    <ul>
                        {skinProfile.skin_concern.map(x => (
                            <li className="list">{cap(x)}</li>
                        ))}
                    </ul> 
                    {skinProfile.eye_concern && skinProfile.eye_concern.length === 1 ? <p className="concern_title">EYE CONCERNS: <span className="skintype">{cap(skinProfile.eye_concern[0])}</span></p> : <p className="concern_title">EYE CONCERNS: <span className="skintype">{skinProfile.eye_concern.map(x => cap(x)).join(", ")}</span></p>}
                    <p className="return_button" onClick={() => handlePage("home")}>Retake survey &#8594;</p>
                </div>
                <img className="skincare_img" src="/images/2_39dcafaf-18fa-4aff-9292-918c7b5c22c6.webp" alt="skincare"/>
                
            </div>
            <p className="full_divider"></p>

            <div className="customisation">
                <h2 className="result_title">Customised for You.</h2>
                <p className="disclaimer">⚠️ Note: Some active ingredients (like retinol, AHAs, BHAs) are photosensitising and should only be used at night, or with SPF during the day. Always patch test new products and consult with a dermatologist if unsure.</p>
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
                    return null;
                }

                else if (skinProfile.no_products && skinProfile.no_products === 5)
                {
                    if (key !== "toner" && key !== "eye")
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
            <Chatbox/>
        </div>
    )
}

export default Productrec; 