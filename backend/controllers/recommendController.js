import foodModel from "../models/foodModel.js";

const recommendCombo = async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.json({
                success: false,
                message: "Please add GEMINI_API_KEY to your backend .env file to enable the AI Plate Builder."
            });
        }

        const { prompt } = req.body;
        if (!prompt) {
            return res.json({ success: false, message: "Prompt is required" });
        }

        // Fetch all available food items from database
        const menuItems = await foodModel.find({});
        if (menuItems.length === 0) {
            return res.json({ success: false, message: "No food items found in the menu database" });
        }

        // Prepare menu context for Gemini
        const menuContext = menuItems.map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category
        }));

        // Construct request payload for Gemini 3.5 Flash
        const systemPrompt = `You are a culinary AI Plate Builder assistant for the Food-D app. 
Analyze the user's query and recommend a custom combination/combo of food items from the provided menu list that satisfies their constraints (such as budget, mood, protein, dietary preferences like dairy-free, vegetarian, etc.).

Menu List:
${JSON.stringify(menuContext)}

User Query: "${prompt}"

Rules:
1. Only recommend items that exist in the Menu List.
2. The combined price of all recommended items must strictly satisfy any budget constraints in the query (if mentioned).
3. Provide a helpful, Appetite-inducing reason explaining why this specific combo was chosen.
4. You MUST respond with a JSON object in this exact schema structure:
{
  "success": true,
  "recommendation": "Short reason explaining why this combination fits their query",
  "items": [
    {
      "id": "item_mongodb_id",
      "name": "Item Name",
      "quantity": 1,
      "price": 120
    }
  ],
  "totalPrice": 120
}
Ensure you return only the JSON object. Do not wrap in markdown code blocks like \`\`\`json.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(geminiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: systemPrompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const responseData = await response.json();
        
        if (!response.ok || !responseData.candidates || responseData.candidates.length === 0) {
            console.error("Gemini API Error:", responseData);
            return res.json({ success: false, message: "Error calling AI service. Check your API key." });
        }

        // Extract JSON text output
        const textResponse = responseData.candidates[0].content.parts[0].text;
        const result = JSON.parse(textResponse.trim());

        res.json(result);

    } catch (error) {
        console.error("AI Recommendation Error:", error);
        res.json({ success: false, message: "Server error generating recommendations" });
    }
};

export { recommendCombo };
