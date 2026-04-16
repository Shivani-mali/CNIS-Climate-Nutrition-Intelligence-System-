import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Lock, Mic } from 'lucide-react';
import logo from '../assets/logo.png';

export default function LoginPage() {
    const { t } = useTranslation();
    const { loginWithGoogle } = useAuth();

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-200/30 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-clinical-accent/20 blur-3xl" />
                <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-primary-100/40 blur-2xl" />
            </div>

            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Card */}
                <div className="glass rounded-[2.5rem] p-10 shadow-2xl border border-clinical-blue/20 backdrop-blur-2xl bg-white/95">
                    {/* Logo Section */}
                    <div className="text-center mb-10">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white flex items-center justify-center shadow-xl p-3 border border-gray-100 ring-4 ring-clinical-blue/5">
                             <img src={logo} alt="CNIS" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-1">
                            {t('app_name')}
                        </h1>
                        <p className="text-base text-slate-700 font-bold">
                            {t('app_full_name')}
                        </p>
                        <div className="mt-4 px-4 py-1.5 bg-clinical-blue rounded-full inline-block shadow-sm">
                            <p className="text-[10px] text-white font-bold uppercase tracking-[0.2em]">
                                AI-Powered Nutrition Intelligence
                            </p>
                        </div>
                    </div>

                    {/* Welcome text */}
                    <div className="text-center mb-10">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                            {t('welcome_back', 'Welcome Back')}
                        </h2>
                        <p className="text-slate-600 text-sm font-medium">
                            {t('login_subtitle', 'Sign in to continue monitoring child nutrition status')}
                        </p>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleLogin}
                        id="login-google-btn"
                        className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] group"
                    >
                        <div className="bg-white p-2 rounded-lg">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg text-white">
                            {t('login')}
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-10">
                        <div className="flex-1 h-0.5 bg-slate-200" />
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">Secure Data Portal</span>
                        <div className="flex-1 h-0.5 bg-slate-200" />
                    </div>

                    {/* Features list */}
                    <div className="space-y-4">
                        {[
                            { icon: <Lock className="w-5 h-5 text-emerald-600" />, text: 'End-to-end encrypted data' },
                            { icon: <Mic className="w-5 h-5 text-clinical-blue" />, text: 'Voice-enabled AI assistance' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-sm text-slate-800 font-bold bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                <span className="flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-100">{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] text-slate-400 font-bold mt-8 uppercase tracking-widest">
                    © 2026 CNIS - Intelligence for Child Nutrition
                </p>
            </div>
        </div>
    );
}
