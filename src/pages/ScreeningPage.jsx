import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../hooks/useVoice';
import { performScreening } from '../utils/screening';
import { getDietRecommendations, getDangerSigns, detectLocation, detectSeason } from '../utils/diet';
import { speak, getTTSLang, parseSpokenNumber, getVoicePrompt } from '../utils/voice';
import { DietPlanContent } from './DietPlanPage';
import { User, Ruler, MapPin, Stethoscope, AlertCircle, AlertTriangle, CheckCircle, Volume2, ShieldAlert, ClipboardList, UtensilsCrossed, Lightbulb, Save, CheckSquare } from 'lucide-react';

const medicalConditions = ['diarrhea', 'fever', 'cough', 'edema', 'lethargy'];

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function ScreeningPage() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        childName: '',
        ageMonths: '',
        gender: 'female',
        heightCm: '',
        weightKg: '',
        muacCm: '',
        headCirc: '',
        medicalHistory: [],
        photo: null,
    });

    const [result, setResult] = useState(null);
    const [dietInfo, setDietInfo] = useState(null);
    const [dangerSigns, setDangerSigns] = useState([]);
    const [locationInfo, setLocationInfo] = useState({ state: 'Maharashtra', detected: false });
    const [season, setSeason] = useState(detectSeason());
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoValidation, setPhotoValidation] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeVoiceField, setActiveVoiceField] = useState(null);
    const [voiceStatus, setVoiceStatus] = useState('');
    const [isReadingResults, setIsReadingResults] = useState(false);
    const [ageUnit, setAgeUnit] = useState('months');
    const [cameraActive, setCameraActive] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);
    const suggestionTimeoutRef = useRef(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);
    const readingTimeoutsRef = useRef([]);
    const readingCancelledRef = useRef(false);
    const activeFieldRef = useRef(null);

    // Handle active voice field ref sync
    useEffect(() => {
        activeFieldRef.current = activeVoiceField;
    }, [activeVoiceField]);

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            // Camera cleanup safely removed
        };
    }, []);

    // Fetch address suggestions from OpenStreetMap Nominatim API
    const fetchAddressSuggestions = (query) => {
        if (!query || query.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        if (suggestionTimeoutRef.current) {
            clearTimeout(suggestionTimeoutRef.current);
        }

        suggestionTimeoutRef.current = setTimeout(async () => {
            setIsFetchingAddress(true);
            try {
                // Pass the current app language to OpenStreetMap so results reflect it (e.g. Marathi/Hindi/English)
                const lang = i18n.language === 'en' ? 'en-US,en;q=0.9' : `${i18n.language},en-US;q=0.9,en;q=0.8`;
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=in&accept-language=${encodeURIComponent(lang)}`);
                const data = await res.json();
                setAddressSuggestions(data || []);
            } catch (err) {
                console.error("Error fetching address suggestions:", err);
            } finally {
                setIsFetchingAddress(false);
            }
        }, 500); // 500ms debounce
    };

    // ===== VOICE HANDLERS =====

    // Handles all voice commands: navigate, submit, setField, setGender, camera
    const handleVoiceCommand = useCallback((command) => {
        if (!command) return;
        console.log('[ScreeningPage] Voice command:', command);

        switch (command.action) {
            case 'submit':
                handleSubmit();
                setVoiceStatus('✅ Submitting...');
                break;
            case 'setField':
                // Direct field assignment from voice (e.g., "name Rohit", "weight 10")
                if (command.field && command.value !== undefined) {
                    setFormData(prev => ({ ...prev, [command.field]: command.value }));
                    const fieldLabel = command.field === 'childName' ? 'Name'
                        : command.field === 'ageMonths' ? 'Age'
                            : command.field === 'heightCm' ? 'Height'
                                : command.field === 'weightKg' ? 'Weight'
                                    : command.field === 'muacCm' ? 'MUAC'
                                        : command.field === 'headCirc' ? 'Head'
                                            : command.field;
                    setVoiceStatus(`✅ ${fieldLabel}: ${command.value}`);
                    setActiveVoiceField(null);
                }
                break;
            case 'setGender':
                if (command.value) {
                    setFormData(prev => ({ ...prev, gender: command.value }));
                    setVoiceStatus(`✅ Gender: ${command.value}`);
                }
                break;

            case 'navigate':
                // Navigation handled by parent if needed
                break;
            default:
                break;
        }
    }, []);

    // Handles raw transcript for single-field voice entry (when a mic button next to a field is tapped)
    const handleVoiceTranscript = useCallback((text) => {
        const currentField = activeFieldRef.current;
        if (!currentField) return;

        console.log(`[Voice] Transcript for field "${currentField}":`, text);

        // Text field (child name)
        if (currentField === 'childName') {
            // Use the spoken text directly as the name
            const name = text.trim();
            if (name) {
                const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
                setFormData(prev => ({ ...prev, childName: capitalizedName }));
                setVoiceStatus(`✅ Name: ${capitalizedName}`);
                setActiveVoiceField(null);
            }
            return;
        }

        // Numeric fields
        const parsed = parseSpokenNumber(text);
        if (parsed && parsed.value !== undefined) {
            let value = parsed.value;

            // Auto-convert years to months for age field
            if (currentField === 'ageMonths' && parsed.unit === 'years') {
                value = value * 12;
            }

            setFormData(prev => ({
                ...prev,
                [currentField]: String(value)
            }));
            setVoiceStatus(`✅ ${currentField}: ${value}`);
            setActiveVoiceField(null);
        } else {
            // Couldn't parse — try direct number
            const directNum = parseFloat(text.replace(/[^\d.]/g, ''));
            if (!isNaN(directNum)) {
                setFormData(prev => ({
                    ...prev,
                    [currentField]: String(directNum)
                }));
                setVoiceStatus(`✅ ${currentField}: ${directNum}`);
                setActiveVoiceField(null);
            } else {
                setVoiceStatus(`❌ Could not understand: "${text}"`);
            }
        }
    }, []);

    const { isListening, toggleListening, transcript, interimTranscript, currentLang } = useVoice(handleVoiceCommand, handleVoiceTranscript);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleMedical = (condition) => {
        setFormData(prev => ({
            ...prev,
            medicalHistory: prev.medicalHistory.includes(condition)
                ? prev.medicalHistory.filter(c => c !== condition)
                : [...prev.medicalHistory, condition]
        }));
    };



    // Start voice input for a specific field — speaks a prompt in user's language
    const startVoiceForField = (fieldName) => {
        // If already listening for this field, stop
        if (activeVoiceField === fieldName && isListening) {
            setActiveVoiceField(null);
            toggleListening();
            setVoiceStatus('');
            return;
        }
        // Set the active field first
        setActiveVoiceField(fieldName);
        setVoiceStatus(`🎤 Listening for ${fieldName}...`);

        // Speak the prompt in the user's language
        const prompt = getVoicePrompt(fieldName, i18n.language);
        speak(prompt, getTTSLang(i18n.language));

        // Start listening after a brief delay (let TTS finish)
        setTimeout(() => {
            if (!isListening) toggleListening();
        }, 1200);
    };

    // Submit screening
    const handleSubmit = () => {
        const screeningData = {
            gender: formData.gender,
            ageMonths: formData.ageMonths,
            heightCm: formData.heightCm,
            weightKg: formData.weightKg,
            muacCm: formData.muacCm,
            medicalHistory: formData.medicalHistory,
        };

        const screeningResult = performScreening(screeningData);
        setResult(screeningResult);

        const diet = getDietRecommendations(
            locationInfo.state,
            season,
            screeningResult.overallStatus
        );
        setDietInfo(diet);

        const signs = getDangerSigns(formData.medicalHistory);
        setDangerSigns(signs);

        const statusText = t(screeningResult.muacResult?.label || 'normal');
        const zoneText = t(screeningResult.muacResult?.zoneLabel || 'green_zone');
        speak(`${t('result')}: ${statusText}. ${zoneText}`, getTTSLang(i18n.language));
    };

    // ===== READ RESULTS ALOUD =====
    const stopReadingResults = () => {
        readingCancelledRef.current = true;
        // Stop Web Speech API
        window.speechSynthesis?.cancel();
        // Stop Google Translate TTS audio
        if (readingTimeoutsRef.current._stopAudio) {
            readingTimeoutsRef.current._stopAudio();
        }
        readingTimeoutsRef.current.forEach(id => clearTimeout(id));
        readingTimeoutsRef.current = [];
        setIsReadingResults(false);
    };

    const readResultsAloud = () => {
        if (isReadingResults) {
            stopReadingResults();
            return;
        }

        if (!result || !window.speechSynthesis) return;

        readingCancelledRef.current = false;
        setIsReadingResults(true);
        window.speechSynthesis.cancel();

        const lang = getTTSLang(i18n.language);
        const sections = [];

        // Section 1: Status
        const statusLabel = t(result.muacResult?.label || 'normal');
        const zoneLabel = t(result.muacResult?.zoneLabel || 'green_zone');
        const statusText = i18n.language === 'hi'
            ? `परिणाम: ${statusLabel}। ${zoneLabel}।`
            : i18n.language === 'mr'
                ? `निकाल: ${statusLabel}। ${zoneLabel}।`
                : `Result: ${statusLabel}. ${zoneLabel}.`;
        sections.push(statusText);

        // Section 2: MUAC value
        if (formData.muacCm) {
            const muacText = i18n.language === 'hi'
                ? `MUAC माप: ${formData.muacCm} सेंटीमीटर। स्थिति: ${result.overallStatus || ''}`
                : i18n.language === 'mr'
                    ? `MUAC माप: ${formData.muacCm} सेंटीमीटर। स्थिती: ${result.overallStatus || ''}`
                    : `MUAC measurement: ${formData.muacCm} centimeters. Status: ${result.overallStatus || ''}`;
            sections.push(muacText);
        }

        // Section 3: Danger signs
        if (dangerSigns.length > 0) {
            const dangerIntro = i18n.language === 'hi'
                ? 'चेतावनी! खतरे के संकेत पाए गए:'
                : i18n.language === 'mr'
                    ? 'चेतावणी! धोक्याची चिन्हे आढळली:'
                    : 'Warning! Danger signs detected:';
            const signsList = dangerSigns.map(s => `${s.sign}. ${s.action}`).join('. ');
            sections.push(`${dangerIntro} ${signsList}`);

            const seekMedical = i18n.language === 'hi'
                ? 'कृपया तुरंत चिकित्सा सहायता लें।'
                : i18n.language === 'mr'
                    ? 'कृपया त्वरित वैद्यकीय मदत घ्या।'
                    : 'Please seek immediate medical attention.';
            sections.push(seekMedical);
        }

        // Section 4: Action plan
        if (result.recommendations) {
            const actionIntro = i18n.language === 'hi'
                ? 'कार्य योजना:'
                : i18n.language === 'mr'
                    ? 'कृती योजना:'
                    : 'Action plan:';
            const actionText = t(result.recommendations.action);
            const feedingText = `${t('feeding')}: ${t(result.recommendations.feeding)}`;
            const followUpText = `${t('follow_up')}: ${t(result.recommendations.followUp)}`;
            sections.push(`${actionIntro} ${actionText}. ${feedingText}. ${followUpText}.`);
        }

        // Section 5: Diet recommendations
        if (dietInfo && dietInfo.foods?.length > 0) {
            const dietIntro = i18n.language === 'hi'
                ? 'आहार सिफारिशें:'
                : i18n.language === 'mr'
                    ? 'आहार शिफारसी:'
                    : 'Diet recommendations:';
            const foodsList = dietInfo.foods.slice(0, 5).map(f => t(f.name)).join(', ');
            sections.push(`${dietIntro} ${foodsList}.`);

            if (dietInfo.tips?.length > 0) {
                const tipsIntro = i18n.language === 'hi'
                    ? 'सुझाव:'
                    : i18n.language === 'mr'
                        ? 'सूचना:'
                        : 'Tips:';
                const tipsList = dietInfo.tips.slice(0, 3).map(tip => t(tip)).join('. ');
                sections.push(`${tipsIntro} ${tipsList}.`);
            }
        }

        // Clean all sections by removing emojis and markdown (using safer regex)
        const cleanSections = sections.map(s => 
            s.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
             .replace(/[*#_`]/g, '')
             .trim()
        );

        // For English, use Web Speech API (works fine)
        if (i18n.language === 'en') {
            const fullText = cleanSections.join('. ');
            const utterance = new SpeechSynthesisUtterance(fullText);
            utterance.lang = lang;
            utterance.rate = 0.85;
            utterance.pitch = 1;
            utterance.volume = 1;

            const voices = window.speechSynthesis.getVoices();
            const matchingVoice = voices.find(v => v.lang.startsWith('en'));
            if (matchingVoice) utterance.voice = matchingVoice;

            utterance.onend = () => setIsReadingResults(false);
            utterance.onerror = () => setIsReadingResults(false);

            window.speechSynthesis.speak(utterance);
            return;
        }

        // For Hindi/Marathi: Use Google Translate TTS via Vite proxy
        const ttsLang = i18n.language === 'hi' ? 'hi' : 'mr';
        const fullText = cleanSections.join('। ');
        
        console.log('[TTS] Language:', ttsLang, '| Text length:', fullText.length);
        console.log('[TTS] Text preview:', fullText.substring(0, 100));

        // Split into chunks of ~150 chars for Google TTS
        const chunks = [];
        const sentences = fullText.split(/[।.]/);
        let current = '';
        for (const sentence of sentences) {
            const trimmed = sentence.trim();
            if (!trimmed) continue;
            if ((current + trimmed).length > 150 && current) {
                chunks.push(current.trim());
                current = trimmed;
            } else {
                current += (current ? '। ' : '') + trimmed;
            }
        }
        if (current.trim()) chunks.push(current.trim());

        console.log('[TTS] Split into', chunks.length, 'chunks');

        let currentChunkIndex = 0;
        let currentAudio = null;

        readingTimeoutsRef.current._stopAudio = () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
        };

        const playNextChunk = async () => {
            if (readingCancelledRef.current || currentChunkIndex >= chunks.length) {
                console.log('[TTS] Done reading or cancelled');
                setIsReadingResults(false);
                return;
            }

            const chunk = chunks[currentChunkIndex];
            console.log('[TTS] Playing chunk', currentChunkIndex + 1, '/', chunks.length, ':', chunk.substring(0, 50));

            try {
                const url = `/api/tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
                console.log('[TTS] Fetching:', url.substring(0, 80));

                const response = await fetch(url);
                console.log('[TTS] Response status:', response.status, 'type:', response.headers.get('content-type'));

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const blob = await response.blob();
                console.log('[TTS] Blob size:', blob.size, 'type:', blob.type);

                const blobUrl = URL.createObjectURL(blob);
                const audio = new Audio(blobUrl);
                currentAudio = audio;

                audio.onended = () => {
                    console.log('[TTS] Chunk', currentChunkIndex + 1, 'finished');
                    URL.revokeObjectURL(blobUrl);
                    if (readingCancelledRef.current) {
                        setIsReadingResults(false);
                        return;
                    }
                    currentChunkIndex++;
                    const pauseId = setTimeout(playNextChunk, 600);
                    readingTimeoutsRef.current.push(pauseId);
                };

                audio.onerror = (e) => {
                    console.error('[TTS] Audio error:', e);
                    URL.revokeObjectURL(blobUrl);
                    currentChunkIndex++;
                    setTimeout(playNextChunk, 300);
                };

                await audio.play();
                console.log('[TTS] Playing audio...');
            } catch (err) {
                console.error('[TTS] Error:', err);
                setIsReadingResults(false);
            }
        };

        playNextChunk();
    };

    // Save
    const handleSave = async () => {
        setIsSaving(true);

        const record = {
            id: Date.now().toString(),
            childName: formData.childName,
            ageMonths: formData.ageMonths,
            gender: formData.gender,
            heightCm: formData.heightCm,
            weightKg: formData.weightKg,
            muacCm: formData.muacCm,
            headCirc: formData.headCirc,
            medicalHistory: formData.medicalHistory,
            result: result,
            location: locationInfo,
            season: season,
            userId: user?.uid || 'anonymous',
            createdAt: new Date().toISOString(),
        };

        const existing = JSON.parse(localStorage.getItem('cnis_screenings') || '[]');
        existing.push(record);
        localStorage.setItem('cnis_screenings', JSON.stringify(existing));

        try {
            const { collection, addDoc } = await import('firebase/firestore');
            const { db } = await import('../config/firebase');
            await addDoc(collection(db, 'screenings'), record);
        } catch (err) {
            console.log('Firestore save skipped:', err.message);
        }

        setIsSaving(false);
        setSaved(true);
        speak(t('success'), getTTSLang(i18n.language));
    };

    const VoiceButton = ({ field }) => {
        const isActive = activeVoiceField === field && isListening;
        return (
            <button
                type="button"
                onClick={() => startVoiceForField(field)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive
                    ? 'bg-red-500 text-white shadow-md scale-110 voice-active'
                    : 'bg-gray-100 text-gray-400 hover:bg-primary-100 hover:text-clinical-blue'
                    }`}
                title={isActive ? 'Stop listening' : getVoicePrompt(field, i18n.language)}
            >
                {isActive ? <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
            </button>
        );
    };

    const isFormValid = formData.childName && formData.ageMonths && formData.muacCm;

    return (
        <div className="space-y-6 animate-fade-in pb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('screening')}</h2>
                    <p className="text-sm text-gray-500">Fill in child's measurements for nutrition assessment</p>
                </div>
                <button
                    onClick={() => {
                        setActiveVoiceField(null);
                        toggleListening();
                        if (isListening) setVoiceStatus('');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isListening
                        ? 'bg-red-100 text-red-600 voice-active'
                        : 'bg-primary-50 text-clinical-blue hover:bg-primary-100'
                        }`}
                    title={isListening ? 'Stop listening' : 'Start voice commands'}
                >
                    <span>{isListening ? <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" /> : <Volume2 className="w-4 h-4" />}</span>
                    <span className="text-sm font-medium hidden sm:inline">
                        {isListening
                            ? (activeVoiceField
                                ? `Listening: ${activeVoiceField}`
                                : t('voice_listening') || 'Listening...')
                            : 'Voice'}
                    </span>
                </button>
            </div>

            {/* Voice Status Bar */}
            {(voiceStatus || isListening || interimTranscript) && (
                <div className={`rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 transition-all ${voiceStatus.startsWith('❌') ? 'bg-red-50 text-red-600 border border-red-200' :
                    voiceStatus.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-primary-50 text-clinical-blue border border-primary-200'
                    }`}>
                    {isListening && (
                        <div className="flex gap-1 items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="font-medium">
                                {i18n.language === 'hi' ? 'सुन रहा हूं...' : i18n.language === 'mr' ? 'ऐकत आहे...' : 'Listening...'}
                            </span>
                        </div>
                    )}
                    {interimTranscript && (
                        <span className="text-gray-400 italic">"{interimTranscript}"</span>
                    )}
                    {transcript && !interimTranscript && (
                        <span>🗣️ "{transcript}"</span>
                    )}
                    {voiceStatus && !isListening && (
                        <span>{voiceStatus}</span>
                    )}
                    {activeVoiceField && isListening && (
                        <span className="ml-auto text-xs bg-white/70 px-2 py-0.5 rounded-full font-medium">
                            📝 {activeVoiceField === 'childName' ? 'Name'
                                : activeVoiceField === 'ageMonths' ? 'Age'
                                    : activeVoiceField === 'heightCm' ? 'Height'
                                        : activeVoiceField === 'weightKg' ? 'Weight'
                                            : activeVoiceField === 'muacCm' ? 'MUAC'
                                                : activeVoiceField === 'headCirc' ? 'Head'
                                                    : activeVoiceField}
                        </span>
                    )}
                </div>
            )}

            {/* Form */}
            {!result ? (
                <div className="space-y-5">
                    {/* Child Info */}
                    <div className="glass rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-500" /> Child Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-bold text-slate-800 mb-1">{t('child_name')}</label>
                                <input
                                    type="text"
                                    value={formData.childName}
                                    onChange={(e) => updateField('childName', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
                                    placeholder="Enter child's name"
                                    id="input-child-name"
                                />
                                <VoiceButton field="childName" />
                            </div>
                            <div className="relative">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="block text-sm font-medium text-gray-600">
                                        {t('child_age')} ({ageUnit === 'months' ? 'Months' : 'Years'})
                                    </label>
                                    <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5">
                                        <button
                                            type="button"
                                            onClick={() => setAgeUnit('months')}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${ageUnit === 'months' ? 'bg-white dark:bg-slate-700 shadow-sm text-clinical-blue' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'}`}
                                        >
                                            Months
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAgeUnit('years')}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${ageUnit === 'years' ? 'bg-white dark:bg-slate-700 shadow-sm text-clinical-blue' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'}`}
                                        >
                                            Years
                                        </button>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        step="any"
                                        value={ageUnit === 'years' ? (formData.ageMonths ? (parseFloat(formData.ageMonths) / 12).toFixed(1) : '') : formData.ageMonths}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '') {
                                                updateField('ageMonths', '');
                                                return;
                                            }
                                            let num = parseFloat(val);
                                            if (!isNaN(num)) {
                                                if (ageUnit === 'years') {
                                                    // Limit to 5 years
                                                    if (num > 5) num = 5;
                                                    updateField('ageMonths', (num * 12).toString());
                                                } else {
                                                    // Limit to 60 months
                                                    if (num > 60) num = 60;
                                                    updateField('ageMonths', num.toString());
                                                }
                                            }
                                        }}
                                        className={`w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-slate-900 font-bold ${parseFloat(formData.ageMonths) > 60 ? 'border-red-500' : ''}`}
                                        placeholder={ageUnit === 'years' ? "e.g. 3" : "e.g. 36"}
                                        id="input-age"
                                        max={ageUnit === 'years' ? 5 : 60}
                                    />
                                    <VoiceButton field="ageMonths" />
                                </div>
                                {formData.ageMonths && (
                                    <p className="text-[11px] font-bold text-clinical-blue mt-1.5 flex items-center gap-1.5 animate-fade-in">
                                        <span className="bg-clinical-blue/10 px-2 py-0.5 rounded-full">
                                            {ageUnit === 'months' 
                                                ? `≈ ${(parseFloat(formData.ageMonths) / 12).toFixed(1)} Years` 
                                                : `≈ ${formData.ageMonths} Months`
                                            }
                                        </span>
                                        {parseFloat(formData.ageMonths) >= 60 && (
                                            <span className="text-amber-600 ml-auto">Max age: 5 yrs</span>
                                        )}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">{t('child_gender')}</label>
                                <div className="flex gap-3">
                                    {['male', 'female'].map(g => (
                                        <button
                                            key={g}
                                            onClick={() => updateField('gender', g)}
                                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${formData.gender === g
                                                ? 'bg-clinical-blue text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {g === 'male' ? '👦 ' : '👧 '}{t(g)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Measurements */}
                    <div className="glass rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <Ruler className="w-5 h-5 text-indigo-500" /> Measurements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { field: 'heightCm', label: 'height', placeholder: 'e.g. 88' },
                                { field: 'weightKg', label: 'weight', placeholder: 'e.g. 10' },
                                { field: 'muacCm', label: 'muac', placeholder: 'e.g. 12', important: true },
                                { field: 'headCirc', label: 'head_circ', placeholder: 'e.g. 48' },
                            ].map(input => (
                                <div key={input.field} className="relative">
                                    <label className={`block text-sm font-bold mb-1 ${input.important ? 'text-clinical-blue' : 'text-slate-800'}`}>
                                        {t(input.label)}
                                        {input.important && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData[input.field]}
                                        onChange={(e) => updateField(input.field, e.target.value)}
                                        className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 outline-none transition-all bg-white ${input.important
                                            ? 'border-primary-200 focus:border-clinical-blue focus:ring-primary-100'
                                            : 'border-gray-200 focus:border-clinical-blue focus:ring-primary-100'
                                            }`}
                                        placeholder={input.placeholder}
                                        id={`input-${input.field}`}
                                    />
                                    <VoiceButton field={input.field} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location Selector */}
                    <div className="glass rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-500" /> Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">State / Region</label>
                                <select
                                    value={locationInfo.state}
                                    onChange={(e) => setLocationInfo(prev => ({ ...prev, state: e.target.value, detected: false }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white appearance-none cursor-pointer"
                                    id="select-location"
                                >
                                    {INDIAN_STATES.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                {locationInfo.detected && (
                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        ✅ Auto-detected via GPS
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Season</label>
                                <select
                                    value={season}
                                    onChange={(e) => setSeason(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white appearance-none cursor-pointer"
                                    id="select-season"
                                >
                                    <option value="summer">☀️ Summer (Mar-May)</option>
                                    <option value="monsoon">🌧️ Monsoon (Jun-Sep)</option>
                                    <option value="autumn">🍂 Autumn (Oct-Nov)</option>
                                    <option value="winter">❄️ Winter (Dec-Feb)</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">Auto-detected: {detectSeason() === season ? 'Yes' : 'Manually changed'}</p>
                            </div>
                            <div className="md:col-span-2 mt-2 relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    {t('address') || 'Full Address'}
                                    {isFetchingAddress && <span className="ml-2 text-xs text-clinical-blue animate-pulse">Searching...</span>}
                                </label>
                                <textarea
                                    value={locationInfo.address || ''}
                                    onChange={(e) => {
                                        setLocationInfo(prev => ({ ...prev, address: e.target.value }));
                                        fetchAddressSuggestions(e.target.value);
                                    }}
                                    rows="2"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-clinical-blue focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white resize-none"
                                    placeholder={t('address_placeholder') || 'Enter house no, street, village/city, taluka...'}
                                    id="input-address"
                                ></textarea>
                                
                                {/* Autocomplete Dropdown */}
                                {addressSuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                                        {addressSuggestions.map((suggestion, index) => (
                                            <li 
                                                key={index} 
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                                                onClick={() => {
                                                    setLocationInfo(prev => ({ 
                                                        ...prev, 
                                                        address: suggestion.display_name,
                                                        state: suggestion.address?.state || prev.state
                                                    }));
                                                    setAddressSuggestions([]);
                                                }}
                                            >
                                                {suggestion.display_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Medical History */}
                    <div className="glass rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-indigo-500" /> {t('medical_history')}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {medicalConditions.map(condition => (
                                <button
                                    key={condition}
                                    onClick={() => toggleMedical(condition)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.medicalHistory.includes(condition)
                                        ? condition === 'edema' || condition === 'lethargy'
                                            ? 'bg-red-500 text-white shadow-md'
                                            : 'bg-orange-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    id={`medical-${condition}`}
                                >
                                    {formData.medicalHistory.includes(condition) && '✓ '}
                                    {t(condition)}
                                </button>
                            ))}
                        </div>
                    </div>



                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${isFormValid
                            ? 'gradient-clinical text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        id="submit-screening"
                    >
                        {t('start_screening')}
                    </button>
                </div>
            ) : (
                /* Results Section */
                <div className="space-y-5 animate-scale-in">
                    {/* Status Banner */}
                    <div className={`rounded-3xl p-6 text-white ${result.zone === 'red' ? 'bg-gradient-to-r from-red-600 to-red-500' :
                        result.zone === 'orange' ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                            'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}>
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                            <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/20 flex items-center justify-center">
                                <span className="text-4xl flex items-center justify-center">
                                    {result.zone === 'red' ? <AlertCircle className="w-10 h-10 text-white" /> : result.zone === 'orange' ? <AlertTriangle className="w-10 h-10 text-white" /> : <CheckCircle className="w-10 h-10 text-white" />}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{t(result.muacResult?.label || 'normal')}</h3>
                                <p className="text-white/90">{t(result.muacResult?.zoneLabel || 'green_zone')}</p>
                                {result.muacResult && (
                                    <p className="text-white/70 text-sm mt-1">
                                        MUAC: {formData.muacCm} cm | {result.overallStatus}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Read Results Aloud Button */}
                    <button
                        onClick={readResultsAloud}
                        className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                            isReadingResults
                                ? 'bg-red-100 text-red-600 border-2 border-red-300 shadow-md'
                                : 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-md active:scale-[0.98]'
                        }`}
                        id="read-results-btn"
                    >
                        {isReadingResults ? (
                            <>
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                ⏹ {i18n.language === 'hi' ? 'पढ़ना बंद करें' : i18n.language === 'mr' ? 'वाचणे थांबवा' : 'Stop Reading'}
                            </>
                        ) : (
                            <>
                                <Volume2 className="w-5 h-5" /> {i18n.language === 'hi' ? 'परिणाम सुनें' : i18n.language === 'mr' ? 'निकाल ऐका' : 'Read Results Aloud'}
                            </>
                        )}
                    </button>

                    {/* Danger Signs */}
                    {dangerSigns.length > 0 && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                            <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-red-600" /> {t('danger_signs')}
                            </h3>
                            <div className="space-y-2">
                                {dangerSigns.map((sign, i) => (
                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${sign.severity === 'critical' ? 'bg-red-100' : 'bg-orange-50'
                                        }`}>
                                        <span className="text-lg mt-0.5">{sign.icon}</span>
                                        <div>
                                            <p className="font-semibold text-sm text-red-800">{sign.sign}</p>
                                            <p className="text-xs text-red-600">{sign.action}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-sm font-semibold text-red-600 bg-red-100 rounded-lg px-3 py-2 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" /> {t('seek_medical')}
                            </p>
                        </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations && (
                        <div className="glass rounded-2xl p-5 border border-gray-100">
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-indigo-500" /> {t('action_plan')}
                            </h3>
                            <div className="space-y-2">
                                <div className="p-3 bg-primary-50 rounded-xl">
                                    <p className="font-medium text-clinical-dark text-sm">{t(result.recommendations.action)}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600"><span className="font-medium">{t('feeding')}:</span> {t(result.recommendations.feeding)}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600"><span className="font-medium">{t('follow_up')}:</span> {t(result.recommendations.followUp)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Diet Recommendations */}
                    {dietInfo && (
                        <div className="glass rounded-2xl p-5 border border-gray-100">
                            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <UtensilsCrossed className="w-5 h-5 text-indigo-500" /> {t('diet_recommendations')}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-primary-50 text-clinical-blue text-xs font-medium rounded-full text-left">
                                    📍 {locationInfo.address ? `${locationInfo.address}, ` : ''}{(locationInfo.city && locationInfo.city !== 'Unknown') ? `${locationInfo.city}, ` : ''}{locationInfo.state || 'Maharashtra'}
                                </span>
                                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                                    {season === 'summer' ? '☀️' : season === 'winter' ? '❄️' : season === 'monsoon' ? '🌧️' : '🍂'} {t(season)}
                                </span>
                            </div>

                            {dietInfo.urgentAdvice && (
                                <div className="mb-4 space-y-1">
                                    {dietInfo.urgentAdvice.map((advice, i) => (
                                        <p key={i} className="text-sm text-red-700 bg-red-50 px-3 py-1.5 rounded-lg">{t(advice)}</p>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {dietInfo.foods?.map((food, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                                        <span className="flex items-center justify-center p-2 bg-white rounded-lg shadow-sm border border-gray-100"><UtensilsCrossed className="w-6 h-6 text-indigo-400" /></span>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{t(food.name)}</p>
                                            <p className="text-xs text-gray-500">{t(food.benefit)}</p>
                                            <p className="text-xs text-clinical-blue mt-0.5">{t(food.nutrients)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {dietInfo.tips && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1"><Lightbulb className="w-4 h-4 text-amber-500" /> {t('tips')}:</p>
                                    <ul className="space-y-1">
                                        {dietInfo.tips.map((tip, i) => (
                                            <li key={i} className="text-xs text-gray-500 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-clinical-blue">
                                                {t(tip)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <DietPlanContent />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || saved}
                            className={`flex-1 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${saved
                                ? 'bg-green-500 text-white'
                                : 'gradient-clinical text-white hover:shadow-lg active:scale-[0.99]'
                                }`}
                            id="save-screening"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : saved ? (
                                <span className="flex items-center gap-1"><CheckSquare className="w-5 h-5" /> {t('saved')}</span>
                            ) : (
                                <span className="flex items-center gap-1"><Save className="w-5 h-5" /> {t('save_data')}</span>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setResult(null);
                                setDietInfo(null);
                                setDangerSigns([]);
                                setPhotoPreview(null);
                                setPhotoValidation(null);
                                setSaved(false);
                                setFormData({
                                    childName: '', ageMonths: '', gender: 'female',
                                    heightCm: '', weightKg: '', muacCm: '', headCirc: '',
                                    medicalHistory: [], photo: null,
                                });
                            }}
                            className="px-6 py-3 rounded-2xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                        >
                            {t('new')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
