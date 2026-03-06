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
        <div className="space-y-6">
            <div className="glass p-6 rounded-3xl shadow-sm border border-gray-200/50">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-clinical-dark flex items-center gap-2">
                            <UtensilsCrossed className="w-8 h-8 text-green-600" />
                            {t('diet_plan_title', 'Malnutrition Recovery Diet Plan')}
                        </h1>
                        <p className="text-gray-500 mt-1">Age-wise dietary recommendations for recovering children</p>
                    </div>

                    {/* Veg / Non-Veg Toggle */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-2xl w-full md:w-auto">
                        <button
                            onClick={() => setIsNonVeg(false)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${!isNonVeg ? 'bg-green-500 text-white shadow-md shadow-green-200' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
                        >
                            <span className="w-3 h-3 rounded-full border-2 border-current flex items-center justify-center">
                                <span className={`w-1.5 h-1.5 rounded-full ${!isNonVeg ? 'bg-white' : 'bg-transparent'}`}></span>
                            </span>
                            {t('diet_plan_veg', 'Vegetarian')}
                        </button>
                        <button
                            onClick={() => setIsNonVeg(true)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${isNonVeg ? 'bg-red-500 text-white shadow-md shadow-red-200' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                        >
                            <span className="w-3 h-3 rounded-sm border-2 border-current flex items-center justify-center">
                                <span className={`w-1.5 h-1.5 rounded-full ${isNonVeg ? 'bg-white' : 'bg-transparent'}`}></span>
                            </span>
                            {t('diet_plan_nonveg', 'Non-Veg')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietPlans.map((plan, index) => (
                    <div key={index} className="glass p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-200/50 group relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-colors duration-500 ${isNonVeg ? 'bg-red-500' : 'bg-green-500'}`}></div>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl flex-shrink-0">
                                {plan.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{plan.ageGroup}</h3>
                                <div className={`mt-3 p-3 rounded-2xl text-sm leading-relaxed transition-colors duration-300 ${isNonVeg ? 'bg-red-50/50 text-red-900' : 'bg-green-50/50 text-green-900'}`}>
                                    {isNonVeg ? plan.nonVeg : plan.veg}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="glass p-4 rounded-2xl flex items-center gap-3 border border-blue-100 bg-blue-50/30">
                <Info className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                    <strong>{t('tips')}:</strong> {t('diet_plan_tip', 'These are general guidelines. Always consult with a healthcare provider or nutritionist for a personalized diet plan based on the child\'s specific health conditions and severity of malnutrition.')}
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
