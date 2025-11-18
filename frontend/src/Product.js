import {useState} from "react";
import "./Product.css"


function Productrec({cleanser, toner, serum, moisturiser, eye, sunscreen, oilcleanser, micellarwater})
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

    return (
        <div className="product_page">
            {Object.entries(product_list).map(([key, value]) =>
            (
                <div key={key} className="product_cat">
                    {(value.low.length > 0 || value.mid.length > 0 || value.high.length > 0) && <h2 className="category">{cap(key)}</h2>}
                    {/* loop through each category(high,mid,low) and display */}
                    <div className="product_row">
                        {value.low.length > 0 && value.low.map(x => (
                            <div key={x.product_name} className="product_display">
                                <p className="class_affordable">Affordable</p>
                                <p className="product_brand">{x.product_brand} </p>
                                <p className="product_name">{x.product_name} </p>
                                <div className="img_container">
                                    <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                </div>
                                <p className="product_price">${x.product_price}</p>
                                <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                <p className="product_des">{x.product_des}</p>
                                <button className="shop_button"><a href={x.product_link}></a> Shop now</button>
                            </div>
                        ))}
                        {value.mid.length > 0 && <p className="divider"></p>}
                    </div>


                    <div className="product_row">
                        {value.mid.length > 0 && value.mid.map(x => (
                            <div key={x.product_name} className="product_display"> 
                                <p className="class_mid">Mid-Range</p>
                                <p className="product_brand">{x.product_brand} </p>
                                <p className="product_name">{x.product_name} </p>
                                <div className="img_container">
                                    <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                </div>
                                <p className="product_price">${x.product_price}</p>
                                <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                <p className="product_des">{x.product_des}</p>
                                <button className="shop_button"> <a href={x.product_link}></a> Shop now </button>
                            </div>
                        ))}
                        {value.high.length > 0 && <p className="divider"></p>}
                    </div>

                    <div className="product_row">
                        {value.high.length > 0 && value.high.map(x => (
                            <div key={x.product_name} className="product_display">
                                <p className="class_premium">Premium</p>
                                <p className="product_brand">{x.product_brand} </p>
                                <p className="product_name">{x.product_name} </p>
                                <div className="img_container">
                                    <img className="img_rec" src={`${URL}${x.product_img}`}/>
                                </div>
                                <p className="product_price">${x.product_price}</p>
                                <p className="product_target">Targeted concerns: {x.product_target.join(", ")}</p>
                                <p className="product_des">{x.product_des}</p>
                                <button className="shop_button"><a href={x.product_link}></a> Shop now</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Productrec; 