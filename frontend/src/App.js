import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import Navbar from "./Navbar.js";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";

function App() {
  const[account, setAccount] = useState("");
  
  const handlePage = (site) => {
      if (site === "login" || site === "signup" || site === "home")
      {
        setAccount(site); 
      }
      else 
      {
        setAccount("");
      }
  }

  console.log("site: ", account);
  

  //track stages (next) 
  const[stage, setStage] = useState(0);

  //once button is clicked change to the next stage 
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
  console.log(stage);

  const changePreviousStage = () => {
    setStage(stage - 1);
  }

  //save user's information 
  const[userData, setUserData] = useState({name: "", age: 0, skin_type: "", skin_concern: [], eye_concern: [], pregnant: null, products_type: [], routine: "", active_use: null, activeIngre: [], advanced_user: null, no_products: 0})

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
    if (userAge)
    {
      //filter out age 18 and above 
        setUserData({...userData, age: userAge});
        console.log("user's age: ", userData.age);
      
    }
    else 
    {
      setUserData({...userData, age: 0});
    }
  }

  const handleAdvancedUser = (bool) => {
    setUserData({...userData, advanced_user: bool}); 
  }

  const handleNoProducts = (no) => {
    setUserData({...userData, no_products: no}); 
    
  }
  
   return (
    <div className="App">
        <Navbar onPageChange={handlePage} resetStage={changeStage}/>
        {account === "login" && <Login resetSite={handlePage}/>}
        {account === "signup" && <Signup resetSite={handlePage}/>}
        {account === "home" && stage !== 1 && <Home buttonSubmit={changeStage} resetSite={handlePage} />}
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
              <button className="button_next" onClick ={() => changeStage()} disabled={userData.age < 12}>&#8594;</button>
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
              <label><input type="checkbox"  onChange={() => {handleHavingRoutine("no_routine")}} checked={userData.routine === "no_routine"} /> I don't have a skincare routine</label>
              <div className="button_container">
                <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
                <button className="button_next" onClick={() => changeStage()} disabled={userData.products_type.length < 1 && userData.routine === ""}>&#8594;</button>
              </div>
            
          </div>
        )}

        {stage === 8 && userData.products_type.length > 0 && (
          <div className="labels_container">
            <h2 className="question"> Are you using actives in your skincare routine? </h2>
            <label><input type="radio" name="active" onChange={() => handleActive("yes")}/> Yes</label>
            <label><input type="radio" name="active" onChange={() => handleActive("no")}/> No</label>
            <div className="button_container">
              <button className="button_previous" onClick={()=> changePreviousStage()}> &#8592; </button>
              <button className="button_next" onClick={() => changeStage()} disabled={userData.active_use === null}>Continue</button>
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
            <button className="button_next" onClick={() => changeStage()} disabled={userData.activeIngre < 1}>Continue</button>
          </div>
        )}

        {stage === 10 && (
          <div className="labels_container">
            <h2 className="question"> Are you an experienced user of acids, retinoids and vitamin C?</h2>
            <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("beginner")}/> Beginner </label>
            <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("intermediate")}/> Intermediate</label>
            <label><input type="radio" name="advanced_user" onChange={() => handleAdvancedUser("Advanced")}/> Advanced </label>
            <button onClick={() => changeStage()} disabled={userData.advanced_user === null}>Continue</button>
          </div>
        )}

        {stage === 11 && (
          <div className="labels_container">
            <h2 className="question"> How many products do you prefer to have in your regimen?</h2>
            <label><input type="radio" name="no_products" onChange={() => handleNoProducts(3)}/> Simple (3 products) </label>
            <label><input type="radio" name="no_products" onChange={() => handleNoProducts(5)}/> Essentials (4-5 products)</label>
            <label><input type="radio" name="no_products" onChange={() => handleNoProducts(6)}/> Advanced (6+ products) </label>
            <button onClick={() => changeStage()} disabled={userData.no_products === 0}>Continue</button>
          </div>
        )}    
    </div>
  )
}

export default App;
