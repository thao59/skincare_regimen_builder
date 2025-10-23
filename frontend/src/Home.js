function Home({buttonSubmit, resetSite}){
    return (
        <div>
            <h1> Regimen Builder</h1>
            <button className="button_next" onClick={() => {buttonSubmit(); resetSite("none")}}> Begin &#8594; </button>
        </div>
    )
}

export default Home;