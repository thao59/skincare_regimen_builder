import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import Profile from "./Profile";
import Productrec from "./Product";

function App() {
  //track stages (next) 
  const[stage, setStage] = useState(0);

  //once button is clicked change to the next page. Set default as 1 (if no arg passed, auto increase by 1. If 0 is passed as an arg set page to 0)
  const changeStage = (count = 1) => {
    if (count === 1)
    {
      setStage(prev => prev + count);
    }
    else 
    {
      setStage(count);
    }
  }

  //allow user to go back to previous page
  const changePreviousStage = (count = 1) => {
    if (count === 1)
    {
      setStage(prev => prev - count);
    }

    else 
    {
      setStage(count);
    }
  }

  const[image, setImage] = useState(null);
  const[page, setPage] = useState("home");
  const[userData, setUserData] = useState({name: "", age: 0, skin_type: "", skin_concern: [], eye_concern: [], pregnant: null, products_type: [], routine: "", active_use: null, activeIngre: [], advanced_user: "", no_products: 0});
  const [product_list, setProduct_list] = useState({
    "cleanser": {"high": [], "mid": [], "low": []}, 
    "toner": {"high": [], "mid": [], "low": []}, 
    "serum": {"high": [], "mid": [], "low": []}, 
    "moisturiser": {"high": [], "mid": [], "low": []}, 
    "eye": {"high": [], "mid": [], "low": []}, 
    "sunscreen": {"high": [], "mid": [], "low": []}, 
    "oilcleanser": {"high": [], "mid": [], "low": []}, 
    "micellarwater": {"high": [], "mid": [], "low": []},
  });

  console.log(product_list);

  const resetUserData = () => {
    setUserData({name: "", age: 0, skin_type: "", skin_concern: [], eye_concern: [], pregnant: null, products_type: [], routine: "", active_use: null, activeIngre: [], advanced_user: "", no_products: 0});
  }  

  const handlePage = async(site) => {
      if (site === "login" || site === "signup" || site === "home" ||site ==="profile")
      {
        if (site !== "profile")
        {
          setPage(site); 
        }
        changeStage(0);
        resetUserData();
        setImage(null);
        setProduct_list({
        cleanser: {high: [], mid: [], low: []}, 
        toner: {high: [], mid: [], low: []}, 
        serum: {high: [], mid: [], low: []}, 
        moisturiser: {high: [], mid: [], low: []}, 
        eye: {high: [], mid: [], low: []}, 
        sunscreen: {high: [], mid: [], low: []}, 
        oilcleanser: {high: [], mid: [], low: []}, 
        micellarwater: {high: [], mid: [], low: []},
      });

        if (site === "profile")
        {
          await get_data();
        }
      }
  }

  const handleName = (userName) => {
    if(userName)
    {
      setUserData(prev => ({...prev, name: userName}));
    }
    else 
    {
      setUserData(prev => ({...prev, name: ""}));
    }
  }

  const handleSkinType = (type) => {
      setUserData(prev => ({...prev, skin_type: type})); 
  }

  const handleConcern = (concern) =>  {
    //Remove concern if already selected (toggle)
    if (userData.skin_concern.includes(concern))
    { 
      setUserData( prev => ({...prev, skin_concern: prev.skin_concern.filter(type => type !== concern)}));
    }
    else 
    {
      setUserData(prev => ({...prev, skin_concern: [...prev.skin_concern, concern]}));
    }
  } 

  const handleEyeConcern = (eyeConcern) => {
    if(!eyeConcern)
      return;
    else 
    {
      if (userData.eye_concern.includes(eyeConcern))
        {
          setUserData(prev => ({...prev, eye_concern: prev.eye_concern.filter(x => x !== eyeConcern)}));
        }
      else
        {
          setUserData(prev => ({...prev, eye_concern: [...prev.eye_concern, eyeConcern]}));
        }
    }
  }

  const handlePregnant = (bool) => {
    if (bool === "no")
    {
      setUserData(prev => ({...prev, pregnant: false}));
        
    }
    else 
    {
      setUserData(prev => ({...prev, pregnant: true})); 
    }
  } 

  const handleProductsType = (product) => {
    if (userData.products_type.includes(product))
      {
        setUserData(prev => ({...prev, products_type: prev.products_type.filter(x => x !== product)})); 
      }
    else 
      {
        //if "I don't have a routine" is checked, uncheck it first before handling the array
        if(userData.routine === "no_routine")
        {
          setUserData(prev => ({...prev, products_type: [...prev.products_type, product], routine: ""}));
        }
        else 
        {
          setUserData(prev => ({...prev, products_type: [...prev.products_type, product]}));
        }
      }
  }

  const handleHavingRoutine = (statement) => {
    if(statement)
      {
        //clear field (uncheck the button on second click)
        if(userData.routine === statement)
        {
          setUserData(prev => ({...prev, routine: ""}));
        }

        else
        {
          //clear products_type array before checking "I dont have a routine" option
          //set active_use to null in case user goes to q8 and go back to 7 to check "I dont have a routine" which will cause two back arrows on p12
          if(userData.products_type.length > 0)
            {
              setUserData(prev => ({...prev, products_type: [], routine: statement, active_use: null}));
            }
          else 
          {
            setUserData(prev => ({...prev, routine: statement, active_use: null}));
          }
        }
      }
  }
  
  //save user's answer whether they use actives 
  const handleActive = (bool) => {
    if (bool === "no")
    {
      setUserData(prev => ({...prev, active_use: false})); 
    }
    else 
    {
      setUserData(prev => ({...prev, active_use: true})); 
    }
  }

  const handleActiveUsage = (ingre) => {
    if (userData.activeIngre.includes(ingre)) 
    {
      setUserData(prev => ({...prev, activeIngre: prev.activeIngre.filter(x => x !== ingre)}));
    }
    else 
    {
      setUserData(prev => ({...prev, activeIngre: [...prev.activeIngre, ingre]})); 
    }
  }

  const handleAge = (userAge) => {
      //filter out age 18 and above 
      setUserData(prev => ({...prev, age: userAge}));
  }

  const handleAdvancedUser = (statement) => {
    setUserData(prev => ({...prev, advanced_user: statement})); 
  }

  const handleNoProducts = (no) => {
    setUserData(prev => ({...prev, no_products: no})); 
  }

  //delete all saved info, set page to 0, navigate back to home page after logging out
  const handleLogout = () => {
    changeStage(0);
    localStorage.removeItem("refresh");
    localStorage.removeItem("access"); 
    handlePage("home");
    resetUserData();
  }

  const[imageArray, setImageArray] = useState(null);
  const[skinProfile, setSkinProfile] = useState(null);
  const image_group ={};

  const copyList = {...product_list};
  let cleanser_cat;
  let toner_cat;
  let serum_cat;
  let moist_cat;
  let sunscreen_cat;
  let eye_cat;
  let micellarwater_cat;
  let cleansingoil_cat;

  const token = localStorage.getItem("access");

  //fetch user data to Django 
  const sendData = async() => {
    if (userData.no_products !== 0)
    {
      const option_headers = {
        method : "POST", 
        credentials: "include",
        headers : {"Content-Type": "application/json",},
        body: JSON.stringify(userData),
      };

      //if user is logged in, send data with token
      if(token)
      {
        option_headers.headers.Authorization = `Bearer ${token}`; 
      }
      const response = await fetch("http://localhost:8000/processdata/", option_headers); 

      const data = await response.json(); 
      if (response.ok)
      {
        console.log(response.status) 
        
        //process data if user is logged in
        if (token)
        {       
          //group and save products according to types 
          cleanser_cat = data.product_recs.filter(x => x.product.product_cat === "cleanser").map(x => x.product);
          toner_cat = data.product_recs.filter(x=> x.product.product_cat === "toner").map(x => x.product);
          serum_cat = data.product_recs.filter(x=> x.product.product_cat === "serum").map(x => x.product);
          moist_cat = data.product_recs.filter(x=> x.product.product_cat === "moisturiser").map(x => x.product);

          if (data.user_skin_profile.skin_concern.includes("acne") || data.user_skin_profile.skin_concern.includes("sensitive") )
          {
            sunscreen_cat = data.product_recs.filter(x=> x.product.product_cat === "physical sunscreen").map(x => x.product);
          }

          else 
          {
            sunscreen_cat = data.product_recs.filter(x=> x.product.product_cat === "chemical sunscreen").map(x => x.product);
          }

          eye_cat = data.product_recs.filter(x=> x.product.product_cat === "eye").map(x => x.product);
          micellarwater_cat = data.product_recs.filter(x=> x.product.product_cat === "micellar water").map(x => x.product);
          cleansingoil_cat = data.product_recs.filter(x=> x.product.product_cat === "oil cleanser").map(x => x.product);
        
          setSkinProfile(data.user_skin_profile);
        }

        //process data if user is not logged in
        else
        {
          if(data.product_recs.off_cleanser)
          {
            cleanser_cat = data.product_recs.off_cleanser;
          }
        
          if(data.product_recs.off_toner)
          {
            toner_cat = data.product_recs.off_toner;
          }
            
          if(data.product_recs.off_serum)
          {
            serum_cat = data.product_recs.off_serum;
          }
          
          if(data.product_recs.off_moisturiser)
          {
            moist_cat = data.product_recs.off_moisturiser;
          }
            
          if(data.product_recs.off_sunscreen)
          {
            sunscreen_cat = data.product_recs.off_sunscreen;
          }

          if(data.product_recs.off_eye)
          {
            eye_cat = data.product_recs.off_eye;
          }

          if(data.product_recs.off_micellar_water)
          {
            micellarwater_cat = data.product_recs.off_micellar_water;
          }
          
          if(data.product_recs.off_oil_cleanser)
          {
            cleansingoil_cat = data.product_recs.off_oil_cleanser;
          }
          setSkinProfile(data.user_skin_profile);
        }
        
        //categorise producr based on prices 
        for (const item of cleanser_cat)
          {
            if (item.product_price < 40) 
            {
              copyList.cleanser.low.push(item);
            }  
            else if (item.product_price >= 40 && item.product_price <= 80)
            {
              copyList.cleanser.mid.push(item);
            }
            else
            {
              copyList.cleanser.high.push(item); 
            }
          }

          for (const item of toner_cat)
          {
            if (item.product_price < 40)
            {
              copyList.toner.low.push(item);
            } 
            else if (item.product_price >= 40 && item.product_price <= 80)
            {
              copyList.toner.mid.push(item);
            }
            else 
            {
              copyList.toner.high.push(item); 
            }
          }

          for (const item of serum_cat)
          {
            if (item.product_price < 40)
            {
              copyList.serum.low.push(item);
            }
            else if (item.product_price >= 40 && item.product_price <= 80)
            {
              copyList.serum.mid.push(item);
            }
            else 
            {
              copyList.serum.high.push(item); 
            }
          }

          for (const item of moist_cat)
          {
            if (item.product_price < 40)
            {
              copyList.moisturiser.low.push(item);
            } 
            else if (item.product_price >= 40 && item.product_price <= 80)
            {
              copyList.moisturiser.mid.push(item);
            }
            else 
            {
              copyList.moisturiser.high.push(item); 
            }
          }

          for (const item of eye_cat)
          {
            if (item.product_price < 40)
            {
              copyList.eye.low.push(item);
            }  
            else if (item.product_price >= 40 && item.product_price <= 80)
            {
              copyList.eye.mid.push(item);
            }
            else 
            {
              copyList.eye.high.push(item); 
            }
          }

          for (const item of sunscreen_cat)
          {
            if (item.product_price < 40)
            {
              copyList.sunscreen.low.push(item);
            }  
            else if (item.product_price >= 40 && item.product_price <= 80)
            {
              copyList.sunscreen.mid.push(item);
            }
            else 
            {
              copyList.sunscreen.high.push(item); 
            }
          }

          if (cleansingoil_cat)
          {
            for (const item of cleansingoil_cat)
            {
              if (item.product_price < 40)
              {
                copyList.oilcleanser.low.push(item);
              }   
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                copyList.oilcleanser.mid.push(item);
              }
              else 
              {
                copyList.oilcleanser.high.push(item); 
              }
            }
          }

          if (micellarwater_cat)
          {
            for (const item of micellarwater_cat)
            {
              if (item.product_price < 40)
              {
                  copyList.micellarwater.low.push(item);
              }
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                  copyList.micellarwater.mid.push(item);
              }
              else 
              {
                  copyList.micellarwater.high.push(item); 
              }
            }
          }
        setProduct_list(copyList);
        changeStage(13);
      }

      else
      {
        console.log("Error: ", response.status);
      }
    }
  }

  const[imageFile, setImageFile] = useState(null);

  //function to read uploaded img 
  const handleImage = (file) => {
    
    //limit img file < 5MB
    if (file.size > 5 * 1024 * 1024)
    {
      alert("File exceeds limit input!");
    }
    const reader = new FileReader(); 

    reader.onloadend = () => {
      setImage(reader.result);
    }
    reader.onerror = () => 
    {
      console.log(reader.error); 
    }

    //save img file before it being converted to base 64 string 
    setImageFile(file);
    reader.readAsDataURL(file); 
  }

  //function to fetch image to backend 
  const handleSendImage = async() => {
    const file_form = new FormData();
    file_form.append("image_file", imageFile);

    const object_header = {
      method: "POST", 
      body: file_form 
    }

    //if user is logged in, send token along with data
    if (token)
    {
      object_header.headers = {"Authorization": `Bearer ${token}`};
    }

    const response = await fetch("http://localhost:8000/processdata/", object_header)

    const data = await response.json(); 
    if (response.ok)
    {
      console.log("Status: ", data.message); 
      //send user's survey to backend if image has processed successfully 
      await sendData(); 
    }
    else 
    {
      console.log("Error: ", response.status);
    }
  }
  
  const[profileName, setProfileName] = useState("");

  //fetch imgs from backend 
  const get_data = async () => {
      const response = await fetch("http://localhost:8000/getImage", {
          headers: {"Authorization" : `Bearer ${localStorage.getItem("access")}`}, 
      });
        const freshList = {
          cleanser: {high: [], mid: [], low: []}, 
          toner: {high: [], mid: [], low: []}, 
          serum: {high: [], mid: [], low: []}, 
          moisturiser: {high: [], mid: [], low: []}, 
          eye: {high: [], mid: [], low: []}, 
          sunscreen: {high: [], mid: [], low: []}, 
          oilcleanser: {high: [], mid: [], low: []}, 
          micellarwater: {high: [], mid: [], low: []},
      };



      const data = await response.json(); 
      if (response.ok)
      {
        console.log(response.status); 

        if (data.skininfo)
        {
          setSkinProfile(data.skininfo);
        }

        if (data.name)
        {
          setProfileName(data.name);

        }
        
        //if image, loops through image array and group them according to date 
        if (data.image?.length > 0)
        {
          for (const i of data.image)
            {
              let date = new Date(i.datetime).toLocaleDateString();
              if (image_group[date])
              {
                //.push adding items to array
                image_group[date].push(i);
              }
              else 
              {
                image_group[date] = [i];
              }
            }
          setImageArray(image_group);
        }

        if (data.product_recs)
        {
          cleanser_cat = data.product_recs.filter(x => x.product.product_cat === "cleanser").map(x => x.product);
          toner_cat = data.product_recs.filter(x=> x.product.product_cat === "toner").map(x => x.product);
          serum_cat = data.product_recs.filter(x=> x.product.product_cat === "serum").map(x => x.product);
          moist_cat = data.product_recs.filter(x=> x.product.product_cat === "moisturiser").map(x => x.product);
          
          if (data.skininfo.skin_concern.includes("acne") || (data.skininfo.skin_concern.includes("sensitive")))
          {
            sunscreen_cat = data.product_recs.filter(x=> x.product.product_cat === "physical sunscreen").map(x => x.product);
          }
          else 
          {
            sunscreen_cat = data.product_recs.filter(x=> x.product.product_cat === "chemical sunscreen").map(x => x.product);
          }

          eye_cat = data.product_recs.filter(x=> x.product.product_cat === "eye").map(x => x.product);
          micellarwater_cat = data.product_recs.filter(x=> x.product.product_cat === "micellar water").map(x => x.product);
          cleansingoil_cat = data.product_recs.filter(x=> x.product.product_cat === "oil cleanser").map(x => x.product);

          for (const item of cleanser_cat)
            {
              if (item.product_price < 40) 
              {
                freshList.cleanser.low.push(item);
              }  
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                freshList.cleanser.mid.push(item);
              }
              else
              {
                freshList.cleanser.high.push(item); 
              }
            }
        
            for (const item of toner_cat)
            {
              if (item.product_price < 40)
              {
                freshList.toner.low.push(item);
              } 
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                freshList.toner.mid.push(item);
              }
              else 
              {
                freshList.toner.high.push(item); 
              }
            }
        
            for (const item of serum_cat)
            {
              if (item.product_price < 40)
              {
                freshList.serum.low.push(item);
              }
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                freshList.serum.mid.push(item);
              }
              else 
              {
                freshList.serum.high.push(item); 
              }
            }
        
            for (const item of moist_cat)
            {
              if (item.product_price < 40)
              {
                freshList.moisturiser.low.push(item);
              } 
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                freshList.moisturiser.mid.push(item);
              }
              else 
              {
                freshList.moisturiser.high.push(item); 
              }
            }
        
            for (const item of eye_cat)
            {
              if (item.product_price < 40)
              {
                freshList.eye.low.push(item);
              }  
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                freshList.eye.mid.push(item);
              }
              else 
              {
                freshList.eye.high.push(item); 
              }
            }
        
            for (const item of sunscreen_cat)
            {
              if (item.product_price < 40)
              {
                freshList.sunscreen.low.push(item);
              }  
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                freshList.sunscreen.mid.push(item);
              }
              else 
              {
                freshList.sunscreen.high.push(item); 
              }
            }
        
            for (const item of cleansingoil_cat)
            {
              if (item.product_price < 40)
              {
                freshList.oilcleanser.low.push(item);
              }   
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                freshList.oilcleanser.mid.push(item);
              }
              else 
              {
                freshList.oilcleanser.high.push(item); 
              }
            }
        
            for (const item of micellarwater_cat)
            {
              if (item.product_price < 40)
              {
                freshList.micellarwater.low.push(item);
              }
              else if (item.product_price >= 40 && item.product_price <= 80)
              {
                freshList.micellarwater.mid.push(item);
              }
              else 
              {
                freshList.micellarwater.high.push(item); 
              }
            }
          setProduct_list(freshList);
        }
        setPage("profile");
      }
      else 
      {
        console.log("Error: ", response.status);
      }
    }

  return (
    <div className="App">
        <Navbar onPageChange={handlePage} resetStage={changeStage} handleLogout={handleLogout}/>
        {page === "login" && <Login resetSite={handlePage}/>}
        {page === "signup" && <Signup resetSite={handlePage}/>}
        {page === "home" && stage === 0 && <Home buttonSubmit={changeStage} resetSite={handlePage} />}
        {page === "profile" && <Profile imageArray={imageArray} skinProfile={skinProfile} product_list={product_list} handlePage={handlePage} profileName={profileName}/>}
        {stage === 1 && (
          <div className="labels_container">
            <h1 className="title"> My Skincare Routine Tracker</h1>
            <p> Track your skincare journey and get personalised recommendations!</p>
            <div className="content_container">
              <h2 className="question">What's your name?</h2>
              <input className="input_field" type="text" onChange={(field) => handleName(field.target.value)} value={userData.name} placeholder="Enter your name"/>
              {!userData.name? <button className="button_next disabled" disabled>&#8594;</button>: <button className="button_next" onClick ={() => changeStage()}>&#8594;</button>}
            </div>
          </div>
        )}
        {stage === 2 && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question">How old are you?</h2>
              <input className="input_field" type="text" onChange={(field) => handleAge(field.target.value)} value={userData.age > 0 ? userData.age : ""}/>
              <div className="button_container">
                <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                {userData.age < 12 || userData.age > 100 || isNaN(userData.age)? <button className="button_next disabled" disabled>&#8594;</button> : <button className="button_next" onClick ={() => changeStage()}>&#8594;</button>}
              </div>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question">What is your skin type?</h2>
              <p className="note">Select the answer that fits you best.</p>
              <label><input type="radio" name="skin_type" onChange={() => handleSkinType("oily")} checked={userData.skin_type === "oily"}/> Oily</label>
              <label><input type="radio" name="skin_type" onChange={() => handleSkinType("dry")} checked={userData.skin_type === "dry"}/> Dry</label>
              <label><input type="radio" name="skin_type" onChange={() => handleSkinType("balanced")} checked={userData.skin_type === "balanced"}/> Balanced</label>
              <label><input type="radio" name="skin_type" onChange={() => handleSkinType("combination")} checked={userData.skin_type === "combination"}/> Combination</label>
              <label><input type="radio" name="skin_type" onChange={() => handleSkinType("sensitive")} checked={userData.skin_type === "sensitive"}/> Sensitive</label>
              <div className="button_container">
                <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                {!userData.skin_type? <button className="button_next disabled" disabled>&#8594;</button> : <button className="button_next" onClick ={() => changeStage()}>&#8594;</button>}
              </div>
            </div> 
          </div>
        )}
        
        {stage === 4 && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question"> Identify your top 4 concerns </h2>
              <label><input type="checkbox" onChange={() => handleConcern("acne")} checked={userData.skin_concern.includes("acne")}/> Acne</label>
              <label><input type="checkbox" onChange={() => handleConcern("congestion")} checked={userData.skin_concern.includes("congestion")}/> Congestion</label>
              <label><input type="checkbox" onChange={() => handleConcern("aging")} checked={userData.skin_concern.includes("aging")}/> Aging</label>
              <label><input type="checkbox" onChange={() => handleConcern("pigmentation")} checked={userData.skin_concern.includes("pigmentation")}/> Dark spots/Hyperpigmentation</label>
              <label><input type="checkbox" onChange={() => handleConcern("dehydrated")} checked={userData.skin_concern.includes("dehydrated")}/> Dehydrated</label>
              <label><input type="checkbox" onChange={() => handleConcern("dryness")} checked={userData.skin_concern.includes("dryness")}/> Dry</label>
              <label><input type="checkbox" onChange={() => handleConcern("pores")} checked={userData.skin_concern.includes("pores")}/> Large pores </label> 
              <label><input type="checkbox" onChange={() => handleConcern("sensitive")} checked={userData.skin_concern.includes("sensitive")}/> Sensitive</label>
              <label><input type="checkbox" onChange={() => handleConcern("redness")} checked={userData.skin_concern.includes("redness")}/> Redness</label>
              <label><input type="checkbox" onChange={() => handleConcern("dullness")} checked={userData.skin_concern.includes("dullness")}/> Dullness</label>
              <label><input type="checkbox" onChange={() => handleConcern("texture")} checked={userData.skin_concern.includes("texture")}/> Uneven texture</label>
              <div className="button_container">
                <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                {userData.skin_concern.length < 1? <button className="button_next disabled" disabled>&#8594;</button> : <button className="button_next" onClick ={() => changeStage()}>&#8594;</button>}
              </div>
            </div>  
        </div>
        )}

        {stage === 5 && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question">Do you have any eye area concerns?</h2>
              <p className="note">Select all that apply</p>
              <label><input type="checkbox" onChange={()=> handleEyeConcern("wrinkles")} checked={userData.eye_concern.includes("wrinkles")}/> Fine Lines and Wrinkles</label>
              <label><input type="checkbox" onChange={()=> handleEyeConcern("dark circles")}  checked={userData.eye_concern.includes("dark circles")}/> Dark Circles</label>
              <label><input type="checkbox" onChange={()=> handleEyeConcern("puffiness")}  checked={userData.eye_concern.includes("puffiness")}/> Puffiness</label>
              <label><input type="checkbox" onChange={()=> handleEyeConcern("dryness")}  checked={userData.eye_concern.includes("dryness")}/> Dryness</label>
              <div className="button_container">
                <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                {userData.skin_concern.length < 1? <button className="button_next disabled" disabled>&#8594;</button>:<button className="button_next" onClick ={() => changeStage()}>&#8594;</button>}
              </div>
            </div>
          </div>
        )}

        {stage === 6 && (
            <div className="labels_container">
              <div className="content_container">
                <h2 className="question">Are you currently pregnant, breastfeeding, planning on getting pregnant or post-partum?</h2>
                <label><input type="radio" name="pregnant" onChange={()=> handlePregnant("yes")} checked={userData.pregnant === true}/> Yes</label>
                <label><input type="radio" name="pregnant" onChange={()=> handlePregnant("no")} checked={userData.pregnant === false} /> No</label>
                <div className="button_container">
                  <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                  {userData.pregnant === null? <button className="button_next disabled" disabled>&#8594;</button>: <button className="button_next" onClick={() => changeStage()}>&#8594;</button>}
                </div>
              </div>
          </div>
        )}
                
        {stage === 7 && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question"> Which products are you currently using in your routine? </h2>
              <p className="note">Select all that apply.</p>
                <label><input type="checkbox" onChange={() => handleProductsType("cleanser")} checked={userData.products_type.includes("cleanser")}/> Cleanser</label>
                <label><input type="checkbox" onChange={() => handleProductsType("exfoliator")} checked={userData.products_type.includes("exfoliator")}/> Exfoliator</label>
                <label><input type="checkbox" onChange={() => handleProductsType("toner")} checked={userData.products_type.includes("toner")}/> Toner</label>
                <label><input type="checkbox" onChange={() => handleProductsType("serum")} checked={userData.products_type.includes("serum")}/> Serum</label>
                <label><input type="checkbox" onChange={() => handleProductsType("moisturiser")} checked={userData.products_type.includes("moisturiser")}/> Moisturiser</label>
                <label><input type="checkbox"  onChange={() => handleHavingRoutine("no_routine")} checked={userData.routine === "no_routine"} /> I don't have a skincare routine</label>
                <div className="button_container">
                  <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                  <button className={`button_next ${userData.products_type.length < 1 && userData.routine === ""? "disabled": ""}`} disabled={userData.products_type.length < 1 && userData.routine === ""} onClick={() => userData.routine === "no_routine"? changeStage(11): changeStage()}>&#8594;</button>
                </div>
            </div>        
          </div>
        )}

        {stage === 8 && userData.products_type.length > 0 && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question"> Are you using actives in your skincare routine? </h2>
              <label><input type="radio" name="active" onChange={() => handleActive("yes")} checked={userData.active_use === true}/> Yes</label>
              <label><input type="radio" name="active" onChange={() => handleActive("no")} checked={userData.active_use === false}/> No</label>
              <div className="button_container">
                <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                <button className={`button_next ${userData.active_use === null? "disabled": ""}`} disabled={userData.active_use === null} onClick={() => userData.active_use === false? changeStage(11): changeStage()}>&#8594;</button>
              </div>
            </div>
          </div>
        )}

        { stage === 9 && userData.active_use === true && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question"> What actives are in your routine? </h2>
              <label><input type="checkbox" onChange={() => handleActiveUsage("vitaminC")} checked={userData.activeIngre.includes("vitaminC")}/> Vitamin C</label>
              <label><input type="checkbox" onChange={() => handleActiveUsage("niacinamide")} checked={userData.activeIngre.includes("niacinamide")}/> Niacinamide</label>
              <label><input type="checkbox" onChange={() => handleActiveUsage("bha")} checked={userData.activeIngre.includes("bha")}/> BHA</label>
              <label><input type="checkbox" onChange={() => handleActiveUsage("aha")} checked={userData.activeIngre.includes("aha")}/> AHA</label>
              <label><input type="checkbox" onChange={() => handleActiveUsage("pha")} checked={userData.activeIngre.includes("pha")}/> PHA</label>
              <label><input type="checkbox" onChange={() => handleActiveUsage("retinol")} checked={userData.activeIngre.includes("retinol")}/> Retinol</label>
              <label><input type="checkbox" onChange={() => handleActiveUsage("tretinoin")} checked={userData.activeIngre.includes("tretinoin")}/> Tretinoin </label>
              <label><input type="checkbox" onChange={() => handleActiveUsage("azelaicAcid")} checked={userData.activeIngre.includes("azelaicAcid")}/> Azelaic Acid</label>
              <label><input type="checkbox" onChange={() => handleActiveUsage("benzoylPeroxide")} checked={userData.activeIngre.includes("benzoylPeroxide")}/> Benzoyl Peroxide</label>
              <div className="button_container">
                <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                {userData.activeIngre.length < 1? <button className="button_next disabled">&#8594;</button> :<button className="button_next" onClick={() => changeStage()}>&#8594;</button>}
              </div>
            </div>
          </div>
        )}

        {stage === 10 && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question"> Are you an experienced user of acids, retinoids and vitamin C?</h2>
              <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("beginner")} checked={userData.advanced_user === "beginner"}/> Beginner </label>
              <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("intermediate")} checked={userData.advanced_user === "intermediate"}/> Intermediate</label>
              <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("advanced")} checked={userData.advanced_user === "advanced"}/> Advanced </label>
              <div className="button_container">
                <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                {userData.advanced_user === ""? <button className="button_next disabled">&#8594;</button>: <button className="button_next" onClick={() => changeStage()}>&#8594;</button>}
              </div>
            </div>
          </div>
        )}

        {stage === 11 && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question"> How many products do you prefer to have in your regimen?</h2>
              <label><input type="radio" name="no_products" onChange={() => handleNoProducts(3)} checked={userData.no_products === 3}/> Simple (3 products) </label>
              <label><input type="radio" name="no_products" onChange={() => handleNoProducts(5)} checked={userData.no_products === 5}/> Essentials (4-5 products)</label>
              <label><input type="radio" name="no_products" onChange={() => handleNoProducts(6)} checked={userData.no_products === 6}/> Advanced (6+ products) </label>
              <div className="button_container">
                <button className="button_previous" onClick={() => {
                  if(userData.advanced_user !== "")
                    changePreviousStage()
                  else if (userData.routine === "no_routine")
                    changePreviousStage(7)
                  else if (userData.active_use === false)
                    changePreviousStage(8)  
                }}>&#8592;</button>
                  

                <button className={`button_next ${userData.no_products === 0? "disabled": ""}`} onClick={() => token? changeStage(): sendData()}>&#8594;</button>
              </div>
            </div>
          </div>
        )} 

        {stage === 12 && (
          <div className="labels_container">
            <div className="content_container">
              <h2 className="question">Upload photos of your skin <span className="opt">(optional)</span></h2>
              <p className="opt">Please upload file smaller than 5MB </p>
              <input className="upload_img" type="file" accept="image/*" onChange ={(img) => handleImage(img.target.files[0])}/>
              {image && <img className="preview_image" src={image} alt="preview"/>}
              <button className="photo_button" onClick={() => {sendData(); changeStage()}}> Skip for now </button>
              <div className="button_container">
                {userData.no_products !== 0 &&  <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>}
                <button className={`photo_button ${!image? "disabled": ""}`} onClick={() => {handleSendImage()}} disabled={!image}> Upload photo </button>
              </div>
            </div>
          </div>
        )}  

        {(skinProfile && stage === 13) && <Productrec product_list={product_list} skinProfile={skinProfile} handlePage={handlePage}/>}
    </div>
  )
}

export default App;
