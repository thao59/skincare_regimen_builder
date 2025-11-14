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
        console.log(item);
        if (item.product_price < 40)    
            product_list.cleanser.low.push(item);
        else if (item.product_price >= 40 && item.price <= 80)
        {
            product_list.cleanser.mid.push(item);
        }
        else 
        {
            product_list.cleanser.high.push(item); 
        }
    }
    console.log(product_list.cleanser);

    for (const item of toner)
    {
        if (item.price < 40)
            product_list.toner.low.push(item);
        else if (item.product_price >= 40 && item.price <= 80)
        {
            product_list.toner.mid.push(item);
        }
        else 
        {
            product_list.toner.high.push(item); 
        }
    }
    console.log(product_list.toner);

    for (const item of serum)
    {
        if (item.product_price < 40)
            product_list.serum.low.push(item);
        else if (item.product_price >= 40 && item.price <= 80)
        {
            product_list.serum.mid.push(item);
        }
        else 
        {
            product_list.serum.high.push(item); 
        }
    }
    console.log(product_list.serum);

    for (const item of moisturiser)
    {
        if (item.product_price < 40)
            product_list.moisturiser.low.push(item);
        else if (item.product_price >= 40 && item.price <= 80)
        {
            product_list.moisturiser.mid.push(item);
        }
        else 
        {
            product_list.moisturiser.high.push(item); 
        }
    }
    console.log(product_list.moisturiser);

    for (const item of eye)
    {
        if (item.price < 40)
            product_list.eye.low.push(item);
        else if (item.product_price >= 40 && item.price <= 80)
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
    console.log(product_list.sunscreen);

    for (const item of oilcleanser)
    {
        if (item.product_price < 40)
            product_list.oilcleanser.low.push(item);
        else if (item.product_price >= 40 && item.price <= 80)
        {
            product_list.oilcleanser.mid.push(item);
        }
        else 
        {
            product_list.oilcleanser.high.push(item); 
        }
    }
    console.log(product_list.oilcleanser);

    for (const item of micellarwater)
    {
        if (item.product_price < 40)
            product_list.micellarwater.low.push(item);
        else if (item.product_price >= 40 && item.price <= 80)
        {
            product_list.micellarwater.mid.push(item);
        }
        else 
        {
            product_list.micellarwater.high.push(item); 
        }
    }
    console.log(product_list.micellarwater);

    return (
        <>
            {Object.entries(product_list).map(([key, value]) => (
                <div key={key}>
                    <h2>{key}</h2>
                    {/* loop through each category(high,mid,low) and display */}
                    {value.low && value.low.map(x => (
                        <div key={x.name}>
                            <h2>Affordable</h2>
                            <p><span>{x.product_brand}</span>{x.product_name}</p>
                            <img src={x.product_img}/>
                            <a href={x.product_link}>Find product here</a>
                        </div>
                    ))}
                    {value.mid && value.mid.map(x => (
                        <div key={x.product_name}> 
                            <h2>Mid-end</h2>
                            <p><span>{x.product_brand}</span> {x.product_name}</p>
                            <img src={x.product_img}/>
                            <a href={x.product_link}>Find product here</a>
                        </div>
                    ))}


                </div>
            ))}
        </>
    )
}

export default Productrec; 