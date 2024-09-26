/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const apiKey = "AIzaSyAli2G5g6vSMugX4SCXgF3bnsPBysTKA0E";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(prompt) {
    const chatSession = model.startChat({
        generationConfig,
        // Uncomment and configure safetySettings if necessary
        // safetySettings: {
        //     harmCategory: HarmCategory.DEFAULT,
        //     harmBlockThreshold: HarmBlockThreshold.DEFAULT,
        // },
        history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    // Ensure result.response.text is defined and correct
    if (result && result.response && typeof result.response.text === 'function') {
        return result.response.text();
    } else {
        console.error("Unexpected response structure:", result);
        throw new Error("Failed to retrieve generated text");
    }
}

  
  export default run;