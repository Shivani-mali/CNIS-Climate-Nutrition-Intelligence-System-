import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useVoice } from '../hooks/useVoice';
import { speak, getTTSLang } from '../utils/voice';
import { searchKnowledgeBase, formatRAGContext, getRAGStats } from '../utils/ragSearch';

// Built-in knowledge base for offline use
const knowledgeBase = {
    en: {
        greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        responses: {
            greeting: "Hello! I'm **NutriCare Medibot** 🏥✨\n\nI'm your smart AI assistant! I can help you with **anything** you need:\n\n🏥 **Health & Medical** — symptoms, treatments, first aid\n🍼 **Child Nutrition** — feeding, diet, malnutrition\n📏 **Growth Monitoring** — MUAC, weight, height\n💉 **Vaccinations** — schedules, importance\n🤰 **Maternal Health** — pregnancy, breastfeeding\n📚 **General Knowledge** — science, history, education\n💡 **Any Question** — I'm here to help with everything!\n\nAsk me anything! 😊",
            muac: "**MUAC (Mid-Upper Arm Circumference) Guide:**\n\n🔴 **< 11.5 cm = SAM (Severe Acute Malnutrition)**\n- Child needs immediate medical attention\n- Refer to Nutrition Rehabilitation Center\n\n🟠 **11.5 - 12.5 cm = MAM (Moderate)**\n- Enroll in supplementary feeding\n- Weekly monitoring needed\n\n🟢 **> 12.5 cm = Normal**\n- Continue regular growth monitoring\n- Monthly checkups recommended",
            breastfeeding: "**Breastfeeding Guidelines:**\n\n🍼 **0-6 months:** Exclusive breastfeeding\n- No water, no other milk, no food\n- Feed on demand (8-12 times/day)\n\n🍼 **6-24 months:** Continue breastfeeding + complementary foods\n- Start with mashed foods at 6 months\n- Gradually increase texture and variety",
            malnutrition_signs: "**Early Warning Signs of Malnutrition:**\n\n⚠️ **Weight loss** or no weight gain for 2+ months\n⚠️ **Thin arms and legs** - loose skin\n⚠️ **Swollen feet/face** (edema)\n⚠️ **Hair changes** - thin, discolored\n⚠️ **Repeated infections**\n⚠️ **Lethargy** - very weak and inactive\n\n🚨 **DANGER SIGNS - Go to hospital NOW:**\n- Severe swelling of both feet\n- Extreme weakness/unconsciousness\n- Convulsions",
            diet_6_24: "**Complementary Feeding (6-24 months):**\n\n📅 **6-8 months:** 2-3 tablespoons, 2-3 times/day\n📅 **9-11 months:** 1/2 cup, 3-4 times/day + 1 snack\n📅 **12-24 months:** 3/4 to 1 cup, 3-4 times/day + 2 snacks\n\n💡 Add oil/ghee to increase calories!",
            when_doctor: "**When to Visit a Doctor:**\n\n🏥 **Immediately if:**\n- Swollen feet or face\n- Very weak, unable to play\n- Not eating/drinking for 24+ hours\n- High fever (>102°F)\n- Convulsions\n\n📋 **Within a week if:**\n- Not gaining weight for 2 months\n- MUAC between 11.5-12.5 cm\n- Persistent cough for 2+ weeks",
            fever: "**Managing Fever in Children:**\n\n🌡️ **Normal:** 36.5-37.5°C\n⚠️ **Mild fever:** Give fluids, sponge with lukewarm water\n🚨 **High fever (>39°C):** Seek medical attention immediately",
            diarrhea: "**Managing Diarrhea:**\n\n💧 Start ORS immediately\n🍼 Continue breastfeeding\n💊 Zinc supplements for 10-14 days\n\n📋 **ORS Recipe:** 1L water + 6 tsp sugar + ½ tsp salt",
            vaccination: "**Vaccination Schedule (India):**\n\n💉 Birth: BCG, OPV-0, Hep B\n💉 6 weeks: Pentavalent-1, Rotavirus-1\n💉 9 months: MR-1, JE-1\n💉 16-24 months: MR-2, DPT Booster",
            default: "I can help with many topics! Here are some ideas:\n\n1️⃣ **MUAC measurement** — 'MUAC'\n2️⃣ **Child nutrition** — 'diet'\n3️⃣ **Fever or illness** — 'fever'\n4️⃣ **Vaccinations** — 'vaccination'\n5️⃣ **When to see doctor** — 'doctor'\n\nOr ask me any question — health, education, general knowledge, or anything else! 😊"
        }
    },
    hi: {
        greetings: ['नमस्ते', 'हेलो', 'हाय', 'नमस्कार'],
        responses: {
            greeting: "नमस्ते! मैं **NutriCare Medibot** हूं 🏥✨\n\nमैं आपका स्मार्ट AI सहायक हूं! मैं **किसी भी** सवाल में मदद कर सकता हूं:\n\n🏥 **स्वास्थ्य और चिकित्सा** — लक्षण, उपचार, प्राथमिक चिकित्सा\n🍼 **बच्चों का पोषण** — आहार, कुपोषण\n💉 **टीकाकरण** — अनुसूची, महत्व\n📚 **सामान्य ज्ञान** — विज्ञान, इतिहास, शिक्षा\n💡 **कोई भी सवाल** — मैं हर चीज़ में मदद करने के लिए हूं!\n\nकुछ भी पूछें! 😊",
            muac: "**MUAC (मध्य-ऊपरी बांह परिधि) गाइड:**\n\n🔴 **< 11.5 सेमी = SAM (गंभीर तीव्र कुपोषण)**\n- बच्चे को तुरंत चिकित्सा की जरूरत है\n- पोषण पुनर्वास केंद्र में भेजें\n\n🟠 **11.5 - 12.5 सेमी = MAM (मध्यम)**\n- पूरक आहार कार्यक्रम में नामांकन करें\n- साप्ताहिक निगरानी जरूरी है\n\n🟢 **> 12.5 सेमी = सामान्य**\n- नियमित विकास निगरानी जारी रखें\n- मासिक जांच की सिफारिश",
            breastfeeding: "**स्तनपान दिशानिर्देश:**\n\n🍼 **0-6 महीने:** केवल स्तनपान\n- कोई पानी नहीं, कोई अन्य दूध नहीं, कोई खाना नहीं\n- मांग पर दूध पिलाएं (दिन में 8-12 बार)\n\n🍼 **6-24 महीने:** स्तनपान जारी रखें + पूरक आहार\n- 6 महीने पर मसला हुआ खाना शुरू करें\n- धीरे-धीरे बनावट और विविधता बढ़ाएं",
            malnutrition_signs: "**कुपोषण के शुरुआती संकेत:**\n\n⚠️ **वजन कम होना** या 2+ महीने वजन न बढ़ना\n⚠️ **पतले हाथ-पैर** - ढीली त्वचा\n⚠️ **पैरों/चेहरे पर सूजन** (एडिमा)\n⚠️ **बालों में बदलाव** - पतले, रंग बदला\n⚠️ **बार-बार संक्रमण**\n⚠️ **सुस्ती** - बहुत कमजोर और निष्क्रिय\n\n🚨 **खतरे के संकेत - अभी अस्पताल जाएं:**\n- दोनों पैरों में गंभीर सूजन\n- अत्यधिक कमजोरी/बेहोशी\n- दौरे",
            diet_6_24: "**पूरक आहार (6-24 महीने):**\n\n📅 **6-8 महीने:** 2-3 चम्मच, दिन में 2-3 बार\n📅 **9-11 महीने:** 1/2 कप, दिन में 3-4 बार + 1 नाश्ता\n📅 **12-24 महीने:** 3/4 से 1 कप, दिन में 3-4 बार + 2 नाश्ता\n\n💡 कैलोरी बढ़ाने के लिए तेल/घी मिलाएं!",
            when_doctor: "**डॉक्टर के पास कब जाएं:**\n\n🏥 **तुरंत अगर:**\n- पैरों या चेहरे पर सूजन\n- बहुत कमजोर, खेल नहीं पा रहा\n- 24+ घंटे से कुछ नहीं खा/पी रहा\n- तेज बुखार (>102°F)\n- दौरे\n\n📋 **एक हफ्ते में अगर:**\n- 2 महीने से वजन नहीं बढ़ रहा\n- MUAC 11.5-12.5 सेमी के बीच\n- 2+ हफ्ते से लगातार खांसी",
            fever: "**बच्चों में बुखार का प्रबंधन:**\n\n🌡️ **सामान्य:** 36.5-37.5°C\n⚠️ **हल्का बुखार:** तरल पदार्थ दें, गुनगुने पानी से स्पंज करें\n🚨 **तेज बुखार (>39°C):** तुरंत चिकित्सा सहायता लें",
            diarrhea: "**दस्त का प्रबंधन:**\n\n💧 तुरंत ORS शुरू करें\n🍼 स्तनपान जारी रखें\n💊 10-14 दिनों के लिए जिंक की खुराक\n\n📋 **ORS बनाने की विधि:** 1 लीटर पानी + 6 चम्मच चीनी + ½ चम्मच नमक",
            vaccination: "**टीकाकरण अनुसूची (भारत):**\n\n💉 जन्म: BCG, OPV-0, Hep B\n💉 6 सप्ताह: पेंटावैलेंट-1, रोटावायरस-1\n💉 9 महीने: MR-1, JE-1\n💉 16-24 महीने: MR-2, DPT बूस्टर",
            default: "मैं कई विषयों में मदद कर सकता हूं:\n\n1️⃣ **MUAC माप** — 'MUAC'\n2️⃣ **बच्चों का पोषण** — 'आहार'\n3️⃣ **बुखार** — 'बुखार'\n4️⃣ **टीकाकरण** — 'टीकाकरण'\n5️⃣ **डॉक्टर कब जाएं** — 'डॉक्टर'\n\nया कोई भी सवाल पूछें! 😊"
        }
    },
    mr: {
        greetings: ['नमस्कार', 'हॅलो', 'नमस्ते'],
        responses: {
            greeting: "नमस्कार! मी **NutriCare Medibot** आहे 🏥✨\n\nमी तुमचा स्मार्ट AI सहाय्यक आहे! मी **कोणत्याही** प्रश्नात मदत करू शकतो:\n\n🏥 **आरोग्य आणि वैद्यकीय** — लक्षणे, उपचार\n🍼 **मुलांचे पोषण** — आहार, कुपोषण\n💉 **लसीकरण** — वेळापत्रक, महत्व\n📚 **सामान्य ज्ञान** — विज्ञान, इतिहास, शिक्षण\n💡 **कोणताही प्रश्न** — मी सर्व गोष्टींमध्ये मदत करण्यासाठी आहे!\n\nकाहीही विचारा! 😊",
            muac: "**MUAC (मध्य-वरच्या दंडाचा घेर) मार्गदर्शक:**\n\n🔴 **< 11.5 सेमी = SAM (तीव्र गंभीर कुपोषण)**\n- मुलाला तात्काळ वैद्यकीय उपचारांची गरज आहे\n- पोषण पुनर्वसन केंद्रात पाठवा\n\n🟠 **11.5 - 12.5 सेमी = MAM (मध्यम)**\n- पूरक आहार कार्यक्रमात नावनोंदणी करा\n- साप्ताहिक निरीक्षण आवश्यक\n\n🟢 **> 12.5 सेमी = सामान्य**\n- नियमित वाढ निरीक्षण सुरू ठेवा\n- मासिक तपासणी शिफारसीय",
            breastfeeding: "**स्तनपान मार्गदर्शक:**\n\n🍼 **0-6 महिने:** केवळ स्तनपान\n- पाणी नाही, इतर दूध नाही, अन्न नाही\n- मागणीनुसार दूध द्या (दिवसातून 8-12 वेळा)\n\n🍼 **6-24 महिने:** स्तनपान सुरू ठेवा + पूरक आहार\n- 6 महिन्यांवर मऊ अन्न सुरू करा\n- हळूहळू पोत आणि विविधता वाढवा",
            malnutrition_signs: "**कुपोषणाची सुरुवातीची लक्षणे:**\n\n⚠️ **वजन कमी होणे** किंवा 2+ महिने वजन न वाढणे\n⚠️ **बारीक हात-पाय** - सैल त्वचा\n⚠️ **पाय/चेहऱ्यावर सूज** (एडिमा)\n⚠️ **केसांमध्ये बदल** - पातळ, रंग बदललेले\n⚠️ **वारंवार संसर्ग**\n⚠️ **सुस्ती** - खूप अशक्त आणि निष्क्रिय\n\n🚨 **धोक्याची चिन्हे - आत्ताच रुग्णालयात जा:**\n- दोन्ही पायांवर तीव्र सूज\n- अत्यंत अशक्तपणा/बेशुद्धी\n- झटके",
            diet_6_24: "**पूरक आहार (6-24 महिने):**\n\n📅 **6-8 महिने:** 2-3 चमचे, दिवसातून 2-3 वेळा\n📅 **9-11 महिने:** 1/2 कप, दिवसातून 3-4 वेळा + 1 स्नॅक\n📅 **12-24 महिने:** 3/4 ते 1 कप, दिवसातून 3-4 वेळा + 2 स्नॅक\n\n💡 कॅलरी वाढवण्यासाठी तेल/तूप घाला!",
            when_doctor: "**डॉक्टरांकडे कधी जावे:**\n\n🏥 **तात्काळ जर:**\n- पाय किंवा चेहऱ्यावर सूज\n- खूप अशक्त, खेळू शकत नाही\n- 24+ तास काहीही खात/पीत नाही\n- जास्त ताप (>102°F)\n- झटके\n\n📋 **एका आठवड्यात जर:**\n- 2 महिन्यांपासून वजन वाढत नाही\n- MUAC 11.5-12.5 सेमी दरम्यान\n- 2+ आठवडे सतत खोकला",
            fever: "**मुलांमध्ये तापाचे व्यवस्थापन:**\n\n🌡️ **सामान्य:** 36.5-37.5°C\n⚠️ **सौम्य ताप:** द्रवपदार्थ द्या, कोमट पाण्याने स्पंज करा\n🚨 **जास्त ताप (>39°C):** तात्काळ वैद्यकीय मदत घ्या",
            diarrhea: "**जुलाबाचे व्यवस्थापन:**\n\n💧 तात्काळ ORS सुरू करा\n🍼 स्तनपान सुरू ठेवा\n💊 10-14 दिवसांसाठी झिंक पूरक\n\n📋 **ORS बनवण्याची पद्धत:** 1 लिटर पाणी + 6 चमचे साखर + ½ चमचा मीठ",
            vaccination: "**लसीकरण वेळापत्रक (भारत):**\n\n💉 जन्म: BCG, OPV-0, Hep B\n💉 6 आठवडे: पेंटावॅलेंट-1, रोटाव्हायरस-1\n💉 9 महिने: MR-1, JE-1\n💉 16-24 महिने: MR-2, DPT बूस्टर",
            default: "मी अनेक विषयांमध्ये मदत करू शकतो:\n\n1️⃣ **MUAC मापन**\n2️⃣ **मुलांचे पोषण**\n3️⃣ **ताप**\n4️⃣ **लसीकरण**\n5️⃣ **डॉक्टरांना कधी भेटावे**\n\nकिंवा कोणताही प्रश्न विचारा! 😊"
        }
    }
};

function getOfflineResponse(message, lang) {
    const lower = message.toLowerCase().trim();
    const kb = knowledgeBase[lang] || knowledgeBase.en;
    const enResponses = knowledgeBase.en.responses;

    // Helper: return response in selected language if available, else English
    const getResponse = (key) => {
        return kb.responses?.[key] || enResponses[key];
    };

    // Check greetings - use word boundary matching to avoid false positives
    // e.g. "hi" should NOT match inside "this", "which", "history"
    const isGreeting = (greetingList) => {
        return greetingList?.some(g => {
            const regex = new RegExp(`(^|\\s)${g}($|\\s|[!?,.])`, 'i');
            return regex.test(lower) || lower === g;
        });
    };

    if (isGreeting(kb.greetings) || isGreeting(knowledgeBase.en.greetings)) {
        return getResponse('greeting');
    }

    // Health topic matching (offline fallback)
    if (lower.includes('muac') || lower.includes('arm') || lower.includes('बांह') || lower.includes('बाहू')) {
        return getResponse('muac');
    }
    if (lower.includes('breast') || lower.includes('स्तनपान') || lower.includes('dudh') || lower.includes('दूध')) {
        return getResponse('breastfeeding');
    }
    if (lower.includes('sign') || lower.includes('warning') || lower.includes('symptom') || lower.includes('चेतावनी') || lower.includes('संकेत') || lower.includes('लक्षण')) {
        return getResponse('malnutrition_signs');
    }
    if (lower.includes('diet') || lower.includes('food') || lower.includes('feed') || lower.includes('आहार') || lower.includes('खाना') || lower.includes('अन्न')) {
        return getResponse('diet_6_24');
    }
    if (lower.includes('doctor') || lower.includes('hospital') || lower.includes('डॉक्टर') || lower.includes('अस्पताल')) {
        return getResponse('when_doctor');
    }
    if (lower.includes('malnutrition') || lower.includes('कुपोषण') || lower.includes('kuposhan')) {
        return getResponse('malnutrition_signs');
    }
    if (lower.includes('fever') || lower.includes('temperature') || lower.includes('बुखार') || lower.includes('ताप')) {
        return getResponse('fever');
    }
    if (lower.includes('diarrhea') || lower.includes('diarrhoea') || lower.includes('loose motion') || lower.includes('दस्त') || lower.includes('जुलाब')) {
        return getResponse('diarrhea');
    }
    if (lower.includes('vaccin') || lower.includes('immuniz') || lower.includes('टीका') || lower.includes('लसीकरण')) {
        return getResponse('vaccination');
    }

    return getResponse('default');
}

async function getAIResponse(message, lang) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        console.log('[Medibot] No API key, using offline response');
        return { text: getOfflineResponse(message, lang), sources: [] };
    }

    try {
        const langName = lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English';
        console.log('[Medibot] Sending request - Language:', lang, '→', langName);

        // === RAG: Search knowledge base for relevant context ===
        const ragResults = searchKnowledgeBase(message, 5);
        const ragContext = formatRAGContext(ragResults);
        const sourcesUsed = [...new Set(ragResults.map(r => r.source))];

        if (ragResults.length > 0) {
            console.log(`[RAG] Found ${ragResults.length} relevant chunks from: ${sourcesUsed.join(', ')}`);
        } else {
            console.log('[RAG] No relevant chunks found, using general knowledge');
        }

        let systemText = '';
        const ragInstruction = ragContext
            ? `\n\nIMPORTANT: Use the following verified reference material to ground your answer. Cite the source when using specific data. If the reference material doesn't cover the topic, use your general knowledge.\n\n${ragContext}`
            : '';

        if (lang === 'hi') {
            systemText = `तुम CNIS NutriCare Medibot हो। तुम्हें हर जवाब पूरी तरह हिंदी में देना है। कोई भी अंग्रेजी शब्द मत लिखो। सब कुछ हिंदी में लिखो।

तुम किसी भी सवाल का जवाब दे सकते हो - स्वास्थ्य, शिक्षा, सामान्य ज्ञान, कुछ भी।

नियम:
- पूरा जवाब हिंदी में लिखो
- बुलेट पॉइंट्स, बोल्ड टेक्स्ट और इमोजी का उपयोग करो
- दवाई की खुराक मत बताओ, डॉक्टर से मिलने को कहो
- अगर संदर्भ सामग्री दी गई है, तो उसका उपयोग करो और स्रोत का उल्लेख करो
- जवाब के अंत में "📌 **सुझाए गए सवाल:**" के तहत 3-4 फॉलो-अप सवाल हिंदी में लिखो
- जवाब 500 शब्दों से कम रखो${ragInstruction}`;
        } else if (lang === 'mr') {
            systemText = `तुम्ही CNIS NutriCare Medibot आहात. तुम्हाला प्रत्येक उत्तर पूर्णपणे मराठीत द्यायचे आहे. कोणताही इंग्रजी शब्द लिहू नका. सर्व काही मराठीत लिहा.

तुम्ही कोणत्याही प्रश्नाचे उत्तर देऊ शकता - आरोग्य, शिक्षण, सामान्य ज्ञान, काहीही.

नियम:
- संपूर्ण उत्तर मराठीत लिहा
- बुलेट पॉइंट्स, बोल्ड टेक्स्ट आणि इमोजी वापरा
- औषधाचा डोस सांगू नका, डॉक्टरांना भेटायला सांगा
- संदर्भ सामग्री दिली असल्यास, ती वापरा आणि स्रोताचा उल्लेख करा
- उत्तराच्या शेवटी "📌 **सुचवलेले प्रश्न:**" अंतर्गत 3-4 फॉलो-अप प्रश्न मराठीत लिहा
- उत्तर 500 शब्दांपेक्षा कमी ठेवा${ragInstruction}`;
        } else {
            systemText = `You are CNIS NutriCare Medibot, an intelligent AI assistant. You answer ANY question - health, education, general knowledge, anything.

Rules:
- Respond entirely in English
- Use bullet points, bold text, and emojis
- For health: never prescribe dosages, recommend seeing a doctor
- If reference material is provided, use it to ground your answer and cite sources
- End with "📌 **Recommended Questions:**" with 3-4 follow-up questions
- Keep under 500 words${ragInstruction}`;
        }

        const userText = lang === 'hi'
            ? `सवाल (हिंदी में जवाब दो): ${message}`
            : lang === 'mr'
                ? `प्रश्न (मराठीत उत्तर द्या): ${message}`
                : `Question: ${message}`;

        // Try with primary model, then fallback models if rate limited or not found
        const models = ['gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-pro-latest'];

        for (const model of models) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [
                                { role: 'user', parts: [{ text: systemText + '\n\n' + userText }] }
                            ],
                            generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
                        })
                    }
                );

                if (response.status === 429) {
                    console.warn(`[Medibot] Rate limited on ${model}, trying next...`);
                    await new Promise(r => setTimeout(r, 2000));
                    continue;
                }

                if (!response.ok) {
                    const errorData = await response.text();
                    console.error(`[Medibot] API error on ${model}:`, response.status, errorData);
                    continue;
                }

                const data = await response.json();
                const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (answer) {
                    console.log(`[Medibot] Got response from ${model}, length:`, answer.length);
                    return { text: answer, sources: sourcesUsed };
                }
            } catch (fetchErr) {
                console.error(`[Medibot] Fetch error on ${model}:`, fetchErr.message);
            }
        }

        console.error('[Medibot] All models failed, using offline response');
        return { text: getOfflineResponse(message, lang), sources: [] };
    } catch (err) {
        console.error('[Medibot] Error:', err.message);
        return { text: getOfflineResponse(message, lang), sources: [] };
    }
}

export default function ChatbotPage() {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([
        { role: 'bot', text: '', isWelcome: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize welcome message based on language
    useEffect(() => {
        const kb = knowledgeBase[i18n.language] || knowledgeBase.en;
        setMessages([{
            role: 'bot',
            text: kb.responses?.greeting || knowledgeBase.en.responses.greeting,
            isWelcome: true
        }]);
    }, [i18n.language]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendRef = useRef(null);

    const handleVoiceTranscript = useCallback((text) => {
        if (text) {
            setInput(text);
            if (sendRef.current) sendRef.current(text);
        }
    }, []);

    const { isListening, toggleListening } = useVoice(null, handleVoiceTranscript);

    const handleSend = async (text) => {
        const messageText = text || input;
        if (!messageText.trim()) return;

        const userMsg = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const response = await getAIResponse(messageText, i18n.language);

        setIsTyping(false);
        const botMsg = { role: 'bot', text: response.text, sources: response.sources || [] };
        setMessages(prev => [...prev, botMsg]);

        // Read response aloud (first 200 chars)
        speak(response.text.replace(/[*#_`]/g, '').substring(0, 200), getTTSLang(i18n.language));
    };

    // Keep ref updated
    sendRef.current = handleSend;

    const suggestedQuestions = {
        en: [
            'What is MUAC?',
            'Signs of malnutrition',
            'Breastfeeding tips',
            'Vaccination schedule',
            'When to see a doctor?',
            'What is Ayushman Bharat?',
            'How to manage stress?',
            'Tips for child development',
        ],
        hi: [
            'MUAC क्या है?',
            'कुपोषण के लक्षण',
            'बुखार का इलाज',
            'स्तनपान कैसे करें?',
            'टीकाकरण अनुसूची',
            'आयुष्मान भारत क्या है?',
            'तनाव कैसे कम करें?',
            'बच्चे का विकास कैसे करें?',
        ],
        mr: [
            'MUAC म्हणजे काय?',
            'कुपोषणाची लक्षणे',
            'तापावर उपचार',
            'स्तनपान मार्गदर्शन',
            'लसीकरण वेळापत्रक',
            'आयुष्मान भारत म्हणजे काय?',
            'ताण कसा कमी करावा?',
            'मुलांचा विकास कसा करावा?',
        ]
    };

    const questions = suggestedQuestions[i18n.language] || suggestedQuestions.en;

    // Simple markdown renderer
    const renderText = (text) => {
        return text.split('\n').map((line, i) => {
            // Bold
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Remove remaining markdown
            line = line.replace(/[#`]/g, '');

            if (!line.trim()) return <br key={i} />;
            return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: line }} />;
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)] animate-fade-in">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl gradient-clinical flex items-center justify-center shadow-md">
                        <span className="text-2xl">🏥</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">NutriCare Medibot</h2>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                            Online • {i18n.language === 'hi' ? 'हिंदी' : i18n.language === 'mr' ? 'मराठी' : 'English'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary-50 text-clinical-blue text-xs rounded-full font-medium">
                        🏥 Health AI
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto rounded-2xl bg-gray-50/50 border border-gray-100 p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    >
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${msg.role === 'user'
                            ? 'gradient-clinical text-white rounded-br-md'
                            : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
                            }`}>
                            {msg.role === 'bot' && (
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                                    <span className="text-sm">🏥</span>
                                    <span className="text-xs font-semibold text-clinical-blue">Medibot</span>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">📚 RAG</span>
                                    )}
                                    <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full font-medium ml-auto">Health AI</span>
                                </div>
                            )}
                            <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                                {renderText(msg.text)}
                            </div>
                            {msg.role === 'bot' && msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 pt-2 border-t border-gray-100">
                                    <p className="text-[10px] text-gray-400 mb-1">📚 Sources:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {msg.sources.map((src, si) => (
                                            <span key={si} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                                                {src}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-md p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-400">Analyzing your question...</span>
                            </div>
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map(i => (
                                    <div
                                        key={i}
                                        className="w-2.5 h-2.5 rounded-full bg-clinical-blue/40"
                                        style={{ animation: `pulse-soft 1s ease-in-out ${i * 0.2}s infinite` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 py-3">
                    {questions.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(q)}
                            className="px-3 py-1.5 bg-primary-50 text-clinical-blue text-xs font-medium rounded-full hover:bg-primary-100 transition-colors"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 pt-3">
                <button
                    onClick={toggleListening}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${isListening
                        ? 'bg-red-500 text-white voice-active'
                        : 'bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-clinical-blue'
                        }`}
                    title="Voice input"
                >
                    <span className="text-lg">{isListening ? '🔴' : '🎤'}</span>
                </button>

                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('chat_placeholder') || 'Ask any health question...'}
                        className="w-full px-5 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                        id="chat-input"
                    />
                </div>

                <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${input.trim()
                        ? 'gradient-clinical text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-100 text-gray-300'
                        }`}
                    id="chat-send-btn"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[10px] text-gray-400 mt-2 px-4">
                ⚕️ This assistant provides general health information only. It does NOT replace professional medical advice. Always consult a qualified healthcare provider.
            </p>
        </div>
    );
}
