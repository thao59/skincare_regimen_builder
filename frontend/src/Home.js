import "./Home.css"

function Home({buttonSubmit, resetSite}){
    return (
        <div>
            <h1 className="title"> Regimen Builder</h1>
            <button className="start_button" onClick={() => {buttonSubmit(); resetSite("none")}}> Begin &#8594; </button>
            <div className="info_section">
                <div className="info_container">
                    <p className="info_icon">✨</p>
                    <p className="info_spec">Personalised</p>
                    <p>Custom recommendations based on your unique skin type and concerns</p>
                </div>
                <div className="info_container">
                    <p className="info_icon">🎯</p>
                    <p className="info_spec">Targeted</p>
                    <p>Solutions designed to address your specific skincare goals</p>
                </div>
                <div className="info_container">
                    <p className="info_icon">💫</p>
                    <p className="info_spec">Simple</p>
                    <p>Easy-to-follow routine that fits your lifestyle</p>
                </div>
            </div>
        </div>
    )
}

export default Home;