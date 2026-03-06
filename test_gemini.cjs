const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = "AIzaSyCydmunUA-1jNihJvS9gZCbBMlVK1IVtFg";

async function testGeminiWithImage() {
  console.log("Reading test image...");
  // Let's use logo.png or create a dummy 1x1 base64
  const imagePath = path.join(__dirname, 'logo.png');
  let base64 = "";
  try {
      if (fs.existsSync(imagePath)) {
          console.log("Found logo.png, using it.");
          const buffer = fs.readFileSync(imagePath);
          base64 = buffer.toString('base64');
      } else {
           console.log("No image found, using a dummy 1x1 pixel.");
           // 1x1 black png
           base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
      }
  } catch (e) {
      console.error("Error reading image:", e);
      return;
  }

  const prompt = `Analyze this photo carefully and respond ONLY in valid JSON format. Do not include markdown formatting.

Check the following:
1. Is there a person visible in this photo?
2. If yes, is the person a child (approximately 0-5 years old)?
3. If yes, what appears to be the child's gender?
4. Is the photo clear enough for medical/health screening purposes?
5. CRITICAL: Look very closely for any visual signs of malnutrition. Do you see severe wasting (extremely thin limbs, loose skin), visibly prominent ribs, or edema (swelling, especially in the belly or feet)?

The expected gender selected by the parent is: unknown

Respond in this exact JSON format:
{
  "isPerson": true or false,
  "isChild": true or false,
  "estimatedAge": "baby/toddler/young child/older child/adult/unknown",
  "detectedGender": "male/female/unknown",
  "genderMatch": true or false,
  "photoQuality": "good/fair/poor",
  "confidence": 0.0 to 1.0,
  "description": "brief description of what you see",
  "visibleMalnutritionSigns": true or false,
  "malnutritionDetails": "describe any visual signs of malnutrition observed, or state none observed. Be clinical but clear."
}`;

  console.log("Sending request to Gemini API...");
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg', // wait, logo.png is png. Let's just pass png
                  data: base64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 512
          }
        })
      }
    );

    if (!response.ok) {
        const errortext = await response.text();
        console.error("API failed with status", response.status);
        console.error(errortext);
        return;
    }

    const data = await response.json();
    console.log("Success! Raw Response Data:", JSON.stringify(data, null, 2));
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log("\nExtracted text:\n", text);
    
    // Test our parsing logic
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
    }
    jsonStr = jsonStr.trim();
    console.log("\nParsed JSON:", JSON.parse(jsonStr));
    
  } catch (error) {
    console.error("Fetch or Parse error:", error);
  }
}

testGeminiWithImage();
