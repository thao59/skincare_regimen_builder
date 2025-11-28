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
      setStage(stage + count);
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
      setStage(stage - count);
    }

    else 
    {
      setStage(count);
    }
  }

  const[image, setImage] = useState(null);
  const[page, setPage] = useState("");
  
  const handlePage = async(site) => {
      if (site === "login" || site === "signup" || site === "home" ||site ==="profile")
      {
        setPage(site); 
        changeStage(0);
        setUserData({name: "", age: 0, skin_type: "", skin_concern: [], eye_concern: [], pregnant: null, products_type: [], routine: "", active_use: null, activeIngre: [], advanced_user: "", no_products: 0})
        setImage(null);

        if (site === "profile")
        {
          await get_data();
        }
      }
  }

  //save user's information 
  const[userData, setUserData] = useState({name: "", age: 0, skin_type: "", skin_concern: [], eye_concern: [], pregnant: null, products_type: [], routine: "", active_use: null, activeIngre: [], advanced_user: "", no_products: 0})

  const handleName = (userName) => {
    if(userName)
    {
      setUserData({...userData, name: userName});
    }
    else 
    {
      setUserData({...userData, name: ""});
    }
  }

  const handleSkinType = (type) => {
      setUserData({...userData, skin_type: type}); 
  }

  const handleConcern = (concern) =>  {
    //Remove concern if already selected (toggle)
    if (userData.skin_concern.includes(concern))
    { 
      setUserData({...userData, skin_concern: userData.skin_concern.filter(type=>type !== concern)});
    }
    else 
    {
      setUserData({...userData, skin_concern: [...userData.skin_concern, concern]});
    }
  } 

  const handleEyeConcern = (eyeConcern) => {
    if(!eyeConcern)
      return;
    else 
    {
      if (userData.eye_concern.includes(eyeConcern))
        {
          setUserData({...userData, eye_concern: userData.eye_concern.filter(x => x !== eyeConcern)});
        }
      else
        {
          setUserData({...userData, eye_concern: [...userData.eye_concern, eyeConcern]});
        }
    }
  }

  const handlePregnant = (bool) => {
    if (bool === "no")
    {
      setUserData({...userData, pregnant: false}); 
    }
    else 
    {
      setUserData({...userData, pregnant: true}); 
    }
  } 

  const handleProductsType = (product) => {
    if (userData.products_type.includes(product))
      {
        setUserData({...userData, products_type: userData.products_type.filter(x => x !== product)}); 
      }
    else 
      {
        //if "I don't have a routine" is checked, uncheck it first before handling the array
        if(userData.routine === "no_routine")
        {
          setUserData({...userData, products_type: [...userData.products_type, product], routine: ""});
        }
        else 
        {
          setUserData({...userData, products_type: [...userData.products_type, product]});
        }
      }
  }

  const handleHavingRoutine = (statement) => {
    if(statement)
      {
        //clear field (uncheck the button on second click)
        if(userData.routine === statement)
        {
          setUserData({...userData, routine: ""});
        }

        else
        {
          //clear products_type array before checking "I dont have a routine" option
          //set active_use to null in case user goes to q8 and go back to 7 to check "I dont have a routine" which will cause two back arrows on p12
          if(userData.products_type.length > 0)
            {
              setUserData({...userData, products_type: [], routine: statement, active_use: null});
            }
          else 
          {
            setUserData({...userData, routine: statement, active_use: null});
          }
        }
      }
  }
  
  //save user's answer whether they use actives 
  const handleActive = (bool) => {
    if (bool === "no")
    {
      setUserData({...userData, active_use: false}); 
    }
    else 
    {
      setUserData({...userData, active_use: true}); 
    }
  }

  const handleActiveUsage = (ingre) => {
    if (userData.activeIngre.includes(ingre)) 
    {
      setUserData({...userData, activeIngre: userData.activeIngre.filter(x => x !== ingre)});
    }
    else 
    {
      setUserData({...userData, activeIngre: [...userData.activeIngre, ingre]}); 
    }
  }

  const handleAge = (userAge) => {
      //filter out age 18 and above 
      setUserData({...userData, age: userAge});
  }

  const handleAdvancedUser = (statement) => {
    setUserData({...userData, advanced_user: statement}); 
  }

  const handleNoProducts = (no) => {
    setUserData({...userData, no_products: no}); 
  }

  //delete all saved info, set page to 0, navigate back to home page after logging out
  const handleLogout = () => {
    changeStage(0);
    localStorage.removeItem("refresh");
    localStorage.removeItem("access"); 
    handlePage("home");
    setUserData({name: "", age: 0, skin_type: "", skin_concern: [], eye_concern: [], pregnant: null, products_type: [], routine: "", active_use: null, activeIngre: [], advanced_user: "", no_products: 0});
  }

  const token = localStorage.getItem("access"); 

  const[imageArray, setImageArray] = useState(null);
  const[skinProfile, setSkinProfile] = useState(null);
  const[retrieveData, setRetrieveData] = useState(null);
  const image_group ={};
  const[cleanser, setCleanser] = useState([]); 
  const[toner, setToner] = useState([]);
  const[serum, setSerum] = useState([]);
  const[moisturiser, setMoisturiser] = useState([]);
  const[sunscreen, setSunscreen] = useState([]); 
  const[eye, setEye] = useState([]);
  const[oilcleanser, setOilcleanser] = useState([]);
  const[micellarwater, setMicellarwater] = useState([]); 

  console.log("token: ", token);

  //fetch user data to Django 
  const sendData = async() => {
    if (userData.routine === "no_routine" || userData.active_use === false || userData.no_products !== 0 )
    {
      const option_headers = {
        method : "POST", 
        headers : {"Content-Type": "application/json",},
        body: JSON.stringify(userData),
      };

      //if user is logged in, send data with token
      if (token)
      {
        option_headers.headers.Authorization = `Bearer ${token}`; 
      }
      const response = await fetch("http://localhost:8000/processdata/", option_headers); 

      const data = await response.json(); 
      if (response.ok)
      {
        console.log(data.message, response.status) 
        
        //process data if user is logged in
        if (data.product_recs)
        {       
          //group and save products according to types 
          const cleanser_cat = data.product_recs.filter(x => x.product.product_cat === "cleanser").map(x => x.product);

          setCleanser(cleanser_cat);

          const toner_cat = data.product_recs.filter(x=> x.product.product_cat === "toner").map(x => x.product);
          setToner(toner_cat);

          const serum_cat = data.product_recs.filter(x=> x.product.product_cat === "serum").map(x => x.product);
          setSerum(serum_cat);

          const moist_cat = data.product_recs.filter(x=> x.product.product_cat === "moisturiser").map(x => x.product);
          setMoisturiser(moist_cat);

          if (data.user_skin_profile.skin_concern.includes("acne") || data.user_skin_profile.skin_concern.includes("sensitive") )
          {
            const sunscreen_cat = data.product_recs.filter(x=> x.product.product_cat === "physical sunscreen").map(x => x.product);
            setSunscreen(sunscreen_cat);
          }

          else 
          {
            const sunscreen_cat = data.product_recs.filter(x=> x.product.product_cat === "chemical sunscreen").map(x => x.product);
            setSunscreen(sunscreen_cat);
          }

          const eye_cat = data.product_recs.filter(x=> x.product.product_cat === "eye").map(x => x.product);
          setEye(eye_cat);

          const micellarwater_cat = data.product_recs.filter(x=> x.product.product_cat === "micellar water").map(x => x.product);
          setMicellarwater(micellarwater_cat);

          const cleansingoil_cat = data.product_recs.filter(x=> x.product.product_cat === "oil cleanser").map(x => x.product);
          setOilcleanser(cleansingoil_cat);

          const get_skinConcern = data.user_skin_profile.skin_concern;
          setSkinProfile(get_skinConcern);
        }

        //process data if user is not logged in
        else 
        {
          if(data.cleanser)
          {
            const cleanser_array = Object.values(data.cleanser).flat();
            setCleanser(cleanser_array);
          }
        
          if(data.toner)
          {
            const toner_array = Object.values(data.toner).flat();
            setToner(toner_array);
          }
            
          if(data.serum)
          {
            const serum_array = Object.values(data.serum).flat();
            setSerum(serum_array);
          }
          
          if(data.moisturiser)
          {
            const moisturiser_array = Object.values(data.moisturiser).flat();
            setMoisturiser(moisturiser_array);
          }
            
          if(data.sunscreen)
          {
            const sunscreen_array = Object.values(data.sunscreen).flat();
            setSunscreen(sunscreen_array);
          }

          if(data.eye)
          {
            const eye_array = Object.values(data.eye).flat();
            setEye(eye_array);
          }

          if(data.micellar_water)
          {
            const micellar_water_array = Object.values(data.micellar_water).flat();
            setMicellarwater(micellar_water_array);
          }
          
          if(data.cleansing_oil)
          {
            const cleansing_oil_array = Object.values(data.cleansing_oil).flat();
            setOilcleanser(cleansing_oil_array);
          }

          const get_skinConcern = data.user_skin_profile;
          setSkinProfile(get_skinConcern);
        }

        changeStage(13);
      }

      else
      {
        console.log(data.error);
      }
    }
  }

  console.log(cleanser);
  console.log(toner);
  console.log(serum);
  console.log(moisturiser);
  console.log(eye);
  console.log(sunscreen);
  console.log(oilcleanser);
  console.log(micellarwater);

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
      console.log("Error: ", data.error);
    }
  }

  //fetch imgs from backend 
  const get_data = async () => {
      const response = await fetch("http://localhost:8000/getImage", {
          headers: {"Authorization" : `Bearer ${localStorage.getItem("access")}`}, 
      });

      const data = await response.json(); 
      if (response.ok)
      {
          console.log(data.message); 

          //extract skininfo and save in retrieveData
          setRetrieveData(data.skininfo);

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

          const cleanser_cat = data.product_recs.filter(x => x.product.product_cat === "cleanser").map(x => x.product);

          setCleanser(cleanser_cat);

          const toner_cat = data.product_recs.filter(x=> x.product.product_cat === "toner").map(x => x.product);
          setToner(toner_cat);

          const serum_cat = data.product_recs.filter(x=> x.product.product_cat === "serum").map(x => x.product);
          setSerum(serum_cat);

          const moist_cat = data.product_recs.filter(x=> x.product.product_cat === "moisturiser").map(x => x.product);
          setMoisturiser(moist_cat);

          if (data.skininfo.skin_concern.includes("acne") || (data.skininfo.skin_concern.includes("sensitive")))
          {
            const sunscreen_cat = data.product_recs.filter(x=> x.product.product_cat === "physical sunscreen").map(x => x.product);
            setSunscreen(sunscreen_cat);
          }
          else 
          {
            const sunscreen_cat = data.product_recs.filter(x=> x.product.product_cat === "chemical sunscreen").map(x => x.product);
            setSunscreen(sunscreen_cat);
          }

          const eye_cat = data.product_recs.filter(x=> x.product.product_cat === "eye").map(x => x.product);
          setEye(eye_cat);

          const micellarwater_cat = data.product_recs.filter(x=> x.product.product_cat === "micellar water").map(x => x.product);
          setMicellarwater(micellarwater_cat);

          const cleansingoil_cat = data.product_recs.filter(x=> x.product.product_cat === "oil cleanser").map(x => x.product);
          setOilcleanser(cleansingoil_cat);

          const get_skinConcern = data.user_skin_profile.skin_concern;
          setSkinProfile(get_skinConcern);
      }
      else 
      {
        console.log("error");
      }
    }
  return (
    <div className="App">
        <Navbar onPageChange={handlePage} resetStage={changeStage} handleLogout={handleLogout} retrieveData={get_data}/>
        {page === "login" && <Login resetSite={handlePage}/>}
        {page === "signup" && <Signup resetSite={handlePage}/>}
        {page === "home" && stage === 0 && <Home buttonSubmit={changeStage} resetSite={handlePage} />}
        {page === "profile" && <Profile imageArray={imageArray} skinProfile={skinProfile} retrieveData={retrieveData}/>}
        {stage === 1 && (
          <div className="labels_container">
            <h1 className="title"> My Skincare Routine Tracker</h1>
            <p> Track your skincare journey and get personalised recommendations!</p>
            <h2 className="question">What's your name?</h2>
            <input type="text" onChange={(field) => handleName(field.target.value)} value={userData.name}/>
            <button className="button_next" onClick ={() => changeStage()} disabled={!userData.name}>&#8594;</button>
          </div>
        )}
        {stage === 2 && (
          <div className="labels_container">
            <h2 className="question">How old are you? For better and more accurate result.</h2>
            <input type="text" onChange={(field) => handleAge(field.target.value)} value={userData.age > 0 ? userData.age : ""}/>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              <button className="button_next" onClick ={() => changeStage()} disabled={userData.age < 12 || userData.age > 100 || isNaN(userData.age) }>&#8594;</button>
            </div>

          </div>
        )}

        {stage === 3 && (
          <div className="labels_container">
            <h2 className="question">What is your skin type?</h2>
            <p className="note">Select the answer that fits you best.</p>
            <label><input type="radio" name="skin_type" onChange={() => handleSkinType("oily")} checked={userData.skin_type === "oily"}/> Oily</label>
            <label><input type="radio" name="skin_type" onChange={() => handleSkinType("dry")} checked={userData.skin_type === "dry"}/> Dry</label>
            <label><input type="radio" name="skin_type" onChange={() => handleSkinType("balanced")} checked={userData.skin_type === "balanced"}/> Balanced</label>
            <label><input type="radio" name="skin_type" onChange={() => handleSkinType("combination")} checked={userData.skin_type === "combination"}/> Combination</label>
            <label><input type="radio" name="skin_type" onChange={() => handleSkinType("sensitive")} checked={userData.skin_type === "sensitive"}/> Sensitive</label>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              <button className="button_next" onClick ={() => changeStage()} disabled={!userData.skin_type}>&#8594;</button>
            </div>
            
          </div>
        )}
        
        {stage === 4 && (
          <div className="labels_container">
          <h2 className="question"> Identify top 3 concerns </h2>
          <label><input type="checkbox" onChange={() => handleConcern("acne")} checked={userData.skin_concern.includes("acne")}/> Acne</label>
          <label><input type="checkbox" onChange={() => handleConcern("aging")} checked={userData.skin_concern.includes("aging")}/> Aging</label>
          <label><input type="checkbox" onChange={() => handleConcern("pigmentation")} checked={userData.skin_concern.includes("pigmentation")}/> Dark spots/Hyperpigmentation</label>
          <label><input type="checkbox" onChange={() => handleConcern("dehydrated")} checked={userData.skin_concern.includes("dehydrated")}/> Dehydrated</label>
          <label><input type="checkbox" onChange={() => handleConcern("dryness")} checked={userData.skin_concern.includes("dryness")}/> Dry</label>
          <label><input type="checkbox" onChange={() => handleConcern("pores")} checked={userData.skin_concern.includes("pores")}/> Large pores </label> 
          <label><input type="checkbox" onChange={() => handleConcern("sensitive")} checked={userData.skin_concern.includes("sensitive")}/> Sensitive/Redness</label>
          <label><input type="checkbox" onChange={() => handleConcern("dullness")} checked={userData.skin_concern.includes("dullness")}/> Dullness</label>
          <label><input type="checkbox" onChange={() => handleConcern("texture")} checked={userData.skin_concern.includes("texture")}/> Uneven texture</label>
          <div className="button_container">
            <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
            <button className="button_next" onClick ={() => changeStage()} disabled={userData.skin_concern.length < 1}>&#8594;</button>
          </div>
          
        </div>
        )}

        {stage === 5 && (
          <div className="labels_container">
            <h2 className="question">Do you have any eye area concerns?</h2>
            <p className="note">Select all that apply</p>
            <label><input type="checkbox" onChange={()=> handleEyeConcern("wrinkles")} checked={userData.eye_concern.includes("wrinkles")}/> Fine Lines and Wrinkles</label>
            <label><input type="checkbox" onChange={()=> handleEyeConcern("dark circles")}  checked={userData.eye_concern.includes("dark circles")}/> Dark Circles</label>
            <label><input type="checkbox" onChange={()=> handleEyeConcern("puffiness")}  checked={userData.eye_concern.includes("puffiness")}/> Puffiness</label>
            <label><input type="checkbox" onChange={()=> handleEyeConcern("dryness")}  checked={userData.eye_concern.includes("dryness")}/> Dryness</label>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              <button className="button_next" onClick ={() => changeStage()} disabled={userData.skin_concern.length < 1}>&#8594;</button>
            </div>
            
          </div>
        )}

        {stage === 6 && (
            <div className="labels_container">
            <h2 className="question">Are you currently pregnant, breastfeeding, planning on getting pregnant or post-partum?</h2>
            <label><input type="radio" name="pregnant" onChange={()=> handlePregnant("yes")} checked={userData.pregnant === true}/> Yes</label>
            <label><input type="radio" name="pregnant" onChange={()=> handlePregnant("no")} checked={userData.pregnant === false} /> No</label>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              <button className="button_next" onClick={() => changeStage()} disabled={userData.pregnant === null}>&#8594;</button>
            </div>
            
          </div>
        )}
                
        {stage === 7 && (
          <div className="labels_container">
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
                {(userData.products_type.length < 1 && userData.routine === "") && <button disabled ={userData.products_type.length < 1 && userData.routine === ""}>&#8594;</button>}
                {userData.routine === "no_routine" && <button className="button_next" onClick={() => token? changeStage(12): sendData()} disabled={userData.products_type.length < 1 && userData.routine === ""}>&#8594;</button>}
                {userData.products_type.length > 0 && <button className="button_next" onClick={() => changeStage()} disabled={userData.products_type.length < 1 && userData.routine === ""}>&#8594;</button>}
              </div>
            
          </div>
        )}

        {stage === 8 && userData.products_type.length > 0 && (
          <div className="labels_container">
            <h2 className="question"> Are you using actives in your skincare routine? </h2>
            <label><input type="radio" name="active" onChange={() => handleActive("yes")} checked={userData.active_use === true}/> Yes</label>
            <label><input type="radio" name="active" onChange={() => handleActive("no")} checked={userData.active_use === false}/> No</label>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              {userData.active_use === null && <button disabled={userData.active_use === null}>&#8594;</button>}
              {userData.active_use === false && <button className="button_next" onClick={() => token? changeStage(12): sendData()} disabled={userData.active_use === null}>&#8594;</button> }
              {userData.active_use === true && <button className="button_next" onClick={() => changeStage()} disabled={userData.active_use === null}>&#8594;</button>}
            </div>
          </div>
        )}

        { stage === 9 && userData.active_use === true && (
          <div className="labels_container">
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
              <button className="button_next" onClick={() => changeStage()} disabled={userData.activeIngre.length < 1}>&#8594;</button>
            </div>

          </div>
        )}

        {stage === 10 && (
          <div className="labels_container">
            <h2 className="question"> Are you an experienced user of acids, retinoids and vitamin C?</h2>
            <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("beginner")} checked={userData.advanced_user === "beginner"}/> Beginner </label>
            <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("intermediate")} checked={userData.advanced_user === "intermediate"}/> Intermediate</label>
            <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("advanced")} checked={userData.advanced_user === "advanced"}/> Advanced </label>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              <button onClick={() => changeStage()} disabled={userData.advanced_user === ""}>&#8594;</button>
            </div>
          </div>
        )}

        {stage === 11 && (
          <div className="labels_container">
            <h2 className="question"> How many products do you prefer to have in your regimen?</h2>
            <label><input type="radio" name="no_products" onChange={() => handleNoProducts(3)} checked={userData.no_products === 3}/> Simple (3 products) </label>
            <label><input type="radio" name="no_products" onChange={() => handleNoProducts(5)} checked={userData.no_products === 5}/> Essentials (4-5 products)</label>
            <label><input type="radio" name="no_products" onChange={() => handleNoProducts(6)} checked={userData.no_products === 6}/> Advanced (6+ products) </label>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              {token ? <button onClick={() => changeStage()} disabled={userData.no_products === 0}>&#8594;</button> : <button onClick={() => sendData()} disabled={userData.no_products === 0}>&#8594;</button>}

            </div>

          </div>
        )} 

        {(userData.routine === "no_routine" || userData.active_use === false || userData.no_products !== 0) && stage === 12 && (
          <div className="labels_container">
            <h2 className="question">Upload photos of your skin <span className="opt">(optional)</span></h2>
            <p className="opt">Please upload file smaller than 5MB </p>
            <input className="upload_img" type="file" accept="image/*" onChange ={(img) => handleImage(img.target.files[0])}/>
            {image && <img className="preview_image" src={image} alt="preview"/>}
            <button onClick={() => {sendData(); changeStage()}}> Skip for now </button>
            <div className="button_container">
              {userData.routine === "no_routine" &&  <button className="button_previous" onClick={()=> changePreviousStage(7)}> &#8592; </button>}
              {userData.active_use === false &&  <button className="button_previous" onClick={()=> changePreviousStage(8)}> &#8592; </button>}
              {userData.no_products !== 0 &&  <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>}
              <button onClick={() => {handleSendImage()}} disabled={!image}> Upload photo </button>
            </div>
          </div>
        )}  

        {stage === 13 && <Productrec cleanser={cleanser} toner={toner} serum={serum} moisturiser={moisturiser} eye={eye} sunscreen={sunscreen} oilcleanser={oilcleanser} micellarwater={micellarwater} skinProfile={skinProfile} handlePage={handlePage} />}
    </div>
  )
}

export default App;
