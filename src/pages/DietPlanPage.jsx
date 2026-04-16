import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Baby, Utensils, Sprout, Carrot, Wheat, Apple, Info, UtensilsCrossed } from 'lucide-react';

export function DietPlanContent() {
    const { t } = useTranslation();
    const [isNonVeg, setIsNonVeg] = useState(false);

    const dietPlans = [
        {
            icon: <Baby className="w-6 h-6 text-indigo-500" />,
            ageGroup: t('dp_age_0_6', "Infants (0–6 months)"),
            veg: t('dp_v_0_6', "Exclusive breastfeeding or iron-fortified formula. (No difference at this stage — animal/plant sources aren't introduced yet.)"),
            nonVeg: t('dp_nv_0_6', "Exclusive breastfeeding or iron-fortified formula. (No difference at this stage — animal/plant sources aren't introduced yet.)")
        },
        {
            icon: <Utensils className="w-6 h-6 text-orange-500" />,
            ageGroup: t('dp_age_6_12', "Infants (6–12 months)"),
            veg: t('dp_v_6_12', "Mashed banana, apple puree, dal, khichdi, mashed potato, soft cooked spinach."),
            nonVeg: t('dp_nv_6_12', "Same base foods + mashed egg yolk, pureed chicken/fish.")
        },
        {
            icon: <Sprout className="w-6 h-6 text-green-500" />,
            ageGroup: t('dp_age_1_3', "Toddlers (1–3 years)"),
            veg: t('dp_v_1_3', "Milk, paneer, curd, dal, beans, soy chunks, ragi porridge, fruits/vegetables."),
            nonVeg: t('dp_nv_1_3', "Add boiled egg, chicken soup, fish curry (soft, boneless).")
        },
        {
            icon: <Carrot className="w-6 h-6 text-amber-500" />,
            ageGroup: t('dp_age_4_6', "Preschool (4–6 years)"),
            veg: t('dp_v_4_6', "Chapati + dal + sabzi + curd; snacks like sprouts, boiled corn, nuts."),
            nonVeg: t('dp_nv_4_6', "Same base + egg curry, chicken stew, fish rice.")
        },
        {
            icon: <Wheat className="w-6 h-6 text-yellow-600" />,
            ageGroup: t('dp_age_7_9', "School Age (7–9 years)"),
            veg: t('dp_v_7_9', "Spinach, beetroot, jaggery, dates, soy, pulses, milk, ragi."),
            nonVeg: t('dp_nv_7_9', "Include lean meat, chicken, fish, eggs for protein and iron.")
        },
        {
            icon: <Apple className="w-6 h-6 text-red-500" />,
            ageGroup: t('dp_age_10_19', "Adolescents (10–19 years)"),
            veg: t('dp_v_10_19', "Ragi, sesame seeds, soy, pulses, paneer, milk, fruits, vegetables."),
            nonVeg: t('dp_nv_10_19', "Eggs, chicken, fish, lean meat, plus the same veg base.")
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{t('diet_plan_title', 'Diet Plan')}</h2>
                    <p className="text-sm font-bold text-slate-500">{t('diet_plan_subtitle') || 'Age-wise dietary recommendations for child nutrition'}</p>
                </div>

                {/* Veg / Non-Veg Toggle - Matching Reports button style */}
                <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-auto border border-gray-100 dark:border-slate-700">
                    <button
                        onClick={() => setIsNonVeg(false)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold transition-all duration-300 ${!isNonVeg ? 'bg-clinical-blue text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        {t('diet_plan_veg', 'Vegetarian')}
                    </button>
                    <button
                        onClick={() => setIsNonVeg(true)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold transition-all duration-300 ${isNonVeg ? 'bg-clinical-blue text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        {t('diet_plan_nonveg', 'Non-Veg')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietPlans.map((plan, index) => (
                    <div key={index} className="glass p-5 rounded-2xl border border-gray-100 dark:border-slate-800 card-hover bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${index % 4 === 0 ? 'bg-blue-50' : index % 4 === 1 ? 'bg-red-50' : index % 4 === 2 ? 'bg-orange-50' : 'bg-green-50'}`}>
                            <span className="flex items-center justify-center">
                                {plan.icon}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-slate-900 text-lg">{plan.ageGroup}</h3>
                            <div className="mt-2 text-[13px] text-slate-700 font-bold leading-relaxed">
                                {isNonVeg ? plan.nonVeg : plan.veg}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="glass p-4 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                    <strong className="text-slate-900 font-black">{t('tips')}:</strong> {t('diet_plan_tip', 'These are general guidelines. Always consult with a healthcare provider or nutritionist for a personalized diet plan based on the child\'s specific health conditions and severity of malnutrition.')}
                </p>
            </div>
        </div>
    );
}

export default function DietPlanPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <DietPlanContent />
        </div>
    );
}
