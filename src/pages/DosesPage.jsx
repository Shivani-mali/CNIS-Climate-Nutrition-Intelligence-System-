import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Syringe, Calendar, CheckCircle, Bell, BellOff, Info, Clock, ChevronDown, ChevronRight } from 'lucide-react';

const VACCINE_SCHEDULE = [
    {
        ageKey: 'age_at_birth',
        vaccines: [
            { 
                name: 'BCG', 
                descKey: 'bcg_desc', 
                routeKey: 'route_id',
                impKey: 'bcg_imp',
                riskKey: 'bcg_risk'
            },
            { 
                name: 'OPV-0', 
                descKey: 'opv_desc', 
                routeKey: 'route_oral',
                impKey: 'opv_imp',
                riskKey: 'opv0_risk'
            },
            { 
                name: 'Hep-B', 
                descKey: 'hepb_desc', 
                routeKey: 'route_im',
                impKey: 'hepb_imp',
                riskKey: 'hepb_risk'
            }
        ]
    },
    {
        ageKey: 'age_6_weeks',
        vaccines: [
            { 
                name: 'OPV-1', 
                descKey: 'opv_desc', 
                routeKey: 'route_oral',
                impKey: 'opv1_imp',
                riskKey: 'opv1_risk'
            },
            { 
                name: 'Pentavalent-1', 
                descKey: 'penta_desc', 
                routeKey: 'route_im',
                impKey: 'penta_imp',
                riskKey: 'penta_risk'
            },
            { 
                name: 'Rotavirus-1', 
                descKey: 'rota_desc', 
                routeKey: 'route_oral',
                impKey: 'rota_imp',
                riskKey: 'rota_risk'
            },
            { 
                name: 'fIPV-1', 
                descKey: 'fipv_desc', 
                routeKey: 'route_id',
                impKey: 'fipv_imp',
                riskKey: 'fipv_risk'
            }
        ]
    },
    {
        ageKey: 'age_10_weeks',
        vaccines: [
            { 
                name: 'OPV-2', 
                descKey: 'opv_desc', 
                routeKey: 'route_oral',
                impKey: 'opv2_imp',
                riskKey: 'opv2_risk'
            },
            { 
                name: 'Pentavalent-2', 
                descKey: 'penta_desc', 
                routeKey: 'route_im',
                impKey: 'penta2_imp',
                riskKey: 'penta2_risk'
            },
            { 
                name: 'Rotavirus-2', 
                descKey: 'rota_desc', 
                routeKey: 'route_oral',
                impKey: 'rota2_imp',
                riskKey: 'rota2_risk'
            }
        ]
    },
    {
        ageKey: 'age_14_weeks',
        vaccines: [
            { 
                name: 'OPV-3', 
                descKey: 'opv_desc', 
                routeKey: 'route_oral',
                impKey: 'opv3_imp',
                riskKey: 'opv3_risk'
            },
            { 
                name: 'Pentavalent-3', 
                descKey: 'penta_desc', 
                routeKey: 'route_im',
                impKey: 'penta3_imp',
                riskKey: 'penta3_risk'
            },
            { 
                name: 'Rotavirus-3', 
                descKey: 'rota_desc', 
                routeKey: 'route_oral',
                impKey: 'rota3_imp',
                riskKey: 'rota3_risk'
            },
            { 
                name: 'fIPV-2', 
                descKey: 'fipv_desc', 
                routeKey: 'route_id',
                impKey: 'fipv2_imp',
                riskKey: 'fipv2_risk'
            }
        ]
    },
    {
        ageKey: 'age_9_to_12_months',
        vaccines: [
            { 
                name: 'Measles/MR-1', 
                descKey: 'mr_desc', 
                routeKey: 'route_sc',
                impKey: 'mr_imp',
                riskKey: 'mr_risk'
            },
            { 
                name: 'JE-1', 
                descKey: 'je_desc', 
                routeKey: 'route_sc',
                impKey: 'je_imp',
                riskKey: 'je_risk'
            },
            { 
                name: 'PCV Booster', 
                descKey: 'pcv_desc', 
                routeKey: 'route_im',
                impKey: 'pcv_imp',
                riskKey: 'pcv_risk'
            }
        ]
    },
    {
        ageKey: 'age_16_to_24_months',
        vaccines: [
            { 
                name: 'Measles/MR-2', 
                descKey: 'mr_desc', 
                routeKey: 'route_sc',
                impKey: 'mr2_imp',
                riskKey: 'mr2_risk'
            },
            { 
                name: 'JE-2', 
                descKey: 'je_desc', 
                routeKey: 'route_sc',
                impKey: 'je2_imp',
                riskKey: 'je2_risk'
            },
            { 
                name: 'DPT Booster-1', 
                descKey: 'dpt_desc', 
                routeKey: 'route_im',
                impKey: 'dpt_imp',
                riskKey: 'dpt_risk'
            },
            { 
                name: 'OPV Booster', 
                descKey: 'opv_desc', 
                routeKey: 'route_oral',
                impKey: 'opv_booster_imp',
                riskKey: 'opv_booster_risk'
            }
        ]
    }
];

export default function DosesPage() {
    const { t } = useTranslation();
    const { role } = useAuth();
    const [expandedAge, setExpandedAge] = useState('age_at_birth');
    
    // Parent features state
    const [childDOB, setChildDOB] = useState('');
    const [completedDoses, setCompletedDoses] = useState({});
    const [remindersEnabled, setRemindersEnabled] = useState(false);
    
    // Load saved data on mount
    useEffect(() => {
        const savedDOB = localStorage.getItem('childDOB');
        const savedDoses = localStorage.getItem('completedDoses');
        const savedReminders = localStorage.getItem('remindersEnabled');
        
        if (savedDOB) setChildDOB(savedDOB);
        if (savedDoses) setCompletedDoses(JSON.parse(savedDoses));
        if (savedReminders) setRemindersEnabled(savedReminders === 'true');
    }, []);

    // Save functions
    const handeDOBChange = (e) => {
        const val = e.target.value;
        setChildDOB(val);
        localStorage.setItem('childDOB', val);
    };

    const toggleDose = (vaccineName) => {
        const newDoses = {
            ...completedDoses,
            [vaccineName]: !completedDoses[vaccineName]
        };
        setCompletedDoses(newDoses);
        localStorage.setItem('completedDoses', JSON.stringify(newDoses));
    };

    const toggleReminders = () => {
        const newVal = !remindersEnabled;
        setRemindersEnabled(newVal);
        localStorage.setItem('remindersEnabled', newVal);
        
        // Normally, this would request push notification permissions
        if (newVal) {
            alert(t('reminders_enabled_msg', 'Reminders enabled! You will be notified before upcoming doses.'));
        }
    };

    return (
        <div className="space-y-6 slide-up">
            <div className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative z-10 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-clinical-blue shrink-0">
                                <Syringe className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-clinical-dark">{t('vaccination_schedule')}</h2>
                                <p className="text-sm sm:text-base text-gray-500">{t('vaccination_subtitle')}</p>
                            </div>
                        </div>
                        
                        {role === 'parent' && (
                            <button 
                                onClick={toggleReminders}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    remindersEnabled 
                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {remindersEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                                {remindersEnabled ? t('reminders_on', 'Reminders On') : t('reminders_off', 'Enable Reminders')}
                            </button>
                        )}
                    </div>

                    {role === 'parent' && (
                        <div className="mt-6 p-4 bg-white/60 backdrop-blur-md border border-clinical-blue/20 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-clinical-blue" />
                                    {t('child_dob', 'Child\'s Date of Birth')}
                                </label>
                                <p className="text-xs text-gray-500">{t('dob_desc', 'Enter DOB to calculate exact upcoming vaccine dates.')}</p>
                            </div>
                            <input 
                                type="date" 
                                value={childDOB}
                                onChange={handeDOBChange}
                                className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-clinical-blue/50 bg-white shadow-sm"
                            />
                        </div>
                    )}

                    <div className="grid gap-4 mt-8">
                        {VACCINE_SCHEDULE.map((schedule) => (
                            <div 
                                key={schedule.ageKey}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    expandedAge === schedule.ageKey 
                                        ? 'border-clinical-blue bg-white shadow-md' 
                                        : 'border-gray-200 bg-gray-50/50 hover:bg-white cursor-pointer'
                                }`}
                                onClick={() => setExpandedAge(expandedAge === schedule.ageKey ? null : schedule.ageKey)}
                            >
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
                                            expandedAge === schedule.ageKey ? 'bg-clinical-blue text-white' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {t(schedule.ageKey).split(' ')[0]}
                                        </div>
                                        <h3 className={`font-semibold text-sm sm:text-base ${expandedAge === schedule.ageKey ? 'text-clinical-blue' : 'text-gray-700'}`}>
                                            {t(schedule.ageKey)}
                                        </h3>
                                    </div>
                                    <div className="text-gray-400">
                                        {expandedAge === schedule.ageKey ? <ChevronDown className="w-5 h-5 text-clinical-blue" /> : <ChevronRight className="w-5 h-5" />}
                                    </div>
                                </div>
                                
                                {expandedAge === schedule.ageKey && (
                                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-white">
                                        <div className="space-y-3 mt-2">
                                            {schedule.vaccines.map((vaccine, idx) => {
                                                const isCompleted = completedDoses[vaccine.name];
                                                
                                                return (
                                                    <div key={idx} className={`flex items-start gap-3 sm:gap-4 p-4 rounded-xl transition-colors ${
                                                        isCompleted ? 'bg-green-50/50 border border-green-100' : 'bg-gray-50 border border-transparent'
                                                    }`}>
                                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                                            isCompleted ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'
                                                        }`}>
                                                            {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Syringe className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 sm:gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className={`font-semibold text-sm sm:text-base truncate w-full sm:w-auto ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                                                                        {vaccine.name}
                                                                    </h4>
                                                                    {isCompleted && <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{t('completed', 'Done')}</span>}
                                                                </div>
                                                                <div className="flex gap-2 self-start sm:self-auto">
                                                                    {role === 'parent' && (
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); toggleDose(vaccine.name); }}
                                                                            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                                                                                isCompleted 
                                                                                    ? 'bg-transparent text-gray-500 hover:bg-gray-200' 
                                                                                    : 'bg-clinical-blue text-white hover:bg-臨床-blue/90 shadow-sm'
                                                                            }`}
                                                                        >
                                                                            {isCompleted ? t('undo', 'Undo') : t('mark_done', 'Mark Done')}
                                                                        </button>
                                                                    )}
                                                                    <span className="text-[10px] sm:text-xs px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-500 font-medium whitespace-nowrap hidden sm:inline-block">
                                                                        {t(vaccine.routeKey)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className={`text-xs sm:text-sm font-medium mt-1 ${isCompleted ? 'text-green-700/70' : 'text-gray-700'}`}>{t(vaccine.descKey)}</p>
                                                        
                                                        <div className="mt-3 space-y-2 bg-white rounded-lg p-2.5 sm:p-3 border border-gray-100 text-xs sm:text-sm">
                                                            <div>
                                                                <span className="text-[10px] sm:text-xs font-bold text-clinical-blue uppercase tracking-wider block mb-0.5">{t('why_its_important')}</span>
                                                                <span className="text-gray-600 block leading-snug">{t(vaccine.impKey)}</span>
                                                            </div>
                                                            <div className="pt-2 border-t border-gray-50">
                                                                <span className="text-[10px] sm:text-xs font-bold text-red-500 uppercase tracking-wider block mb-0.5">{t('risk_if_missed')}</span>
                                                                <span className="text-red-600/90 block leading-snug">{t(vaccine.riskKey)}</span>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="glass rounded-3xl p-6 relative overflow-hidden">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-1">
                        <Info className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{t('important_note')}</h3>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {t('vaccine_disclaimer')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
