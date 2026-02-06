import './App.css';
import {useState} from "react";
import Navbar from "./components/layout/Navbar/Navbar";
import Login from "./components/features/auth/Login/Login";
import Signup from "./components/features/auth/Signup/Signup";
import Home from "./components/features/home/Home/Home";
import Profile from "./components/features/profile/Profile/Profile";
import Productrec from "./components/features/product/Product/Product";
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import Step1Name from "./components/features/survey/steps/Step1Name";
import Step2Age from "./components/features/survey/steps/Step2Age";
import Step3Skintype from "./components/features/survey/steps/Step3Skintype";
import Step4Skinconcern from "./components/features/survey/steps/Step4Skinconcern";
import Step5Eyeconcern from "./components/features/survey/steps/Step5EyeConcern";
import Step6Pregnancy from "./components/features/survey/steps/Step6Pregnancy";
import Step7Products from "./components/features/survey/steps/Step7Products";
import Step8Active from "./components/features/survey/steps/Step8Active";
import Step9ActiveIngredient from "./components/features/survey/steps/Step9ActiveIngredients";
import Step10ActiveExperience from "./components/features/survey/steps/Step10ActiveExperience";
import Step11NumberProducts from "./components/features/survey/steps/Step11NumberProducts";
import Step12UploadImage from "./components/features/survey/steps/Step12UploadImage";

function Routers()
{
  const navigate = useNavigate();
  
  const[error, setError] = useState("")
  const[popup, setPopup] = useState(false)

  const handlePopup = () => {
    if (popup)
    {
      setPopup(false);

    }
    else
    
    {
      setPopup(true);
    }
  }

  const skintypeInfo = 
    <div className="popup">
      <button onClick={handlePopup} className="closing_button">&times;</button> 
      <p><strong style={{fontSize: '1rem'}}>Not sure of your skin type?</strong></p>
      <ul>
        <li><strong>Oily</strong>: Shiny face throughout the day, enlarged pores.</li>
        <li><strong>Dry</strong>: Tight feeling, flaky patches.</li>
        <li><strong>Balanced</strong>: Comfortable, no major issues.</li>
        <li><strong>Combination</strong>: Oily forehead/nose, dry cheeks.</li>
        <li><strong>Sensitive</strong>: Reacts easily, redness, stinging</li>
      </ul>
    </div>

  const activeInfo = 
    <div className="popup">
      <button className="closing_button" onClick={handlePopup}>&times;</button>
      <p ><strong style={{fontSize: '1rem'}}>What is active?</strong></p>
      <p>Actives are powerful ingredients that target specific skin concerns like acne, wrinkles, or dark spots. Common examples include retinol, vitamin C, AHAs/BHAs, and niacinamide.</p>
    </div>

  const[image, setImage] = useState(null);
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

  const resetUserData = () => {
    setUserData({name: "", age: 0, skin_type: "", skin_concern: [], eye_concern: [], pregnant: null, products_type: [], routine: "", active_use: null, activeIngre: [], advanced_user: "", no_products: 0});
  }  


  const handlePage = async(site) => {
      if (site === "login" || site === "signup" || site === "home" ||site ==="profile")
      {
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
      setUserData(prev => ({...prev, age: userAge}));
  }

  const validateAge = () => {
    if(userData.age && userData.age < 12)
      {
        setError("You need to be at least 12 years old to use this service.");
      }
    else 
    {
      setError("");
    }
  }

  const handleAdvancedUser = (statement) => {
    setUserData(prev => ({...prev, advanced_user: statement})); 
  }

  const handleNoProducts = (no) => {
    setUserData(prev => ({...prev, no_products: no})); 
  }

  const[imageArray, setImageArray] = useState(null);
  const[skinProfile, setSkinProfile] = useState(null);
  const image_group ={};

  //delete all saved info, set page to 0, navigate back to home page after logging out
  const handleLogout = () => {
    localStorage.removeItem("refresh");
    localStorage.removeItem("access"); 
    handlePage("home");
    navigate("/home");
    setSkinProfile(null);
    setImageArray(null); 
    setProfileName(null);
  }

  let cleanser_cat;
  let toner_cat;
  let serum_cat;
  let moist_cat;
  let sunscreen_cat;
  let eye_cat;
  let micellarwater_cat;
  let cleansingoil_cat;
  let token;

  //fetch user data to Django 
  const sendData = async() => {
    token = localStorage.getItem("access");
    const copyList = {
      cleanser: {high: [], mid: [], low: []}, 
      toner: {high: [], mid: [], low: []}, 
      serum: {high: [], mid: [], low: []}, 
      moisturiser: {high: [], mid: [], low: []}, 
      eye: {high: [], mid: [], low: []}, 
      sunscreen: {high: [], mid: [], low: []}, 
      oilcleanser: {high: [], mid: [], low: []}, 
      micellarwater: {high: [], mid: [], low: []},
    };
  
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/processdata/`, option_headers); 

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
        navigate("/productrec");
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
   token = localStorage.getItem("access");
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

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/processdata/`, object_header)

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
    token = localStorage.getItem("access");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getImage/`, {
        headers: {"Authorization" : `Bearer ${token}`}, 
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
    }
    else 
    {
      console.log("Error: ", response.status);
    }
  }

  return (
    <div className="App">
      <Navbar handleLogout={handleLogout} handlePage={handlePage}/>
      
      <Routes>
        <Route path="/" element={<Navigate to ="/home"/>}/> 
        <Route path="/login" element={<Login handlePage={handlePage} userData={userData} sendData={sendData}/>}/>
        <Route path="/signup" element={<Signup handlePage={handlePage} userData={userData} sendData={sendData}/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/profile" element={<Profile imageArray={imageArray} skinProfile={skinProfile} product_list={product_list} handlePage={handlePage} profileName={profileName}/>}/>
        
        <Route path="/form/step-1" element = {<Step1Name userData={userData} handleName={handleName} />}/>
        <Route path="/form/step-2" element={<Step2Age userData={userData} handleAge={handleAge} validateAge={validateAge} error={error}/>}/>
        <Route path="/form/step-3" element={<Step3Skintype handlePopup={handlePopup} popup={popup} skintypeInfo={skintypeInfo} handleSkinType={handleSkinType} userData={userData}/>}/>
        <Route path="/form/step-4" element={<Step4Skinconcern handleConcern={handleConcern} userData={userData}/>}/>
        <Route path="/form/step-5" element={<Step5Eyeconcern handleEyeConcern={handleEyeConcern} userData={userData}/>}/>
        <Route path="/form/step-6" element={<Step6Pregnancy userData={userData} handlePregnant={handlePregnant}/>}/>
        <Route path="/form/step-7" element={<Step7Products userData={userData} handleProductsType={handleProductsType} handleHavingRoutine={handleHavingRoutine}/>}/>
        <Route path="/form/step-8" element={userData.products_type.length > 0? <Step8Active handleActive={handleActive} userData={userData} handlePopup={handlePopup} popup={popup} activeInfo={activeInfo}/>: null}/>
        <Route path="/form/step-9" element={userData.active_use === true ? <Step9ActiveIngredient handleActiveUsage={handleActiveUsage} userData={userData}/>: null}/>
        <Route path="/form/step-10" element={<Step10ActiveExperience userData={userData} handleAdvancedUser={handleAdvancedUser}/>}/>
        <Route path="/form/step-11" element={<Step11NumberProducts userData={userData} handleNoProducts={handleNoProducts} sendData={sendData}/>}/>
        <Route path="/form/step-12" element={<Step12UploadImage handleImage={handleImage} image={image} sendData={sendData} userData={userData} handleSendImage={handleSendImage}/>}/>

        <Route path="/productrec" element={
          skinProfile ? <Productrec product_list={product_list} skinProfile={skinProfile} handlePage={handlePage}/>: null
        }/> 
      </Routes>
    </div>
  )
}

function App() {

  return (
    <BrowserRouter>
      <Routers/>
    </BrowserRouter>
  );
}


export default App;
