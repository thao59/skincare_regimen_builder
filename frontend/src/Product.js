import {useState} from "react";
import "./Product.css"


function Productrec({cleanser, toner, serum, moisturiser, eye, sunscreen, oilcleanser, micellarwater, user_name, userConcern, handlePage})
{

    const product_list = {
        "cleanser": {"high": [], "mid": [], "low": []}, 
        "toner": {"high": [], "mid": [], "low": []}, 
        "serum": {"high": [], "mid": [], "low": []}, 
        "moisturiser": {"high": [], "mid": [], "low": []}, 
        "eye": {"high": [], "mid": [], "low": []}, 
        "sunscreen": {"high": [], "mid": [], "low": []}, 
        "oilcleanser": {"high": [], "mid": [], "low": []}, 
        "micellarwater": {"high": [], "mid": [], "low": []},
    }

    for (const item of cleanser)
    {
        if (item.product_price < 40) 
        {
            product_list.cleanser.low.push(item);
        }  
        else if (item.product_price >= 40 && item.product_price <= 80)
        {
            product_list.cleanser.mid.push(item);
        }
        else
        {
            product_list.cleanser.high.push(item); 
        }
    }

    for (const item of toner)
    {
        if (item.product_price < 40)
        {
            product_list.toner.low.push(item);
        } 
        else if (item.product_price >= 40 && item.product_price <= 80)
        {
            product_list.toner.mid.push(item);
        }
        else 
        {
            product_list.toner.high.push(item); 
        }
    }

    for (const item of serum)
    {
        if (item.product_price < 40)
        {
            product_list.serum.low.push(item);
        }
        else if (item.product_price >= 40 && item.product_price <= 80)
        {
            product_list.serum.mid.push(item);
        }
        else 
        {
            product_list.serum.high.push(item); 
        }
    }

    for (const item of moisturiser)
    {
        if (item.product_price < 40)
        {
            product_list.moisturiser.low.push(item);
        } 
        else if (item.product_price >= 40 && item.product_price <= 80)
        {
            product_list.moisturiser.mid.push(item);
        }
        else 
        {
            product_list.moisturiser.high.push(item); 
        }
    }

    for (const item of eye)
    {
        if (item.product_price < 40)
        {
            product_list.eye.low.push(item);
        }  
        else if (item.product_price >= 40 && item.product_price <= 80)
        {
            product_list.eye.mid.push(item);
        }
        else 
        {
            product_list.eye.high.push(item); 
        }
    }
    console.log(product_list.eye);

    for (const item of sunscreen)
    {
        if (item.product_price < 40)
        {
            product_list.sunscreen.low.push(item);
        }  
        else if (item.product_price >= 40 && item.product_price <= 80)
        {
            product_list.sunscreen.mid.push(item);
        }
        else 
        {
            product_list.sunscreen.high.push(item); 
        }
    }

    for (const item of oilcleanser)
    {
        if (item.product_price < 40)
        {
            product_list.oilcleanser.low.push(item);
        }   
        else if (item.product_price >= 40 && item.product_price <= 80)
        {
            product_list.oilcleanser.mid.push(item);
        }
        else 
        {
            product_list.oilcleanser.high.push(item); 
        }
    }

    for (const item of micellarwater)
    {
        if (item.product_price < 40)
        {
            product_list.micellarwater.low.push(item);
        }
        else if (item.product_price >= 40 && item.product_price <= 80)
        {
            product_list.micellarwater.mid.push(item);
        }
        else 
        {
            product_list.micellarwater.high.push(item); 
        }
    }

    //capitalise the first letter of key 
    const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const URL = "http://localhost:8000";
    console.log("skin concern: ", userConcern);

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



    return (
        <div className="product_page">
            <div className="info_left">
                <div className="profile">
                    <h2 className="result_title">Hi {user_name}, here are your regimen results.</h2>
                    <p className="concern_title">CONCERNS</p>
                    <ul>
                        {userConcern.map(x => (
                            <li className="list">{cap(x)}</li>
                        ))}
                    </ul>
                    <p className="return_button" onClick={() => handlePage("home")}>Retake survey &#8594;</p>
                </div>
                <img className="skincare_img" src="/images/2_39dcafaf-18fa-4aff-9292-918c7b5c22c6.webp" alt="skincare"/>
                
            </div>
            <p className="full_divider"></p>

            <div className="customisation">
                <h2 className="result_title">Customised for You.</h2>
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

            {Object.entries(product_list).map(([key, value]) =>
            (
                <div key={key} className="product_cat">
                    {(value.low.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 || value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0  > 0 || value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 ) && <h2 className="category">{cap(key)}</h2>}
                    {/* loop through each category(high,mid,low) and display */}
                    <div className="product_row">
                        {value.low.length > 0 && value.low.map(x => {
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
                                        <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                        <p className="product_des">{x.product_des}</p>
                                        <a className="shop_button" href={x.product_link}>Shop now</a>
                                    </div>)
                            }
                            return null;
                        })}
                        {value.mid.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0 && <p className="divider"></p>}
                    </div>


                    <div className="product_row">
                        {value.mid.length > 0 && value.mid.map(x => {
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
                                    <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                    <p className="product_des">{x.product_des}</p>
                                    <a className="shop_button" href={x.product_link}>Shop now </a> 
                                </div>)
                            }
                            return null;
                        })}
                        {value.high.filter(x => x.product_time === time || x.product_time === "am_pm").length > 0  && <p className="divider"></p>}
                    </div>

                    <div className="product_row">
                        {value.high.length > 0 && value.high.map(x => {
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
                                        <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                        <p className="product_des">{x.product_des}</p>
                                        <a className="shop_button" href={x.product_link}> Shop now </a> 
                                    </div>)
                             }
                             return null;
                            })}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Productrec; 