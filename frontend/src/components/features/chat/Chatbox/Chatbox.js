import {useState} from "react"; 
import "./Chatbox.css";

function Chatbox () {
    const[msgbox, setMsgbox] = useState(false); 
    const[time, setTime] = useState(null);
    const[userMessage, setUserMessage] = useState([]);
    const[content, setContent] = useState(""); 
    const[msgId, setMsgId] = useState(null);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(""); 
    const[similarProduct, setSimilarProduct] = useState(false);
    let send_content;
    const[newSession, setNewSession] = useState(false);

    const openMsg = () => {
        if (time)
        {
            if (Date.now() - time >= 20*60*1000)
            {
                setUserMessage([]);
                setTime(null);
            }
        }
        setMsgbox(true);
    }

    const closeMsg = () => {
        setMsgbox(false);
    }
    
    const handleContent = (string) => {
        //if its been more than 30 mins since last msg, announce session expire
        if(time && Date.now() - time >= 20*60*1000)
        {
            setNewSession(true);
            setUserMessage([]);
            setTime(null);     
        }
        else
        {
            setContent(string);
            setTime(Date.now());
        }
    }

    const handleNewChat = () => {
        setNewSession(false);
    }

    const handleSimilarProducts = () => {
        setSimilarProduct(true);
    }

    const token = localStorage.getItem("access"); 
    const sendMsg = async(msg = null) => {
        setLoading(true);
        setError("");
        const contentToSend = msg || content;
        send_content = {role: "user", message: contentToSend};
        setUserMessage(prev => ([...prev, send_content])); 
        
        //clear chat input and reset time
        setContent("");

        const option_headers = {
            method: "POST", 
            credentials: "include",
            headers: {"Content-type": "application/json"}, 
            body: JSON.stringify({message: send_content, messageId: msgId}), 
        }

        if (token)
        {
            option_headers.headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chatbox/`, option_headers);

        const data = await response.json();
        if (response.ok)
        {
            setLoading(false);
            console.log(response.status)
            setMsgId(data.msgID); 
            setUserMessage(prev => ([...prev, {role: "assistant", message: data.reply}]))
        }
        else 
        {
            setLoading(false);
            console.log(response.status, data.error);
            setError("Sorry, something went wrong. Please try again.");
        }
        
    }

    return(
        <div className="question_bar_container">
            <p className={`question_bar ${msgbox===true? "inactive": ""}`} onClick={() => openMsg()}>💬  Ask questions</p>
            {msgbox === true &&
                <div className="chatbox">
                    <div className="header_chat">
                        <p className="assistant_header">Skincare Assistant</p>
                        <p className="closing_header" onClick={closeMsg}>-</p>
                    </div>
                    <div className="chat_container">
                        {newSession === true && 
                            <div className="session_noti_container">
                                <p className="session_noti">Your session has expired. Start new chat</p>
                                <button onClick={handleNewChat} className="new_chat">New Chat</button>
                            </div>
                        }
                        {userMessage.length < 1 && 
                            <div className="prompt">
                                <p className="prompt_thinkbox">💬</p>
                                <p>Hi! I'm your skincare assistant. </p>
                                <p>Ask me anything about your routine!</p>
                                <div className="suggestion_container">
                                    <button className="suggestion_button" onClick={() =>  sendMsg("How do I incorporate these products into my routine?")}>How do I incorporate these products into my routine?</button>
                                    <button className="suggestion_button" onClick={() => handleSimilarProducts()}>Show me similar products</button>
                                </div>
                                {similarProduct === true && <p className="ai_msg">What product do you want to look up? Please ensure to include product name.</p>}
                            </div>}
                        {userMessage.map((x, index) => {
                            if (x.role === "user")
                            {return (
                                <div key={index} className="user_msg_container">
                                    <p className="user_msg">{x.message}</p>
                                </div>
                            )}

                            else 
                            {return (
                                <div key={index} className="ai_msg_container">
                                    <p className="ai_msg">{x.message}</p>
                                </div>

                            )}
                        }
                        )}
                        {loading === true && <p className="ai_msg_loading">Thinking...</p>}
                        {error && <p className="ai_msg_loading">{error}</p>}
                    </div>
                    <div className="input_container">
                        <textarea disabled={newSession===true} onChange={(field) => handleContent(field.target.value)} onKeyDown={(e) => {if(e.key === "Enter" && !e.shiftKey) {e.preventDefault(); sendMsg();}}} className="chat" placeholder="How can I help you today?" value={content}></textarea>
                        <button onClick={sendMsg} className="chat_button">Send</button>
                    </div>
                </div>}
        </div>)
}

export default Chatbox;