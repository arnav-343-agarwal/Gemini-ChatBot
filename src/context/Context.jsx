import { createContext, useState } from "react"; //hook
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) =>{
    
    const [input , setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult , setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");

    const delayPara = (index,nextWord)=>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        }, 75*index);
    }

    const onSent = async () => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);
        setPrevPrompts(prev=>[...prev,input])
        try {
            const response = await run(input);
    
            // Check if response is a string before using split
            let responseText = typeof response === "string" ? response : JSON.stringify(response);
    
            let responseArray = responseText.split("**");
            let newResponse = "";
            
            for (let i = 0; i < responseArray.length; i++) {
                if (i===0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            let newResponse2 = newResponse.split("*").join("</br>")
            let newResponseArray = newResponse2.split(" ")
            setResultData("");
            for(let i=0;i<newResponseArray.length;i++){
                const nextWord = newResponseArray[i];
                delayPara(i,nextWord+" ");
            }
            setResultData(newResponse2);
        } catch (error) {
            console.error("Error fetching response: ", error);
            setResultData("An error occurred. Please try again.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };
    

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    
    )
}
export default ContextProvider