import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import Navbar from "./Navbar.js";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import Profile from "./Profile";

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
  const changePreviousStage = () => {
    setStage(stage - 1);
  }

  
  const[page, setPage] = useState("");
  
  const handlePage = (site) => {
      if (site === "login" || site === "signup" || site === "home" ||site ==="profile")
      {
        setPage(site); 
        changeStage(0);
        console.log("Site: ", site);
      }
  }

  //save user's information 
  const[userData, setUserData] = useState({name: "", age: 0, skin_type: "", skin_concern: [], eye_concern: [], pregnant: null, products_type: [], routine: "", active_use: null, activeIngre: [], advanced_user: "", no_products: 0})

  const handleName = (userName) => {
    if(userName)
    {
      setUserData({...userData, name: userName});
      console.log(userName);
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
      console.log("unchecked skin type: ", userData.skin_concern);
    }
    else 
    {
      setUserData({...userData, skin_concern: [...userData.skin_concern, concern]});
      console.log("checked skin type: ", userData.skin_concern);
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
      console.log("pregnant: ", userData.pregnant);
    }
    else 
    {
      setUserData({...userData, pregnant: true}); 
      console.log("pregnant: ", userData.pregnant);
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
          console.log("checked products: ", product);
        }
        else 
        {
          setUserData({...userData, products_type: [...userData.products_type, product]});
          console.log("checked products: ", userData.products_type);
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
          if(userData.products_type.length > 0)
            {
              setUserData({...userData, products_type: [], routine: statement});
            }
          else 
          {
            setUserData({...userData, routine: statement});
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
      console.log("user's age: ", userData.age); 
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

  //fetch user data to Django 
  const sendData = async() => {
    if (userData.routine === "no_routine" || userData.active_use === false || userData.no_products !== 0 )
    {
      const response = await fetch("http://localhost:8000/processdata/", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
           "Authorization" : `Bearer ${localStorage.getItem("access")}`},
        body: JSON.stringify(userData), 
      }); 
      console.log("Survery has been sent successfully");
      console.log("this  token is sent: ", localStorage.getItem("access"));
      console.log("testing content: ", userData.routine);

      const data = await response.json(); 
      if (response.ok)
      {
        console.log(data.message, response.status)
        
        //send user to page 12 for uploading images 
        changeStage(12);
      }
      else
      {
        console.log(data.error);
      }
    }
  }

  const[imageFile, setImageFile] = useState(null);
  const[image, setImage] = useState(null);

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

    const response = await fetch("http://localhost:8000/processimage/", {
      method: "POST", 
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access")}`}, 
      body: file_form, 
    }); 

    const data = await response.json(); 
    if (response.ok)
    {
      console.log("Status: ", data.message); 
      //navigate user back to homepage 
      handlePage("home");
    }
    else 
    {
      console.log("Error: ", data.error);
    }
  }

  const[imageArray, setImageArray] = useState(null);
  const[username, setUsername] = useState(""); 
  const image_group ={}

  //fetch imgs from backend 
  const get_img = async () => {
      const response = await fetch("http://localhost:8000/processimage", {
          headers: {"Authorization" : `Bearer ${localStorage.getItem("access")}`}, 
      });

      const data = await response.json(); 
      if (response.ok)
      {
          console.log(data.message); 
          setUsername(data.name);

          //loops through image array and group them according to date 
          for (const i of data.image)
          {
            let date = new Date(i.datetime).toLocaleDateString();
            if (image_group[date])
            {
              //.push adding items to array
              image_group[date].push(i);
              setImageArray(image_group);
            }
            else 
            {
              image_group[date] = [i];
              setImageArray(image_group);
            }
          }
      }
      else 
      {
        console.log("Fetched image: ", data);
      }
    }

    console.log(imageArray);

  return (
    <div className="App">
        <Navbar onPageChange={handlePage} resetStage={changeStage} handleLogout={handleLogout} retrieveImg={get_img}/>
        {page === "login" && <Login resetSite={handlePage}/>}
        {page === "signup" && <Signup resetSite={handlePage}/>}
        {page === "home" && <Home buttonSubmit={changeStage} resetSite={handlePage} />}
        {page === "profile" && <Profile imageArray={imageArray} username={username}/>}
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
            <label><input type="radio" name="skin_type" onChange={() => handleSkinType("oily")} checked={userData.skin_type === "oily"}/>Oily</label>
            <label><input type="radio" name="skin_type" onChange={() => handleSkinType("dry")} checked={userData.skin_type === "dry"}/>Dry</label>
            <label><input type="radio" name="skin_type" onChange={() => handleSkinType("balanced")} checked={userData.skin_type === "balanced"}/>Balanced</label>
            <label><input type="radio" name="skin_type" onChange={() => handleSkinType("combination")} checked={userData.skin_type === "combination"}/>Combination</label>
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
          <label><input type="checkbox" onChange={() => handleConcern("darksports")} checked={userData.skin_concern.includes("darksports")}/> Dark spots/Hyperpigmentation</label>
          <label><input type="checkbox" onChange={() => handleConcern("dehydrated")} checked={userData.skin_concern.includes("dehydrated")}/> Dehydrated</label>
          <label><input type="checkbox" onChange={() => handleConcern("largepores")} checked={userData.skin_concern.includes("largepores")}/> Large pores </label> 
          <label><input type="checkbox" onChange={() => handleConcern("sensitive")} checked={userData.skin_concern.includes("sensitive")}/> Sensitive/Redness </label>
          <label><input type="checkbox" onChange={() => handleConcern("dullness")} checked={userData.skin_concern.includes("dullness")}/> Dullness</label>
          <label><input type="checkbox" onChange={() => handleConcern("uneventexture")} checked={userData.skin_concern.includes("uneventexture")}/> Uneven texture</label>
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
            <label><input type="checkbox" onChange={()=> handleEyeConcern("finelines&wrinkles")} checked={userData.eye_concern.includes("finelines&wrinkles")}/>Fine Lines and Wrinkles</label>
            <label><input type="checkbox" onChange={()=> handleEyeConcern("darkcircle")} checked={userData.eye_concern.includes("darkcircle")}/>Dark Circles & Puffiness</label>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              <button className="button_next" onClick ={() => changeStage()} disabled={userData.skin_concern.length < 1}>&#8594;</button>
            </div>
            
          </div>
        )}

        {stage === 6 && (
            <div className="labels_container">
            <h2 className="question">Are you currently pregnant, breastfeeding, planning on getting pregnant or post-partum?</h2>
            <label><input type="radio" name="pregnant" onChange={()=> handlePregnant("yes")} checked={userData.pregnant === true}/>Yes</label>
            <label><input type="radio" name="pregnant" onChange={()=> handlePregnant("no")} checked={userData.pregnant === false} />No</label>
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
                <button className="button_next" onClick={() => {changeStage(); sendData()}} disabled={userData.products_type.length < 1 && userData.routine === ""}>&#8594;</button>
              </div>
            
          </div>
        )}

        {stage === 8 && userData.products_type.length > 0 && (
          <div className="labels_container">
            <h2 className="question"> Are you using actives in your skincare routine? </h2>
            <label><input type="radio" name="active" onChange={() => handleActive("yes")}/> Yes</label>
            <label><input type="radio" name="active" onChange={() => {handleActive("no"); sendData()}}/> No</label>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              <button className="button_next" onClick={() => {changeStage(); sendData()}} disabled={userData.active_use === null}>&#8594;</button>
            </div>
          </div>
        )}

        { stage === 9 && userData.active_use === true && (
          <div className="labels_container">
            <h2 className="question"> What actives are in your routine? </h2>
            <label><input type="checkbox" onChange={() => handleActiveUsage("vitaminC")}/> Vitamin C</label>
            <label><input type="checkbox" onChange={() => handleActiveUsage("niacinamide")}/> Niacinamide</label>
            <label><input type="checkbox" onChange={() => handleActiveUsage("bha")}/> BHA</label>
            <label><input type="checkbox" onChange={() => handleActiveUsage("aha")}/> AHA</label>
            <label><input type="checkbox" onChange={() => handleActiveUsage("pha")}/> PHA</label>
            <label><input type="checkbox" onChange={() => handleActiveUsage("retinol")}/> Retinol</label>
            <label><input type="checkbox" onChange={() => handleActiveUsage("tretinoin")}/> Tretinoin</label>
            <label><input type="checkbox" onChange={() => handleActiveUsage("azelaicAcid")}/> Azelaic Acid</label>
            <label><input type="checkbox" onChange={() => handleActiveUsage("benzoylPeroxide")}/> Benzoyl Peroxide</label>
            <button className="button_next" onClick={() => changeStage()} disabled={userData.activeIngre.length < 1}>&#8594;</button>
          </div>
        )}

        {stage === 10 && (
          <div className="labels_container">
            <h2 className="question"> Are you an experienced user of acids, retinoids and vitamin C?</h2>
            <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("beginner")}/> Beginner </label>
            <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("intermediate")}/> Intermediate</label>
            <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("Advanced")}/> Advanced </label>
            <button onClick={() => changeStage()} disabled={userData.advanced_user === ""}>&#8594;</button>
          </div>
        )}

        {stage === 11 && (
          <div className="labels_container">
            <h2 className="question"> How many products do you prefer to have in your regimen?</h2>
            <label><input type="radio" name="no_products" onChange={() => handleNoProducts(3)}/> Simple (3 products) </label>
            <label><input type="radio" name="no_products" onChange={() => handleNoProducts(5)}/> Essentials (4-5 products)</label>
            <label><input type="radio" name="no_products" onChange={() => handleNoProducts(6)}/> Advanced (6+ products) </label>
            <button onClick={() => {changeStage(); sendData()}} disabled={userData.no_products === 0}>&#8594;</button>
          </div>
        )} 

        {(userData.routine === "no_routine" || userData.active_use === false || userData.no_products !== 0) && stage === 12 && (
          <div className="labels_container">
            <h2 className="question">Upload photos of your skin <span className="opt">(optional)</span></h2>
            <p className="opt">Please upload file smaller than 5MB </p>
            <input className="upload_img" type="file" accept="image/*" onChange ={(img) => handleImage(img.target.files[0])}/>
            {image && <img className="preview_image" src={image} alt="preview"/>}
            <button onClick={handleSendImage} disabled={!image}> Upload photo </button>
            <button> Skip for now </button>
          </div>

        )}  
    </div>
  )
}

export default App;
