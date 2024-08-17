import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        console.log("Initialized GoogleGenerativeAI");
        try {
            const model = await genAI.getGenerativeModel({model: "gemini-1.5-flash"});
            const body = req.body
            const lastMsg = body[body.length - 1]
            const prompt = `
            You are an expert on the Olympics, capable of providing detailed information on Olympic history, athletes, records, and more.
            However, you should engage in a conversational manner, keeping responses brief and relevant to the user's message unless they specifically ask for detailed Olympic-related information.

            User's input: "${lastMsg?.content || 'No content'}`;

            const response = await model.generateContent(prompt);
            console.log("Received response from AI:", response);

            const candidates = response?.response?.candidates;
            console.log("Candidates:", JSON.stringify(candidates, null, 2));

            const text = candidates?.[0]?.content?.parts?.[0]?.text || "No response...";
            return res.status(200).json({ text });
        } 
    
        catch (error) {
            console.error("Error generating AI response:", error);
            res.status(500).json({ error: "Failed to generate text", details: error.message });
        }
    } 
  
    else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
