import {useState} from "react";


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
        if (item.price < 40)    
            product_list.cleanser.low.push(item);
        else if (item.price >= 40 && item.price <= 80)
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
        if (item.price < 40)
            product_list.toner.low.push(item);
        else if (item.price >= 40 && item.price <= 80)
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
        if (item.price < 40)
            product_list.serum.low.push(item);
        else if (item.price >= 40 && item.price <= 80)
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
        if (item.price < 40)
            product_list.moisturiser.low.push(item);
        else if (item.price >= 40 && item.price <= 80)
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
        if (item.price < 40)
            product_list.eye.low.push(item);
        else if (item.price >= 40 && item.price <= 80)
        {
            product_list.eye.mid.push(item);
        }
        else 
        {
            product_list.eye.high.push(item); 
        }
    }

    for (const item of sunscreen)
    {
        if (item.price < 40)
            product_list.sunscreen.low.push(item);
        else if (item.price >= 40 && item.price <= 80)
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
        if (item.price < 40)
            product_list.oilcleanser.low.push(item);
        else if (item.price >= 40 && item.price <= 80)
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
        if (item.price < 40)
            product_list.micellarwater.low.push(item);
        else if (item.price >= 40 && item.price <= 80)
        {
            product_list.micellarwater.mid.push(item);
        }
        else 
        {
            product_list.micellarwater.high.push(item); 
        }
    }

    return (
        {Object.entries(product_list).map((key, value) => (
            <div key={key}>
                <h2>Cleanser</h2>
                {value.low && value.map(x => x (
                    <div>
                        <h2>Affordable</h2>
                        <p><span>x.brand</span> x.name</p>
                        <img src="x.product_img"/>
                        <a href="x.link">Find product here</a>
                    </div>


                ))}

            </div>

        ))}

    )
}

export default Productrec; 