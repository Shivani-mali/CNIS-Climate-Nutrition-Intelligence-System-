import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            app_name: 'CNIS',
            app_full_name: 'Climate-Nutrition Intelligence System',
            tagline: 'AI-Powered Nutrition Intelligence for Every Child',
            login: 'Sign in with Google',
            logout: 'Logout',
            home: 'Home',
            screening: 'Screening',
            reports: 'Reports',
            doses: 'Doses',
            chatbot: 'Medibot',
            profile: 'Profile',
            settings: 'Settings',

            // Role Selection
            select_role: 'Select Your Role',
            asha_worker: 'ASHA Worker',
            parent: 'Parent',
            other: 'Other',
            role_asha_desc: 'Community health worker conducting screenings',
            role_parent_desc: 'Parent or caregiver of a child',
            role_other_desc: 'Researcher, doctor, or other professional',

            // Screening Form
            child_name: 'Child Name',
            child_age: 'Age (months)',
            child_gender: 'Gender',
            male: 'Male',
            female: 'Female',
            height: 'Height (cm)',
            weight: 'Weight (kg)',
            muac: 'MUAC (cm)',
            head_circ: 'Head Circumference (cm)',
            medical_history: 'Medical History',
            diarrhea: 'Diarrhea',
            fever: 'Fever',
            cough: 'Cough',
            edema: 'Edema',
            lethargy: 'Severe Lethargy',
            upload_photo: 'Upload Child Photo',
            start_screening: 'Start Screening',
            save_data: 'Save Data',
            submit: 'Submit',

            // Results
            result: 'Result',
            status: 'Status',
            sam: 'Severe Acute Malnutrition (SAM)',
            mam: 'Moderate Acute Malnutrition (MAM)',
            normal: 'Normal',
            red_zone: 'Red Zone - Immediate Action Required',
            orange_zone: 'Orange Zone - Monitor Closely',
            green_zone: 'Green Zone - Healthy',

            // Diet
            diet_recommendations: 'Diet Recommendations',
            location_detected: 'Location Detected',
            season_detected: 'Season Detected',
            summer: 'Summer',
            winter: 'Winter',
            monsoon: 'Monsoon',
            autumn: 'Autumn',
            local_foods: 'Recommended Local Foods',

            // Warnings
            danger_signs: 'Danger Signs',
            warning_edema: '⚠️ Bilateral pitting edema detected',
            warning_lethargy: '⚠️ Severe lethargy - seek immediate medical attention',
            warning_muac: '⚠️ MUAC below critical threshold',
            seek_medical: 'Please visit the nearest health center immediately',

            // Voice
            voice_listening: 'Listening...',
            voice_command: 'Say a command',
            voice_start: 'Start Screening',
            voice_save: 'Save Data',
            voice_help: 'Help',

            // Chatbot
            chat_placeholder: 'Ask about child nutrition...',
            chat_welcome: 'Hello! I am the CNIS Nutrition Assistant. How can I help you today?',
            chat_send: 'Send',

            // Reports
            total_screenings: 'Total Screenings',
            sam_cases: 'SAM Cases',
            mam_cases: 'MAM Cases',
            normal_cases: 'Normal Cases',
            recent_reports: 'Recent Reports',
            no_reports: 'No reports yet. Start screening to see results.',

            // Photo validation
            invalid_photo: 'Invalid Photo: Please upload a photo of the child.',
            photo_validated: 'Photo validated successfully.',

            // General
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            back: 'Back',
            next: 'Next',
            language: 'Language',
            
            // Action Plan
            action_plan: 'Action Plan',
            feeding: 'Feeding',
            follow_up: 'Follow-up',

            // Recommendations
            rec_red_action: 'URGENT: Refer to nearest health facility immediately',
            rec_red_feeding: 'Therapeutic feeding (F-75/F-100 as per protocol)',
            rec_red_followup: 'Daily monitoring required',
            rec_orange_action: 'Enroll in supplementary feeding program',
            rec_orange_feeding: 'High-energy, nutrient-dense foods with increased frequency',
            rec_orange_followup: 'Weekly monitoring and weight check',
            rec_green_action: 'Continue regular nutrition and growth monitoring',
            rec_green_feeding: 'Age-appropriate balanced diet',
            rec_green_followup: 'Monthly growth monitoring',

            // Doses Page
            vaccination_schedule: 'Vaccination Schedule',
            vaccination_subtitle: 'Track and manage essential childhood immunizations',
            why_its_important: "Why it's important",
            risk_if_missed: 'Risk if missed ⚠️',
            important_note: 'Important Note',
            vaccine_disclaimer: 'This schedule represents the National Immunization Schedule. Always consult with your local health worker or doctor for the exact vaccination timeline recommended for your child. Make sure to carry the child\'s vaccination card to every appointment.',

            // Ages
            age_at_birth: 'At Birth',
            age_6_weeks: '6 Weeks',
            age_10_weeks: '10 Weeks',
            age_14_weeks: '14 Weeks',
            age_9_to_12_months: '9-12 Months',
            age_16_to_24_months: '16-24 Months',

            // Routes
            route_id: 'Intra-dermal',
            route_oral: 'Oral',
            route_im: 'Intra-muscular',
            route_sc: 'Sub-cutaneous',

            // Descriptions
            bcg_desc: 'Bacillus Calmette-Guérin (Tuberculosis)',
            opv_desc: 'Oral Polio Vaccine',
            hepb_desc: 'Hepatitis B birth dose',
            penta_desc: 'DPT, Hep-B, Hib',
            rota_desc: 'Rotavirus vaccine',
            fipv_desc: 'Fractional Inactivated Polio Vaccine',
            mr_desc: 'Measles & Rubella',
            je_desc: 'Japanese Encephalitis',
            pcv_desc: 'Pneumococcal Conjugate Vaccine',
            dpt_desc: 'Diphtheria, Pertussis, Tetanus',
            // Diet Recommendations & UI
            tips: 'Tips',
            saved: 'Saved',
            new: 'New',


            // Importance
            bcg_imp: 'Protects against severe forms of Tuberculosis (TB).',
            opv_imp: 'Prevents Polio, a highly infectious disease causing paralysis.',
            hepb_imp: 'Prevents Hepatitis B, a serious viral liver disease.',
            opv1_imp: 'Builds vital immunity against Polio.',
            penta_imp: 'Protects against 5 major diseases: Diphtheria, Pertussis, Tetanus, Hepatitis B, & Hib.',
            rota_imp: 'Protects against severe diarrhea and dehydration caused by rotavirus.',
            fipv_imp: 'Provides additional, robust immunity against Polio viruses.',
            opv2_imp: 'Continues building immunity against Polio.',
            penta2_imp: 'Strengthens defense against 5 major deadly childhood diseases.',
            rota2_imp: 'Reinforces protection against severe diarrheal disease.',
            opv3_imp: 'Completes the primary series for oral Polio protection.',
            penta3_imp: 'Completes primary defense against 5 major bacterial/viral diseases.',
            rota3_imp: 'Final dose to ensure maximum protection against rotavirus diarrhea.',
            fipv2_imp: 'Enhances systemic immunity against all types of poliovirus.',
            mr_imp: 'Prevents Measles and Rubella (German Measles), highly contagious viral diseases.',
            je_imp: 'Protects against a dangerous viral brain infection spread by mosquitoes.',
            pcv_imp: 'Boosts immunity against pneumococcal pneumonia, meningitis, and ear infections.',
            mr2_imp: 'Ensures lifelong immunity against Measles and Rubella.',
            je2_imp: 'Solidifies defense against Japanese Encephalitis in endemic areas.',
            dpt_imp: 'Boosts waning immunity against 3 severe bacterial infections.',
            opv_booster_imp: 'Extends protection against Polio during the critical early years.',

            // Risks
            bcg_risk: 'High risk of developing severe, life-threatening TB like TB meningitis.',
            opv0_risk: 'Risk of permanent, irreversible paralysis or death from polio infection.',
            hepb_risk: 'Can lead to chronic liver disease, liver failure, or liver cancer later in life.',
            opv1_risk: 'Vulnerability to polio virus causing crippling paralysis.',
            penta_risk: 'High risk of severe respiratory issues, lockjaw, brain damage, and fatal infections.',
            rota_risk: 'Life-threatening dehydration requiring hospitalization.',
            fipv_risk: 'Incomplete immunity against mutated polio strains.',
            opv2_risk: 'Leaves the child unprotected against polio outbreaks.',
            penta2_risk: 'Without all doses, the child is susceptible to fatal Whooping Cough or Tetanus.',
            rota2_risk: 'Child remains at high risk of extreme fluid loss and hospitalization.',
            opv3_risk: 'Fails to reach full immunity, endangering the child during outbreaks.',
            penta3_risk: 'Missing the final primary dose dramatically reduces long-term immunity.',
            rota3_risk: 'Increased chances of getting critically ill from stomach viruses.',
            fipv2_risk: 'Weaker defense against circulating vaccine-derived polioviruses.',
            mr_risk: 'Risk of pneumonia, blindness, brain swelling (Measles), or severe birth defects in future offspring (Rubella).',
            je_risk: 'High chance of permanent neurological damage, seizures, or death.',
            pcv_risk: 'Vulnerability to severe lung/blood infections and fatal meningitis.',
            mr2_risk: 'Immunity may fade, leaving the child exposed to deadly outbreaks.',
            je2_risk: 'Leaves the child at constant risk during mosquito seasons.',
            dpt_risk: 'Child could contract Whooping Cough or Tetanus (from minor cuts).',
            opv_booster_risk: 'Waning immunity increases the risk of paralysis if exposed to polio.'
        }
    },
    hi: {
        translation: {
            app_name: 'CNIS',
            app_full_name: 'जलवायु-पोषण बुद्धिमत्ता प्रणाली',
            tagline: 'हर बच्चे के लिए AI-संचालित पोषण बुद्धिमत्ता',
            login: 'Google से साइन इन करें',
            logout: 'लॉग आउट',
            home: 'होम',
            screening: 'जाँच',
            reports: 'रिपोर्ट',
            doses: 'खुराक',
            chatbot: 'मेडीबॉट',
            profile: 'प्रोफ़ाइल',
            settings: 'सेटिंग्स',

            select_role: 'अपनी भूमिका चुनें',
            asha_worker: 'आशा कार्यकर्ता',
            parent: 'अभिभावक',
            other: 'अन्य',
            role_asha_desc: 'सामुदायिक स्वास्थ्य कार्यकर्ता जाँच कर रही हैं',
            role_parent_desc: 'बच्चे के माता-पिता या देखभालकर्ता',
            role_other_desc: 'शोधकर्ता, डॉक्टर, या अन्य पेशेवर',

            child_name: 'बच्चे का नाम',
            child_age: 'आयु (महीने)',
            child_gender: 'लिंग',
            male: 'लड़का',
            female: 'लड़की',
            height: 'ऊंचाई (सेमी)',
            weight: 'वजन (किलो)',
            muac: 'MUAC (सेमी)',
            head_circ: 'सिर की परिधि (सेमी)',
            medical_history: 'चिकित्सा इतिहास',
            diarrhea: 'दस्त',
            fever: 'बुखार',
            cough: 'खांसी',
            edema: 'सूजन',
            lethargy: 'गंभीर सुस्ती',
            upload_photo: 'बच्चे की तस्वीर अपलोड करें',
            start_screening: 'जाँच शुरू करें',
            save_data: 'डेटा सेव करें',
            submit: 'जमा करें',

            result: 'परिणाम',
            status: 'स्थिति',
            sam: 'गंभीर तीव्र कुपोषण (SAM)',
            mam: 'मध्यम तीव्र कुपोषण (MAM)',
            normal: 'सामान्य',
            red_zone: 'लाल क्षेत्र - तुरंत कार्रवाई आवश्यक',
            orange_zone: 'नारंगी क्षेत्र - ध्यान से निगरानी करें',
            green_zone: 'हरा क्षेत्र - स्वस्थ',

            diet_recommendations: 'आहार सिफारिशें',
            location_detected: 'स्थान पता चला',
            season_detected: 'मौसम पता चला',
            summer: 'गर्मी',
            winter: 'सर्दी',
            monsoon: 'मानसून',
            autumn: 'पतझड़',
            local_foods: 'अनुशंसित स्थानीय खाद्य पदार्थ',

            danger_signs: 'खतरे के संकेत',
            warning_edema: '⚠️ द्विपक्षीय पिटिंग एडिमा पाई गई',
            warning_lethargy: '⚠️ गंभीर सुस्ती - तुरंत चिकित्सा सहायता लें',
            warning_muac: '⚠️ MUAC गंभीर सीमा से नीचे',
            seek_medical: 'कृपया तुरंत निकटतम स्वास्थ्य केंद्र पर जाएं',

            voice_listening: 'सुन रहे हैं...',
            voice_command: 'एक आदेश कहें',
            voice_start: 'जाँच शुरू करें',
            voice_save: 'डेटा सेव करें',
            voice_help: 'मदद',

            chat_placeholder: 'बच्चे के पोषण के बारे में पूछें...',
            chat_welcome: 'नमस्ते! मैं CNIS पोषण सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
            chat_send: 'भेजें',

            total_screenings: 'कुल जाँच',
            sam_cases: 'SAM मामले',
            mam_cases: 'MAM मामले',
            normal_cases: 'सामान्य मामले',
            recent_reports: 'हाल की रिपोर्ट',
            no_reports: 'अभी तक कोई रिपोर्ट नहीं। परिणाम देखने के लिए जाँच शुरू करें।',

            invalid_photo: 'अमान्य फोटो: कृपया बच्चे की फोटो अपलोड करें।',
            photo_validated: 'फोटो सफलतापूर्वक मान्य।',

            loading: 'लोड हो रहा है...',
            error: 'त्रुटि',
            success: 'सफल',
            cancel: 'रद्द करें',
            save: 'सेव करें',
            delete: 'हटाएं',
            back: 'वापस',
            next: 'आगे',
            language: 'भाषा',
            
            // Action Plan
            action_plan: 'कार्य योजना',
            feeding: 'खिलाना (आहार)',
            follow_up: 'अनुवर्ती कार्रवाई (फॉलो-अप)',

            // Recommendations
            rec_red_action: 'तत्काल: तुरंत निकटतम स्वास्थ्य सुविधा से संपर्क करें',
            rec_red_feeding: 'चिकित्सीय आहार (प्रोटोकॉल के अनुसार F-75/F-100)',
            rec_red_followup: 'दैनिक निगरानी आवश्यक है',
            rec_orange_action: 'पूरक पोषण कार्यक्रम में नामांकन करें',
            rec_orange_feeding: 'अधिक आवृत्ति के साथ उच्च ऊर्जा, पोषक तत्वों से भरपूर खाद्य पदार्थ',
            rec_orange_followup: 'साप्ताहिक निगरानी और वजन की जाँच',
            rec_green_action: 'नियमित पोषण और विकास निगरानी जारी रखें',
            rec_green_feeding: 'उम्र के अनुसार संतुलित आहार',
            rec_green_followup: 'मासिक विकास निगरानी',

            // Doses Page
            vaccination_schedule: 'टीकाकरण अनुसूची',
            vaccination_subtitle: 'शिशु टीकाकरण को ट्रैक और प्रबंधित करें',
            why_its_important: 'यह क्यों महत्वपूर्ण है',
            risk_if_missed: 'चूकने का जोखिम ⚠️',
            important_note: 'महत्वपूर्ण सूचना',
            vaccine_disclaimer: 'यह अनुसूची राष्ट्रीय टीकाकरण अनुसूची का प्रतिनिधित्व करती है। अपने बच्चे के लिए अनुशंसित सटीक टीकाकरण समयरेखा के लिए हमेशा अपने स्थानीय स्वास्थ्य कार्यकर्ता या डॉक्टर से परामर्श लें। हर मुलाकात पर बच्चे का टीकाकरण कार्ड ले जाना सुनिश्चित करें।',

            // Ages
            age_at_birth: 'जन्म पर',
            age_6_weeks: '6 सप्ताह',
            age_10_weeks: '10 सप्ताह',
            age_14_weeks: '14 सप्ताह',
            age_9_to_12_months: '9-12 महीने',
            age_16_to_24_months: '16-24 महीने',

            // Routes
            route_id: 'इंट्रा-डर्मल (त्वचा के भीतर)',
            route_oral: 'मौखिक (मुँह से)',
            route_im: 'इंट्रा-मस्कुलर (मांसपेशियों में)',
            route_sc: 'सब-क्यूटेनियस (त्वचा के नीचे)',

            // Descriptions
            bcg_desc: 'बैसिलस कैलमेट-गुएरिन (क्षय रोग)',
            opv_desc: 'ओरल पोलियो वैक्सीन',
            hepb_desc: 'हेपेटाइटिस बी जन्म खुराक',
            penta_desc: 'डीपीटी, हेप-बी, हिब',
            rota_desc: 'रोटावायरस वैक्सीन',
            fipv_desc: 'फ्रैक्शनल इनएक्टिवेटेड पोलियो वैक्सीन',
            mr_desc: 'खसरा और रूबेला',
            je_desc: 'जापानी एन्सेफलाइटिस',
            pcv_desc: 'न्यूमोकोकल कंजुगेट वैक्सीन',
            dpt_desc: 'डिफ्थीरिया, पर्टुसिस, टेटनस',
            // Diet Recommendations & UI
            tips: 'सुझाव',
            saved: 'सहेजा गया',
            new: 'नया',
            '⚠️ Child needs supplementary feeding program': '⚠️ बच्चे को पूरक पोषण (आहार) कार्यक्रम की आवश्यकता है',
            '📋 Weekly monitoring of weight and MUAC required': '📋 वजन और MUAC की साप्ताहिक निगरानी आवश्यक है',
            '🥛 Increase calorie-dense foods in diet': '🥛 आहार में उच्च कैलोरी वाले खाद्य पदार्थ बढ़ाएं',
            '🥚 Add eggs, milk, and nuts if available': '🥚 यदि उपलब्ध हो तो अंडे, दूध और मेवे शामिल करें',

            'Buttermilk (Chaas)': 'छाछ (मट्ठा)',
            'Cooling, probiotic, easy to digest': 'ठंडा, प्रोबायोटिक, पचने में आसान',
            'Calcium, Protein, B12': 'कैल्शियम, प्रोटीन, विटामिन बी12',

            'Jowar Bhakri': 'ज्वार की भाकरी (रोटी)',
            'High fiber, gluten-free energy': 'उच्च फाइबर, ग्लूटेन-मुक्त ऊर्जा',
            'Iron, Fiber, B-vitamins': 'आयरन, फाइबर, बी-विटामिन',

            'Sprouted Moong': 'अंकुरित मूंग',
            'High protein, easy to digest': 'उच्च प्रोटीन, पचने में आसान',
            'Protein, Folate, Iron': 'प्रोटीन, फोलेट, आयरन',

            'Drumstick (Shevga)': 'सहजन (मुनगा)',
            'Nutrient-dense, anti-inflammatory': 'पोषक तत्वों से भरपूर, सूजनरोधी',
            'Vitamin C, Calcium, Iron': 'विटामिन सी, कैल्शियम, आयरन',

            'Kokum Sherbet': 'कोकम शर्बत',
            'Cooling, aids digestion': 'ठंडा, पाचन में सहायक',
            'Antioxidants, Vitamin C': 'एंटीऑक्सीडेंट, विटामिन सी',

            'Watermelon (Kalingad)': 'तरबूज',
            'Hydrating, natural sugars': 'हाइड्रेटिंग (नमी), प्राकृतिक शर्करा',
            'Vitamin A, Lycopene': 'विटामिन ए, लाइकोपीन',

            'Cucumber Raita': 'खीरे का रायता',
            'Cooling, probiotic': 'ठंडा, प्रोबायोटिक',
            'Calcium, Protein': 'कैल्शियम, प्रोटीन',

            'Sattu Drink': 'सत्तू ड्रिंक',
            'Instant energy, cooling': 'तुरंत ऊर्जा, ठंडा',
            'Protein, Iron, Fiber': 'प्रोटीन, आयरन, फाइबर',

            'Increase fluid intake - offer buttermilk, coconut water frequently': 'तरल पदार्थ का सेवन बढ़ाएं - बार-बार छाछ, नारियल पानी दें',
            'Avoid heavy, fried foods during peak summer': 'तेज गर्मी के दौरान भारी, तले हुए खाद्य पदार्थों से बचें',
            'Add a pinch of salt and sugar to drinking water to prevent dehydration': 'डिहाइड्रेशन से बचने के लिए पीने के पानी में एक चुटकी नमक और चीनी मिलाएं',
            'Feed small, frequent meals rather than large ones': 'बड़े भोजन के बजाय छोटे, बार-बार भोजन कराएं',


            // Importance
            bcg_imp: 'टीबी के गंभीर रूपों से बचाता है।',
            opv_imp: 'पोलियो से बचाता है, जो लकवा पैदा करने वाली अत्यधिक संक्रामक बीमारी है।',
            hepb_imp: 'हेपेटाइटिस बी, एक गंभीर वायरल लिवर की बीमारी से बचाता है।',
            opv1_imp: 'पोलियो के खिलाफ महत्वपूर्ण प्रतिरक्षा बनाता है।',
            penta_imp: '5 प्रमुख बीमारियों से बचाता है: डिफ्थीरिया, पर्टुसिस, टेटनस, हेपेटाइटिस बी और हिब।',
            rota_imp: 'रोटावायरस द्वारा होने वाले गंभीर दस्त और निर्जलीकरण से बचाता है।',
            fipv_imp: 'पोलियो वायरस के खिलाफ अतिरिक्त, मजबूत प्रतिरक्षा प्रदान करता है।',
            opv2_imp: 'पोलियो के खिलाफ प्रतिरक्षा बनाना जारी रखता है।',
            penta2_imp: '5 प्रमुख घातक बचपन की बीमारियों के खिलाफ रक्षा को मजबूत करता है।',
            rota2_imp: 'गंभीर दस्त की बीमारी के खिलाफ सुरक्षा को मजबूत करता है।',
            opv3_imp: 'ओरल पोलियो सुरक्षा के लिए प्राथमिक श्रृंखला को पूरा करता है।',
            penta3_imp: '5 प्रमुख जीवाणु/वायरल बीमारियों के खिलाफ प्राथमिक रक्षा को पूरा करता है।',
            rota3_imp: 'रोटावायरस दस्त के खिलाफ अधिकतम सुरक्षा सुनिश्चित करने के लिए अंतिम खुराक।',
            fipv2_imp: 'सभी प्रकार के पोलियोवायरस के खिलाफ प्रणालीगत प्रतिरक्षा को बढ़ाता है।',
            mr_imp: 'खसरा और रूबेला (जर्मन खसरा), अत्यधिक संक्रामक वायरल बीमारियों से बचाता है।',
            je_imp: 'मच्छरों द्वारा फैलने वाले एक खतरनाक वायरल मस्तिष्क संक्रमण से बचाता है।',
            pcv_imp: 'न्यूमोकोकल निमोनिया, मेनिन्जाइटिस और कान के संक्रमण के खिलाफ प्रतिरक्षा को बढ़ाता है।',
            mr2_imp: 'खसरा और रूबेला के खिलाफ आजीवन प्रतिरक्षा सुनिश्चित करता है।',
            je2_imp: 'स्थानिक क्षेत्रों में जापानी एन्सेफलाइटिस के खिलाफ रक्षा को मजबूत करता है।',
            dpt_imp: '3 गंभीर जीवाणु संक्रमणों के खिलाफ कम होती प्रतिरक्षा को बढ़ाता है।',
            opv_booster_imp: 'महत्वपूर्ण शुरुआती वर्षों के दौरान पोलियो से सुरक्षा बढ़ाता है।',

            // Risks
            bcg_risk: 'गंभीर, जीवन-धमकाने वाले टीबी (जैसे टीबी मेनिन्जाइटिस) विकसित होने का उच्च जोखिम।',
            opv0_risk: 'पोलियो संक्रमण से स्थायी, अपरिवर्तनीय लकवा या मृत्यु का जोखिम।',
            hepb_risk: 'बाद के जीवन में पुरानी लिवर की बीमारी, लिवर की विफलता या लिवर कैंसर का कारण बन सकता है।',
            opv1_risk: 'अपंग करने वाले लकवे का कारण बनने वाले पोलियो वायरस के प्रति संवेदनशीलता।',
            penta_risk: 'गंभीर श्वसन संबंधी समस्याएँ, लॉकजॉ, मस्तिष्क क्षति और घातक संक्रमण का उच्च जोखिम।',
            rota_risk: 'जीवन के लिए खतरा पैदा करने वाला निर्जलीकरण जिसके लिए अस्पताल में भर्ती होने की आवश्यकता होती है।',
            fipv_risk: 'उत्परिवर्तित पोलियो स्ट्रेन के खिलाफ अपूर्ण प्रतिरक्षा।',
            opv2_risk: 'बच्चे को पोलियो के प्रकोप से असुरक्षित छोड़ देता है।',
            penta2_risk: 'सभी खुराक के बिना, बच्चा घातक काली खांसी या टेटनस के प्रति संवेदनशील होता है।',
            rota2_risk: 'बच्चे को अत्यधिक तरल पदार्थ की हानि और अस्पताल में भर्ती होने का उच्च जोखिम रहता है।',
            opv3_risk: 'पूर्ण प्रतिरक्षा तक पहुंचने में विफल रहता है, जिससे प्रकोपों के दौरान बच्चा खतरे में पड़ जाता है।',
            penta3_risk: 'अंतिम प्राथमिक खुराक के छूटने से दीर्घकालिक प्रतिरक्षा काफी कम हो जाती है।',
            rota3_risk: 'पेट के वायरस से गंभीर रूप से बीमार होने की संभावना बढ़ जाती है।',
            fipv2_risk: 'वैक्सीन-व्युत्पन्न पोलियोविषाणुओं का संचार करने वालों के खिलाफ कमजोर रक्षा।',
            mr_risk: 'निमोनिया, अंधापन, मस्तिष्क में सूजन (खसरा) का जोखिम, या भविष्य की संतानों में गंभीर जन्म दोष (रूबेला)।',
            je_risk: 'स्थायी न्यूरोलॉजिकल क्षति, दौरे, या मृत्यु की उच्च संभावना।',
            pcv_risk: 'गंभीर फेफड़े/रक्त संक्रमण और घातक मेनिन्जाइटिस के प्रति संवेदनशीलता।',
            mr2_risk: 'प्रतिरक्षा कम हो सकती है, जिससे बच्चा घातक प्रकोपों के संपर्क में आ सकता है।',
            je2_risk: 'मच्छर के मौसम के दौरान बच्चे को लगातार जोखिम में छोड़ देता है।',
            dpt_risk: 'बच्चा काली खांसी या टेटनस (मामूली कटौती से) का अनुबंध कर सकता है।',
            opv_booster_risk: 'कम होती प्रतिरक्षा पोलियो के संपर्क में आने पर लकवे का खतरा बढ़ाती है।'
        }
    },
    mr: {
        translation: {
            app_name: 'CNIS',
            app_full_name: 'हवामान-पोषण बुद्धिमत्ता प्रणाली',
            tagline: 'प्रत्येक मुलासाठी एआय-शक्तीवर आधारित पोषण बुद्धिमत्ता',
            login: 'Google ने साइन इन करा',
            logout: 'लॉग आउट',
            home: 'मुख्यपृष्ठ',
            screening: 'तपासणी',
            reports: 'अहवाल',
            doses: 'डोस',
            chatbot: 'मेडीबॉट',
            profile: 'प्रोफाइल',
            settings: 'सेटिंग्ज',

            select_role: 'तुमची भूमिका निवडा',
            asha_worker: 'आशा कार्यकर्ती',
            parent: 'पालक',
            other: 'इतर',
            role_asha_desc: 'तपासणी करणारी सामुदायिक आरोग्य कार्यकर्ती',
            role_parent_desc: 'मुलाचे पालक किंवा काळजीवाहक',
            role_other_desc: 'संशोधक, डॉक्टर, किंवा इतर व्यावसायिक',

            child_name: 'मुलाचे नाव',
            child_age: 'वय (महिने)',
            child_gender: 'लिंग',
            male: 'मुलगा',
            female: 'मुलगी',
            height: 'उंची (सेमी)',
            weight: 'वजन (किलो)',
            muac: 'MUAC (सेमी)',
            head_circ: 'डोक्याचा घेर (सेमी)',
            medical_history: 'वैद्यकीय इतिहास',
            diarrhea: 'जुलाब',
            fever: 'ताप',
            cough: 'खोकला',
            edema: 'सूज',
            lethargy: 'तीव्र सुस्ती',
            upload_photo: 'मुलाचा फोटो अपलोड करा',
            start_screening: 'तपासणी सुरू करा',
            save_data: 'डेटा सेव्ह करा',
            submit: 'सबमिट करा',

            result: 'निकाल',
            status: 'स्थिती',
            sam: 'तीव्र गंभीर कुपोषण (SAM)',
            mam: 'मध्यम तीव्र कुपोषण (MAM)',
            normal: 'सामान्य',
            red_zone: 'लाल क्षेत्र - तात्काळ कारवाई आवश्यक',
            orange_zone: 'नारंगी क्षेत्र - बारकाईने निरीक्षण करा',
            green_zone: 'हिरवा क्षेत्र - निरोगी',

            diet_recommendations: 'आहार शिफारसी',
            location_detected: 'स्थान आढळले',
            season_detected: 'ऋतू आढळला',
            summer: 'उन्हाळा',
            winter: 'हिवाळा',
            monsoon: 'पावसाळा',
            autumn: 'शरद ऋतू',
            local_foods: 'शिफारस केलेले स्थानिक अन्न',

            danger_signs: 'धोक्याची चिन्हे',
            warning_edema: '⚠️ द्विपक्षीय पिटिंग एडिमा आढळली',
            warning_lethargy: '⚠️ तीव्र सुस्ती - तात्काळ वैद्यकीय मदत घ्या',
            warning_muac: '⚠️ MUAC गंभीर मर्यादेखाली',
            seek_medical: 'कृपया तात्काळ जवळच्या आरोग्य केंद्राला भेट द्या',

            voice_listening: 'ऐकत आहे...',
            voice_command: 'एक आदेश सांगा',
            voice_start: 'तपासणी सुरू करा',
            voice_save: 'डेटा सेव्ह करा',
            voice_help: 'मदत',

            chat_placeholder: 'मुलाच्या पोषणाबद्दल विचारा...',
            chat_welcome: 'नमस्कार! मी CNIS पोषण सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?',
            chat_send: 'पाठवा',

            total_screenings: 'एकूण तपासण्या',
            sam_cases: 'SAM प्रकरणे',
            mam_cases: 'MAM प्रकरणे',
            normal_cases: 'सामान्य प्रकरणे',
            recent_reports: 'अलीकडील अहवाल',
            no_reports: 'अजून कोणतेही अहवाल नाहीत. निकाल पाहण्यासाठी तपासणी सुरू करा.',

            invalid_photo: 'अवैध फोटो: कृपया मुलाचा फोटो अपलोड करा.',
            photo_validated: 'फोटो यशस्वीरित्या प्रमाणित.',

            loading: 'लोड होत आहे...',
            error: 'त्रुटी',
            success: 'यशस्वी',
            cancel: 'रद्द करा',
            save: 'सेव्ह करा',
            delete: 'हटवा',
            back: 'मागे',
            next: 'पुढे',
            language: 'भाषा',
            
            // Action Plan
            action_plan: 'कृती योजना',
            feeding: 'आहार',
            follow_up: 'फॉलो-अप',

            // Recommendations
            rec_red_action: 'तात्काळ: ताबडतोब जवळच्या आरोग्य केंद्राशी संपर्क साधा',
            rec_red_feeding: 'उपचारात्मक आहार (प्रोटोकॉलनुसार F-75/F-100)',
            rec_red_followup: 'दररोज निरीक्षण करणे आवश्यक आहे',
            rec_orange_action: 'पूरक पोषण कार्यक्रमात नोंदणी करा',
            rec_orange_feeding: 'अधिक वेळा उच्च ऊर्जा, पोषक तत्वांनी युक्त अन्न द्या',
            rec_orange_followup: 'आठवडाभरात वजन तपासणी आणि निरीक्षण',
            rec_green_action: 'नियमित पोषण व वाढीचे निरीक्षण चालू ठेवा',
            rec_green_feeding: 'वयानुसार योग्य आणि संतुलित आहार',
            rec_green_followup: 'मासिक वाढीचे निरीक्षण',

            // Doses Page
            vaccination_schedule: 'लसीकरण वेळापत्रक',
            vaccination_subtitle: 'मुलांच्या महत्त्वपूर्ण लसीकरणाचा मागोवा घ्या',
            why_its_important: 'ते महत्त्वाचे का आहे',
            risk_if_missed: 'चुकल्यास धोका ⚠️',
            important_note: 'महत्त्वाची सूचना',
            vaccine_disclaimer: 'हे वेळापत्रक राष्ट्रीय लसीकरण वेळापत्रक दर्शवते. तुमच्या मुलासाठी सुचवलेल्या नेमक्या लसीकरण वेळेसाठी नेहमी तुमच्या स्थानिक आरोग्य कार्यकर्त्याचा किंवा डॉक्टरांचा सल्ला घ्या. प्रत्येक भेटीच्या वेळी मुलाचे लसीकरण कार्ड सोबत ठेवण्याची खात्री करा.',

            // Ages
            age_at_birth: 'जन्माच्या वेळी',
            age_6_weeks: '6 आठवडे',
            age_10_weeks: '10 आठवडे',
            age_14_weeks: '14 आठवडे',
            age_9_to_12_months: '9-12 महिने',
            age_16_to_24_months: '16-24 महिने',

            // Routes
            route_id: 'इंट्रा-डर्मल (त्वचेमध्ये)',
            route_oral: 'तोंडी',
            route_im: 'इंट्रा-मस्कुलर (स्नायूमध्ये)',
            route_sc: 'सब-क्युटेनियस (त्वचेखाली)',

            // Descriptions
            bcg_desc: 'बॅसिलस कॅलमेट-गुएरिन (क्षयरोग)',
            opv_desc: 'ओरल पोलिओ लस',
            hepb_desc: 'हेपेटायटीस बी चा जन्म डोस',
            penta_desc: 'डीपीटी, हेप-बी, हिब',
            rota_desc: 'रोटाव्हायरस लस',
            fipv_desc: 'फ्रॅक्शनल इनअॅक्टिव्हेटेड पोलिओ लस',
            mr_desc: 'गोवर आणि रुबेला',
            je_desc: 'जपानी एन्सेफलायटीस',
            pcv_desc: 'न्यूमोकोकल कॉन्जुगेट लस',
            dpt_desc: 'घटसर्प, डांग्या खोकला, धनुर्वात',
            // Diet Recommendations & UI
            tips: 'टिपा',
            saved: 'सेव्ह केले',
            new: 'नवीन',
            '⚠️ Child needs supplementary feeding program': '⚠️ मुलाला पूरक आहार कार्यक्रमाची आवश्यकता आहे',
            '📋 Weekly monitoring of weight and MUAC required': '📋 वजन आणि MUAC चे साप्ताहिक निरीक्षण आवश्यक आहे',
            '🥛 Increase calorie-dense foods in diet': '🥛 आहारात उच्च-कॅलरीयुक्त अन्न वाढवा',
            '🥚 Add eggs, milk, and nuts if available': '🥚 उपलब्ध असल्यास अंडी, दूध आणि सुकामेवा द्या',

            'Buttermilk (Chaas)': 'ताक (छास)',
            'Cooling, probiotic, easy to digest': 'थंड, प्रोबायोटिक, पचायला सोपे',
            'Calcium, Protein, B12': 'कॅल्शियम, प्रथिने, B12',

            'Jowar Bhakri': 'ज्वारीची भाकरी',
            'High fiber, gluten-free energy': 'उच्च फायबर, ग्लूटेन-मुक्त ऊर्जा',
            'Iron, Fiber, B-vitamins': 'लोह, फायबर, बी-जीवनसत्त्वे',

            'Sprouted Moong': 'मोड आलेले मूग',
            'High protein, easy to digest': 'उच्च प्रथिने, पचायला सोपे',
            'Protein, Folate, Iron': 'प्रथिने, फोलेट, लोह',

            'Drumstick (Shevga)': 'शेवगा',
            'Nutrient-dense, anti-inflammatory': 'पोषक तत्वांनी समृद्ध, दाहक-विरोधी',
            'Vitamin C, Calcium, Iron': 'क जीवनसत्व, कॅल्शियम, लोह',

            'Kokum Sherbet': 'कोकम सरबत',
            'Cooling, aids digestion': 'थंड, पचन सुधारते',
            'Antioxidants, Vitamin C': 'अँटिऑक्सिडंट्स, क जीवनसत्व',

            'Watermelon (Kalingad)': 'कलिंगड',
            'Hydrating, natural sugars': 'हायड्रेटिंग, नैसर्गिक साखरा',
            'Vitamin A, Lycopene': 'अ जीवनसत्व, लायकोपीन',

            'Cucumber Raita': 'काकडीचा रायता',
            'Cooling, probiotic': 'थंड, प्रोबायोटिक',
            'Calcium, Protein': 'कॅल्शियम, प्रथिने',

            'Sattu Drink': 'सत्तूचे पेय',
            'Instant energy, cooling': 'त्वरित ऊर्जा, थंड',
            'Protein, Iron, Fiber': 'प्रथिने, लोह, फायबर',

            'Increase fluid intake - offer buttermilk, coconut water frequently': 'द्रवपदार्थाचे सेवन वाढवा - वारंवार ताक, नारळपाणी द्या',
            'Avoid heavy, fried foods during peak summer': 'कडक उन्हाळ्यात जड, तळलेले अन्न टाळा',
            'Add a pinch of salt and sugar to drinking water to prevent dehydration': 'डिहायड्रेशन टाळण्यासाठी पिण्याच्या पाण्यात चिमूटभर मीठ आणि साखर घाला',
            'Feed small, frequent meals rather than large ones': 'एकाच वेळी जास्त खाण्यापेक्षा थोडे-थोडे आणि वारंवार खाऊ घाला',


            // Importance
            bcg_imp: 'क्षयरोगाच्या गंभीर स्वरूपापासून संरक्षण करते.',
            opv_imp: 'पोलिओला प्रतिबंधित करते, हा लकवा निर्माण करणारा अत्यंत संसर्गजन्य आजार आहे.',
            hepb_imp: 'हेपेटायटीस बी ला प्रतिबंधित करते, हा यकृताचा एक गंभीर विषाणूजन्य आजार आहे.',
            opv1_imp: 'पोलिओ विरुद्ध महत्त्वपूर्ण प्रतिकारशक्ती तयार करते.',
            penta_imp: '5 प्रमुख आजारांपासून संरक्षण करते: घटसर्प, डांग्या खोकला, धनुर्वात, हेपेटायटीस बी आणि हिब.',
            rota_imp: 'रोटाव्हायरसमुळे होणारी तीव्र जुलाब आणि निर्जलीकरण यापासून संरक्षण करते.',
            fipv_imp: 'पोलिओ विषाणूंच्या विरुद्ध अतिरिक्त, मजबूत प्रतिकारशक्ती प्रदान करते.',
            opv2_imp: 'पोलिओ विरुद्ध प्रतिकारशक्ती निर्माण करणे सुरू ठेवते.',
            penta2_imp: '5 प्रमुख घातक बालपणीच्या आजारांविरुद्ध संरक्षण मजबूत करते.',
            rota2_imp: 'गंभीर जुलाब आजाराविरूद्ध संरक्षण मजबूत करते.',
            opv3_imp: 'तोंडी पोलिओ संरक्षणासाठी प्राथमिक मालिका पूर्ण करते.',
            penta3_imp: '5 प्रमुख जीवाणूजन्य/विषाणूजन्य आजारांविरुद्ध प्राथमिक संरक्षण पूर्ण करते.',
            rota3_imp: 'रोटाव्हायरस जुलाबापासून जास्तीत जास्त संरक्षण सुनिश्चित करण्यासाठी अंतिम डोस.',
            fipv2_imp: 'सर्व प्रकारच्या पोलिओविषाणूंविरूद्ध पद्धतशीर प्रतिकारशक्ती वाढवते.',
            mr_imp: 'गोवर आणि रुबेला (जर्मन गोवर), अत्यंत संसर्गजन्य विषाणूजन्य आजार प्रतिबंधित करते.',
            je_imp: 'डासांमुळे पसरणाऱ्या मेंदूच्या धोकादायक संसर्गापासून रक्षण करते.',
            pcv_imp: 'न्यूमोकोकल न्यूमोनिया, मेनिन्जायटीस आणि कानाच्या संसर्गाविरुद्ध प्रतिकारशक्ती वाढवते.',
            mr2_imp: 'गोवर आणि रुबेला विरूद्ध आजीवन प्रतिकारशक्ती सुनिश्चित करते.',
            je2_imp: 'स्थानिक भागात जपानी एन्सेफलायटीस विरुद्ध संरक्षण मजबूत करते.',
            dpt_imp: '3 गंभीर जीवाणू संसर्गाविरूद्ध कमी होणारी प्रतिकारशक्ती वाढवते.',
            opv_booster_imp: 'महत्त्वाच्या सुरुवातीच्या वर्षांमध्ये पोलिओ विरुद्ध संरक्षण वाढवते.',

            // Risks
            bcg_risk: 'टीबी मेनिन्जायटीससारख्या गंभीर, जीवघेणा टीबी विकसित होण्याचा उच्च धोका.',
            opv0_risk: 'पोलिओ संसर्गामुळे कायमचा, न बदलणारा लकवा किंवा मृत्यू होण्याचा धोका.',
            hepb_risk: 'नंतरच्या आयुष्यात यकृताचा जुनाट आजार, यकृत निकामी होणे किंवा यकृताचा कर्करोग होऊ शकतो.',
            opv1_risk: 'अपंगत्व आणणाऱ्या पोलिओ विषाणूची संवेदनशीलता.',
            penta_risk: 'श्वसनाच्या तीव्र समस्या, लॉकजॉ, मेंदूला इजा आणि घातक संसर्ग होण्याचा उच्च धोका.',
            rota_risk: 'जीवघेणी डिहायड्रेशन ज्यासाठी रुग्णालयात दाखल करावे लागेल.',
            fipv_risk: 'बदललेल्या पोलिओ स्ट्रेन विरुद्ध अपूर्ण संरक्षण.',
            opv2_risk: 'लस न दिल्यास मुलाला पोलिओच्या प्रादुर्भावापासून असुरक्षित सोडते.',
            penta2_risk: 'या डोसशिवाय, मुलास घातक डांग्या खोकला किंवा धनुर्वात होण्याची शक्यता असते.',
            rota2_risk: 'मुलामध्ये शरीरातील द्रव कमी होण्याचा आणि रुग्णालयात भरती होण्याचा उच्च धोका कायम असतो.',
            opv3_risk: 'पूर्ण प्रतिकारशक्ती मिळवण्यात अयशस्वी, प्रादुर्भावाच्या वेळी मुलाला धोक्यात आणते.',
            penta3_risk: 'अंतिम प्राथमिक डोस न घेतल्याने दीर्घकालीन प्रतिकारशक्ती खूप कमी होते.',
            rota3_risk: 'पोटाच्या विषाणूंमुळे गंभीरपणे आजारी पडण्याची शक्यता वाढते.',
            fipv2_risk: 'लसीपासून-व्युत्पन्न झालेले पोलिओविषाणू विरुद्ध कमकुवत बचाव.',
            mr_risk: 'न्यूमोनिया, अंधत्व, मेंदूला सूज (गोवर) किंवा भविष्यातील संततीमध्ये जन्मजात दोष (रुबेला) होण्याचा धोका.',
            je_risk: 'कायमचे न्यूरोलॉजिकल नुकसान, फेपरे किंवा मृत्यूची दाट शक्यता.',
            pcv_risk: 'गंभीर फुफ्फुस/रक्ताचे आजार आणि घातक मेनिन्जायटीस होण्याचा धोका.',
            mr2_risk: 'प्रतिकारशक्ती कमी होऊ शकते, ज्यामुळे मुलाला जीवघेण्या प्रादुर्भावाचा धोका राहतो.',
            je2_risk: 'डासांच्या हंगामात मुलाला कायमचा धोका राहतो.',
            dpt_risk: 'मुलाला डांग्या खोकला किंवा धनुर्वात (किरकोळ जखमेमुळे) होऊ शकतो.',
            opv_booster_risk: 'कमी होणाऱ्या प्रतिकारशक्तीमुळे पोलिओच्या संपर्कात आल्यास लकवा होण्याचा धोका वाढतो.'
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('cnis_language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

// Persist language changes
i18n.on('languageChanged', (lang) => {
    localStorage.setItem('cnis_language', lang);
    console.log('[i18n] Language changed to:', lang);
});

export default i18n;
