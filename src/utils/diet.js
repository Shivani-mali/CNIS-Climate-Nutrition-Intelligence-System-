/**
 * Location & Climate-Based Diet Recommendation Engine
 * Auto-detects location and season, provides localized food recommendations
 */

/**
 * Detect current season based on month
 */
export function detectSeason(month = new Date().getMonth()) {
    // Indian seasons mapping
    if (month >= 2 && month <= 4) return 'summer';      // March - May
    if (month >= 5 && month <= 8) return 'monsoon';      // June - September
    if (month >= 9 && month <= 10) return 'autumn';      // October - November
    return 'winter';                                       // December - February
}

export async function detectLocation() {
    return new Promise((resolve) => {
        const fetchAddressFromCoords = async (latitude, longitude) => {
            let state, city = '', fullAddress = '';
            try {
                // First try OpenStreetMap API (Nominatim)
                // Use zoom=18 to get street/building level detail instead of coarse area
                const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18`);
                const nomData = await nomRes.json();
                state = nomData.address?.state || mapCoordsToState(latitude, longitude);
                city = nomData.address?.city || nomData.address?.town || nomData.address?.village || '';
                
                // Construct a cleaner address manually instead of using display_name, which can be overly long or poorly formatted
                const addr = nomData.address || {};
                const localArea = addr.road || addr.suburb || addr.neighbourhood || addr.village || '';
                const cityArea = city || addr.county || addr.state_district || '';
                
                const parts = [
                    addr.house_number, 
                    localArea, 
                    cityArea, 
                    state, 
                    addr.postcode
                ].filter(Boolean);
                
                fullAddress = parts.join(', ') || nomData.display_name || '';
                
                if (city === 'Unknown') city = '';
                return { state, city, address: fullAddress, latitude, longitude, detected: true };
            } catch (errNom) {
                console.warn('Nominatim failed:', errNom);
                try {
                    // Fallback to BigDataCloud
                    const bdcRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const bdcData = await bdcRes.json();
                    state = bdcData.principalSubdivision || mapCoordsToState(latitude, longitude);
                    city = bdcData.city || bdcData.locality || '';
                    if (city === 'Unknown') city = '';
                    fullAddress = city ? `${city}, ${state}` : state;
                    return { state, city, address: fullAddress, latitude, longitude, detected: true };
                } catch (errBdc) {
                    console.warn('BigDataCloud failed:', errBdc);
                    state = mapCoordsToState(latitude, longitude);
                    return { state, city: '', address: '', latitude, longitude, detected: true };
                }
            }
        };

        const tryIpFallback = async () => {
            try {
                // IP Geolocation Fallback
                const ipRes = await fetch('https://ipapi.co/json/');
                const ipData = await ipRes.json();
                
                if (ipData && ipData.latitude && ipData.longitude) {
                    const result = await fetchAddressFromCoords(ipData.latitude, ipData.longitude);
                    // If OSM failed to find address, use IP data instead
                    if (!result.address && ipData.city) {
                        result.address = [ipData.city, ipData.region, ipData.country_name].filter(Boolean).join(', ');
                        result.city = ipData.city || '';
                        result.state = ipData.region || 'Maharashtra';
                    }
                    resolve(result);
                    return;
                }
            } catch (ipErr) {
                console.warn('IP Fallback failed:', ipErr);
                // Final fallback
            }
            resolve({ state: 'Maharashtra', city: '', address: '', detected: false });
        };

        if (!navigator.geolocation) {
            tryIpFallback();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const result = await fetchAddressFromCoords(position.coords.latitude, position.coords.longitude);
                resolve(result);
            },
            () => {
                // User denied or error occurred, try IP based detection
                tryIpFallback();
            },
            { timeout: 5000 }
        );
    });
}

/**
 * Approximate state from coordinates (India-focused)
 */
function mapCoordsToState(lat, lng) {
    // Simplified state mapping based on coordinate ranges
    if (lat >= 18 && lat <= 22 && lng >= 72 && lng <= 80) return 'Maharashtra';
    if (lat >= 12 && lat <= 18 && lng >= 74 && lng <= 78) return 'Karnataka';
    if (lat >= 8 && lat <= 13 && lng >= 76 && lng <= 80) return 'Tamil Nadu';
    if (lat >= 8 && lat <= 13 && lng >= 74 && lng <= 77) return 'Kerala';
    if (lat >= 20 && lat <= 28 && lng >= 68 && lng <= 75) return 'Gujarat';
    if (lat >= 23 && lat <= 28 && lng >= 75 && lng <= 79) return 'Madhya Pradesh';
    if (lat >= 25 && lat <= 31 && lng >= 77 && lng <= 85) return 'Uttar Pradesh';
    if (lat >= 21 && lat <= 27 && lng >= 80 && lng <= 88) return 'Chhattisgarh';
    if (lat >= 20 && lat <= 22 && lng >= 83 && lng <= 87) return 'Odisha';
    if (lat >= 22 && lat <= 27 && lng >= 86 && lng <= 89) return 'West Bengal';
    if (lat >= 25 && lat <= 27 && lng >= 85 && lng <= 88) return 'Bihar';
    if (lat >= 21 && lat <= 26 && lng >= 83 && lng <= 87) return 'Jharkhand';
    if (lat >= 13 && lat <= 19 && lng >= 76 && lng <= 81) return 'Andhra Pradesh';
    if (lat >= 15 && lat <= 18 && lng >= 73 && lng <= 76) return 'Goa';
    if (lat >= 28 && lat <= 33 && lng >= 74 && lng <= 77) return 'Punjab';
    if (lat >= 28 && lat <= 33 && lng >= 76 && lng <= 78) return 'Haryana';
    if (lat >= 26 && lat <= 31 && lng >= 69 && lng <= 76) return 'Rajasthan';
    return 'Maharashtra'; // Default
}

/**
 * Food recommendation database - state & season specific
 */
const foodDatabase = {
    Maharashtra: {
        summer: {
            foods: [
                { name: 'Buttermilk (Chaas)', emoji: '🥛', benefit: 'Cooling, probiotic, easy to digest', nutrients: 'Calcium, Protein, B12' },
                { name: 'Jowar Bhakri', emoji: '🫓', benefit: 'High fiber, gluten-free energy', nutrients: 'Iron, Fiber, B-vitamins' },
                { name: 'Sprouted Moong', emoji: '🌱', benefit: 'High protein, easy to digest', nutrients: 'Protein, Folate, Iron' },
                { name: 'Drumstick (Shevga)', emoji: '🥬', benefit: 'Nutrient-dense, anti-inflammatory', nutrients: 'Vitamin C, Calcium, Iron' },
                { name: 'Kokum Sherbet', emoji: '🍹', benefit: 'Cooling, aids digestion', nutrients: 'Antioxidants, Vitamin C' },
                { name: 'Watermelon (Kalingad)', emoji: '🍉', benefit: 'Hydrating, natural sugars', nutrients: 'Vitamin A, Lycopene' },
                { name: 'Cucumber Raita', emoji: '🥒', benefit: 'Cooling, probiotic', nutrients: 'Calcium, Protein' },
                { name: 'Sattu Drink', emoji: '🥤', benefit: 'Instant energy, cooling', nutrients: 'Protein, Iron, Fiber' },
            ],
            tips: [
                'Increase fluid intake - offer buttermilk, coconut water frequently',
                'Avoid heavy, fried foods during peak summer',
                'Add a pinch of salt and sugar to drinking water to prevent dehydration',
                'Feed small, frequent meals rather than large ones'
            ]
        },
        winter: {
            foods: [
                { name: 'Bajri Bhakri', emoji: '🫓', benefit: 'Warming, high energy', nutrients: 'Iron, Calcium, Fiber' },
                { name: 'Methi (Fenugreek) Paratha', emoji: '🥙', benefit: 'Iron-rich, warming', nutrients: 'Iron, Fiber, Vitamin K' },
                { name: 'Til Ladoo (Sesame)', emoji: '🍬', benefit: 'Warming, high calorie', nutrients: 'Calcium, Iron, Healthy fats' },
                { name: 'Ghee with Chapati', emoji: '🧈', benefit: 'High energy, fat-soluble vitamins', nutrients: 'Vitamin A, D, E, K' },
                { name: 'Amla (Gooseberry)', emoji: '🍏', benefit: 'Immunity booster', nutrients: 'Vitamin C, Antioxidants' },
                { name: 'Usal (Sprouted Legumes)', emoji: '🥘', benefit: 'High protein, warming', nutrients: 'Protein, Iron, Fiber' },
            ],
            tips: [
                'Include warming foods like bajri, til, and ghee',
                'Add turmeric to milk for immunity',
                'Dry fruits like almonds and dates provide concentrated nutrition',
                'Ensure adequate sun exposure for Vitamin D'
            ]
        },
        monsoon: {
            foods: [
                { name: 'Sabudana Khichdi', emoji: '🍚', benefit: 'Easy to digest, energy-dense', nutrients: 'Carbohydrates, Calcium' },
                { name: 'Bharli Vangi (Stuffed Brinjal)', emoji: '🍆', benefit: 'Spiced, aids digestion', nutrients: 'Fiber, Potassium' },
                { name: 'Hot Turmeric Milk', emoji: '🥛', benefit: 'Anti-inflammatory, immunity', nutrients: 'Curcumin, Calcium' },
                { name: 'Poha with Peanuts', emoji: '🥜', benefit: 'Light, iron-rich', nutrients: 'Iron, Protein, Carbs' },
                { name: 'Steamed Modak', emoji: '🥟', benefit: 'Nutritious, jaggery-based', nutrients: 'Iron, Coconut fats' },
            ],
            tips: [
                'Ensure all water is boiled and cooled before drinking',
                'Avoid raw/uncooked foods during monsoon',
                'Include turmeric and ginger in meals for immunity',
                'Wash all vegetables thoroughly before cooking'
            ]
        },
        autumn: {
            foods: [
                { name: 'Puranpoli', emoji: '🫓', benefit: 'High energy, festive nutrition', nutrients: 'Protein (dal), Iron, Carbs' },
                { name: 'Pumpkin (Bhopla) Bhaji', emoji: '🎃', benefit: 'Rich in beta-carotene', nutrients: 'Vitamin A, Fiber' },
                { name: 'Sweet Potato (Ratalu)', emoji: '🍠', benefit: 'Complex carbs, filling', nutrients: 'Vitamin A, Fiber, Potassium' },
                { name: 'Mixed Dal Khichdi', emoji: '🍛', benefit: 'Complete protein, easy to digest', nutrients: 'Protein, Iron, Zinc' },
            ],
            tips: [
                'Transition from monsoon to winter diet gradually',
                'Include seasonal fruits like guava and pomegranate',
                'Continue regular meal schedules',
                'Add jaggery-based sweets for iron'
            ]
        }
    },
    // Simplified entries for other states
    Karnataka: {
        summer: {
            foods: [
                { name: 'Ragi Mudde', emoji: '🫓', benefit: 'Calcium-rich, cooling', nutrients: 'Calcium, Iron, Fiber' },
                { name: 'Tender Coconut Water', emoji: '🥥', benefit: 'Natural electrolytes', nutrients: 'Potassium, Magnesium' },
                { name: 'Kosambari (Sprouted Salad)', emoji: '🥗', benefit: 'Raw nutrition, light', nutrients: 'Protein, Vitamins' },
                { name: 'Buttermilk (Majjige)', emoji: '🥛', benefit: 'Cooling probiotic', nutrients: 'Calcium, B12' },
            ],
            tips: ['Ragi is an excellent first food for weaning children', 'Coconut-based foods provide healthy fats']
        },
        winter: {
            foods: [
                { name: 'Ragi Porridge', emoji: '🥣', benefit: 'Warming, nutritious', nutrients: 'Calcium, Iron' },
                { name: 'Bisi Bele Bath', emoji: '🍛', benefit: 'Complete meal, warming', nutrients: 'Protein, Carbs, Vitamins' },
            ],
            tips: ['Include jaggery for iron', 'Add ghee to ragi preparations']
        },
        monsoon: {
            foods: [
                { name: 'Akki Rotti', emoji: '🫓', benefit: 'Rice-based, easy', nutrients: 'Carbs, Fiber' },
                { name: 'Hot Rasam', emoji: '🍲', benefit: 'Immunity-boosting', nutrients: 'Vitamin C, Antioxidants' },
            ],
            tips: ['Keep meals light but frequent', 'Add pepper and cumin for digestion']
        },
        autumn: {
            foods: [
                { name: 'Ragi Dosa', emoji: '🥞', benefit: 'Calcium-rich', nutrients: 'Calcium, Iron' },
                { name: 'Sambar with vegetables', emoji: '🍛', benefit: 'Protein + minerals', nutrients: 'Protein, Iron, Vitamins' },
            ],
            tips: ['Seasonal vegetables are most nutritious', 'Include banana for potassium']
        }
    },
    Bihar: {
        summer: {
            foods: [
                { name: 'Sattu Sharbat', emoji: '🥤', benefit: 'Instant energy, cooling', nutrients: 'Protein, Iron, Fiber' },
                { name: 'Litti with Chokha', emoji: '🫓', benefit: 'Filling, nutritious', nutrients: 'Protein, Fiber' },
                { name: 'Mango (Aam)', emoji: '🥭', benefit: 'Seasonal nutrition', nutrients: 'Vitamin A, C' },
                { name: 'Curd (Dahi)', emoji: '🥛', benefit: 'Probiotic, cooling', nutrients: 'Calcium, Protein' },
            ],
            tips: ['Sattu is a budget-friendly complete protein source', 'Oral rehydration is key in Bihar summers']
        },
        winter: {
            foods: [
                { name: 'Bajra Khichdi', emoji: '🍛', benefit: 'Warming, high energy', nutrients: 'Iron, Magnesium' },
                { name: 'Makki ki Roti', emoji: '🫓', benefit: 'Energy-dense', nutrients: 'Carbs, Fiber' },
                { name: 'Gud (Jaggery) with Peanut', emoji: '🍬', benefit: 'Iron booster', nutrients: 'Iron, Protein' },
            ],
            tips: ['Jaggery helps maintain body warmth', 'Add ghee to every meal for catch-up growth']
        }
    },
    'West Bengal': {
        summer: {
            foods: [
                { name: 'Panta Bhat (Fermented Rice)', emoji: '🍚', benefit: 'Cooling, probiotic, B12', nutrients: 'Vitamin B12, Iron' },
                { name: 'Posto (Poppy seeds)', emoji: '🍲', benefit: 'Cooling for gut', nutrients: 'Healthy fats, Fiber' },
                { name: 'Pumpkin (Kumro) flower fritters', emoji: '🌼', benefit: 'Micronutrient rich', nutrients: 'Beta-carotene' },
            ],
            tips: ['Fermented rice is excellent for gut health in summer', 'Add lemon for vitamin C absorption']
        },
        winter: {
            foods: [
                { name: 'Date Palm Jaggery (Patali Gur)', emoji: '🍯', benefit: 'Rich in Iron and Minerals', nutrients: 'Iron, Magnesium' },
                { name: 'Kichuri with vegetables', emoji: '🍛', benefit: 'Complete balanced meal', nutrients: 'Protein, Fiber, Vitamins' },
                { name: 'Fish Soup (Maacher Jhol)', emoji: '🐟', benefit: 'High quality protein', nutrients: 'Omega-3, B12, Protein' },
            ],
            tips: ['Freshwater fish is a superior protein source for children']
        }
    },
    Rajasthan: {
        summer: {
            foods: [
                { name: 'Rabri (Pearl Millet drink)', emoji: '🥤', benefit: 'Cooling, energy dense', nutrients: 'Calcium, Magnesium' },
                { name: 'Ker Sangri', emoji: '🌿', benefit: 'High mineral content from desert', nutrients: 'Zinc, Iron' },
                { name: 'Chaas (Buttermilk)', emoji: '🥛', benefit: 'Prevents heat stroke', nutrients: 'Calcium' },
            ],
            tips: ['Pearl millet (Bajra) can be used as a cooling drink when fermented']
        },
        winter: {
            foods: [
                { name: 'Bajra Rotla with Ghee', emoji: '🫓', benefit: 'Maximum warming energy', nutrients: 'Iron, Protein, Fats' },
                { name: 'Gond Ladoo', emoji: '🍬', benefit: 'High calorie, immunity', nutrients: 'Healthy fats, Protein' },
                { name: 'Lasun (Garlic) Chutney', emoji: '🧄', benefit: 'Warming, medicinal', nutrients: 'Antioxidants' },
            ],
            tips: ['High fat intake (Ghee) is essential for winter warmth']
        }
    },
    Punjab: {
        summer: {
            foods: [
                { name: 'Lassi (Sweet/Salted)', emoji: '🥛', benefit: 'Energy & hydration', nutrients: 'Protein, Calcium' },
                { name: 'Stuffed Paneer Paratha', emoji: '🥙', benefit: 'High protein for growth', nutrients: 'Protein, Calcium, Carbs' },
                { name: 'Mixed Veg Raita', emoji: '🥒', benefit: 'Cooling & nutritious', nutrients: 'Probiotics, Vitamins' },
            ],
            tips: ['Curd based drinks prevent heat exhaustion']
        },
        winter: {
            foods: [
                { name: 'Makki ki Roti & Sarson Saag', emoji: '🥬', benefit: 'Peak seasonal nutrition', nutrients: 'Iron, Vitamin K, Fiber' },
                { name: 'Pinni (Wheat/Lentil sweet)', emoji: '🍬', benefit: 'Energy dense snack', nutrients: 'Iron, Protein, Fats' },
                { name: 'Panjiri', emoji: '🥣', benefit: 'Nutrient concentrated', nutrients: 'Healthy fats, Micronutrients' },
            ],
            tips: ['Sesame and jaggery are best winter snacks']
        }
    },
    default: {
        summer: {
            foods: [
                { name: 'Buttermilk / Lassi', emoji: '🥛', benefit: 'Cooling, probiotic', nutrients: 'Calcium, Protein' },
                { name: 'Khichdi with Ghee', emoji: '🍛', benefit: 'Complete nutrition, easy to digest', nutrients: 'Protein, Carbs, Fats' },
                { name: 'Seasonal Fruits', emoji: '🍈', benefit: 'Hydrating, vitamins', nutrients: 'Vitamin C, Fiber' },
                { name: 'Sprouted Moong Chaat', emoji: '🌱', benefit: 'Protein-rich, light', nutrients: 'Protein, Iron, Folate' },
            ],
            tips: ['Stay hydrated with ORS if diarrhea presents', 'Small frequent meals are better in heat']
        },
        winter: {
            foods: [
                { name: 'Halwa with Ghee', emoji: '🍮', benefit: 'Energy-dense, warming', nutrients: 'Carbs, Fats, Iron' },
                { name: 'Dry Fruit Milk', emoji: '🥛', benefit: 'Concentrated nutrition', nutrients: 'Protein, Calcium, Iron' },
                { name: 'Dal Roti', emoji: '🫓', benefit: 'Protein-rich, filling', nutrients: 'Protein, Iron, Fiber' },
            ],
            tips: ['Ensure sun exposure for Vitamin D', 'Add warming spices like cinnamon']
        },
        monsoon: {
            foods: [
                { name: 'Moong Dal Khichdi', emoji: '🍚', benefit: 'Easy to digest', nutrients: 'Protein, Carbs' },
                { name: 'Turmeric Milk', emoji: '🥛', benefit: 'Anti-inflammatory', nutrients: 'Curcumin, Calcium' },
            ],
            tips: ['Boil water before drinking', 'Avoid street food']
        },
        autumn: {
            foods: [
                { name: 'Mixed Vegetable Soup', emoji: '🍲', benefit: 'Nutrient-dense, warming', nutrients: 'Vitamins, Minerals' },
                { name: 'Egg Bhurji with Roti', emoji: '🥚', benefit: 'High protein', nutrients: 'Protein, B12, Iron' },
            ],
            tips: ['Include festive foods but in moderation', 'Seasonal fruits provide best nutrition']
        }
    }
};

/**
 * Get diet recommendations based on location and season
 */
export function getDietRecommendations(state, season, nutritionStatus = 'Normal') {
    const stateData = foodDatabase[state] || foodDatabase.default;
    const seasonData = stateData[season] || stateData.summer;

    let result = { ...seasonData, state, season };

    // Add severity-specific recommendations
    if (nutritionStatus === 'SAM') {
        result.urgentAdvice = [
            '🚨 URGENT: This child needs immediate medical attention',
            '🏥 Refer to nearest Nutrition Rehabilitation Center (NRC)',
            '🍼 Start therapeutic feeding as per CMAM protocol',
            '💧 Ensure ORS is given if diarrhea is present',
            '⚠️ Do NOT give regular food until medical assessment',
        ];
        result.additionalFoods = [
            { name: 'Ready-to-Use Therapeutic Food (RUTF)', emoji: '📦', benefit: 'WHO-recommended for SAM treatment' },
            { name: 'F-75 Formula (clinical)', emoji: '🍼', benefit: 'Initial stabilization phase formula' },
        ];
    } else if (nutritionStatus === 'MAM') {
        result.urgentAdvice = [
            '⚠️ Child needs supplementary feeding program',
            '📋 Weekly monitoring of weight and MUAC required',
            '🥛 Increase calorie-dense foods in diet',
            '🥚 Add eggs, milk, and nuts if available',
        ];
        result.additionalFoods = [
            { name: 'Energy-Dense Porridge (Sattu + Jaggery)', emoji: '🥣', benefit: 'High calorie, locally available' },
            { name: 'Egg with every meal', emoji: '🥚', benefit: 'Complete protein for catch-up growth' },
        ];
    }

    return result;
}

/**
 * Get medical danger signs to watch for
 */
export function getDangerSigns(medicalHistory = []) {
    const signs = [];

    if (medicalHistory.includes('edema')) {
        signs.push({
            icon: '🚨',
            sign: 'Bilateral Pitting Edema',
            action: 'Immediate referral to hospital - sign of Kwashiorkor',
            severity: 'critical'
        });
    }

    if (medicalHistory.includes('lethargy')) {
        signs.push({
            icon: '🚨',
            sign: 'Severe Lethargy / Unconsciousness',
            action: 'Emergency referral - child may need IV fluids',
            severity: 'critical'
        });
    }

    if (medicalHistory.includes('diarrhea')) {
        signs.push({
            icon: '⚠️',
            sign: 'Persistent Diarrhea',
            action: 'Give ORS. If blood in stool or >14 days, refer immediately',
            severity: 'high'
        });
    }

    if (medicalHistory.includes('fever')) {
        signs.push({
            icon: '⚠️',
            sign: 'High Fever',
            action: 'Monitor temperature. If >102°F with convulsions, refer',
            severity: 'high'
        });
    }

    if (medicalHistory.includes('cough')) {
        signs.push({
            icon: '⚡',
            sign: 'Persistent Cough',
            action: 'Check for pneumonia signs (fast breathing, chest indrawing)',
            severity: 'medium'
        });
    }

    return signs;
}
