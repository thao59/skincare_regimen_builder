import "./Home.css"

function Home({buttonSubmit, resetSite}){
    return (
        <div>
            <h1 className="title"> Regimen Builder</h1>
            <button className="start_button" onClick={() => {buttonSubmit(); resetSite("none")}}> Begin &#8594; </button>
        </div>
    )
}

export default Home;