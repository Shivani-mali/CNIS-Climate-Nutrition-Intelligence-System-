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
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t('vaccination_schedule')}</h2>
                    <p className="text-sm text-slate-500">{t('vaccination_subtitle') || 'Track and manage essential childhood immunizations'}</p>
                </div>
                
                {role === 'parent' && (
                    <button 
                        onClick={toggleReminders}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            remindersEnabled 
                                ? 'bg-clinical-blue text-white shadow-md' 
                                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 hover:text-gray-700'
                        }`}
                    >
                        {remindersEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                        {remindersEnabled ? t('reminders_on', 'Reminders On') : t('reminders_off', 'Enable Reminders')}
                    </button>
                )}
            </div>

            {role === 'parent' && (
                <div className="glass p-5 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 bg-white shadow-sm">
                    <div className="flex-1">
                        <label className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-clinical-blue" />
                            {t('child_dob', 'Child\'s Date of Birth')}
                        </label>
                        <p className="text-[11px] text-gray-500 font-medium">{t('dob_desc', 'Enter DOB to calculate exact upcoming vaccine dates.')}</p>
                    </div>
                    <input 
                        type="date" 
                        value={childDOB}
                        onChange={handeDOBChange}
                        className="px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-clinical-blue focus:ring-0 bg-white text-slate-900 font-bold outline-none"
                    />
                </div>
            )}

            <div className="grid gap-4">
                {VACCINE_SCHEDULE.map((schedule) => (
                    <div 
                        key={schedule.ageKey}
                        className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                            expandedAge === schedule.ageKey 
                                ? 'border-clinical-blue bg-white shadow-md' 
                                : 'border-gray-50 bg-white hover:border-gray-100 hover:shadow-sm cursor-pointer'
                        }`}
                        onClick={() => setExpandedAge(expandedAge === schedule.ageKey ? null : schedule.ageKey)}
                    >
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                                    expandedAge === schedule.ageKey ? 'bg-clinical-blue text-white' : 'bg-gray-100 text-gray-400'
                                }`}>
                                    {t(schedule.ageKey).split(' ')[0]}
                                </div>
                                <h3 className={`font-bold text-base ${expandedAge === schedule.ageKey ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {t(schedule.ageKey)}
                                </h3>
                            </div>
                            <div className="text-gray-300">
                                {expandedAge === schedule.ageKey ? <ChevronDown className="w-5 h-5 text-clinical-blue" /> : <ChevronRight className="w-5 h-5" />}
                            </div>
                        </div>
                        
                        {expandedAge === schedule.ageKey && (
                            <div className="px-4 pb-4 bg-white border-t border-gray-50">
                                <div className="space-y-4 mt-4">
                                    {schedule.vaccines.map((vaccine, idx) => {
                                        const isCompleted = completedDoses[vaccine.name];
                                        
                                        return (
                                            <div key={idx} className={`p-4 rounded-xl border-2 transition-all ${
                                                isCompleted ? 'bg-green-50/20 border-green-100' : 'bg-white border-gray-50 hover:border-gray-100'
                                            }`}>
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                                                        isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Syringe className="w-6 h-6" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className={`font-black text-lg ${isCompleted ? 'text-green-800' : 'text-slate-900'}`}>
                                                                    {vaccine.name}
                                                                </h4>
                                                                {isCompleted && (
                                                                    <span className="text-[10px] uppercase font-black text-white bg-green-500 px-2 py-0.5 rounded-full shadow-sm">
                                                                        {t('completed', 'Done')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {role === 'parent' && (
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); toggleDose(vaccine.name); }}
                                                                        className={`text-[11px] px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
                                                                            isCompleted 
                                                                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                                                                : 'bg-clinical-blue text-white hover:bg-clinical-dark'
                                                                        }`}
                                                                    >
                                                                        {isCompleted ? t('undo', 'Undo') : t('mark_done', 'Mark Done')}
                                                                    </button>
                                                                )}
                                                                <span className="text-[10px] px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-slate-500 font-bold uppercase tracking-wider">
                                                                    {t(vaccine.routeKey)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className={`text-sm font-bold leading-snug ${isCompleted ? 'text-slate-600/80' : 'text-slate-600'}`}>
                                                            {t(vaccine.descKey)}
                                                        </p>
                                                    
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                                            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
                                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">{t('why_its_important')}</span>
                                                                <span className="text-slate-800 text-[13px] font-bold block leading-relaxed">{t(vaccine.impKey)}</span>
                                                            </div>
                                                            <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 shadow-sm">
                                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-1">{t('risk_if_missed')}</span>
                                                                <span className="text-slate-800 text-[13px] font-bold block leading-relaxed">{t(vaccine.riskKey)}</span>
                                                            </div>
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

            <div className="glass p-5 rounded-2xl flex items-start gap-4 border border-amber-100 bg-white shadow-sm">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-soft">
                    <Info className="w-5 h-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-black text-slate-900 leading-tight">{t('important_note')}</h3>
                    <p className="text-xs text-slate-600 font-bold leading-relaxed pr-6">
                        {t('vaccine_disclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
}
