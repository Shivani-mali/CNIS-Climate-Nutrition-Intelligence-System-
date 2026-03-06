import { useTranslation } from 'react-i18next';
import { BarChart, PieChart, TrendingUp, MapPin, Users, Activity, Download, ChevronRight } from 'lucide-react';

export default function AnalyticsPage() {
    const { t } = useTranslation();

    // Mock data for analytics
    const stats = [
        { label: 'Total Children Tracked', value: '1,248', icon: <Users className="w-5 h-5 text-blue-500" />, trend: '+12% this month' },
        { label: 'Severe Malnutrition (SAM)', value: '84', icon: <Activity className="w-5 h-5 text-red-500" />, trend: '-3% this month' },
        { label: 'Moderate Malnutrition (MAM)', value: '215', icon: <TrendingUp className="w-5 h-5 text-orange-500" />, trend: '-5% this month' },
        { label: 'Normal Growth', value: '949', icon: <PieChart className="w-5 h-5 text-green-500" />, trend: '+8% this month' }
    ];

    const regions = [
        { name: 'Kharadi North', sam: 24, mam: 45, status: 'red' },
        { name: 'Wagholi East', sam: 18, mam: 32, status: 'orange' },
        { name: 'Viman Nagar', sam: 5, mam: 12, status: 'green' },
        { name: 'Kalyani Nagar', sam: 2, mam: 8, status: 'green' }
    ];

    const handleExport = () => {
        alert("Anonymized dataset exported successfully for research purposes.");
    };

    return (
        <div className="space-y-6 slide-up pb-20 md:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart className="w-6 h-6 text-clinical-blue" />
                        {t('analytics')}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Advanced community health metrics and geographical hotspots.
                    </p>
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-clinical-blue text-white rounded-xl font-medium hover:bg-clinical-dark transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Export Dataset
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass rounded-2xl p-5 border border-gray-100 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                                stat.trend.startsWith('+') && !stat.label.includes('Malnutrition') ? 'bg-green-100 text-green-700' :
                                stat.trend.startsWith('-') && stat.label.includes('Malnutrition') ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                            <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Geographic Hotspots */}
                <div className="glass rounded-2xl border border-gray-100 p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-500" />
                            Regional Hotspots
                        </h2>
                    </div>
                    
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-hidden relative min-h-[250px] border border-gray-200">
                        {/* Placeholder for actual map */}
                        <div className="absolute inset-0 bg-slate-200 opacity-50 flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-slate-400 opacity-50" />
                        </div>
                        
                        <div className="relative z-10 space-y-3">
                            {regions.map((region, i) => (
                                <div key={i} className="flex items-center justify-between bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-white/50 shadow-sm">
                                    <span className="font-semibold text-gray-700">{region.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-red-600">{region.sam} SAM</span>
                                            <span className="text-xs font-medium text-orange-500">{region.mam} MAM</span>
                                        </div>
                                        <div className={`w-3 h-3 rounded-full ${
                                            region.status === 'red' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 
                                            region.status === 'orange' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 
                                            'bg-green-500'
                                        }`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trend Analysis (Mock Chart) */}
                <div className="glass rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            6-Month Recovery Trend
                        </h2>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 border border-gray-100 h-[250px] flex items-end gap-2 sm:gap-4 relative px-2 sm:px-6">
                        {/* Y-axis labels */}
                        <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between text-[10px] text-gray-400">
                            <span>100</span>
                            <span>75</span>
                            <span>50</span>
                            <span>25</span>
                            <span>0</span>
                        </div>
                        
                        <div className="flex-1 flex items-end justify-between h-52 ml-6 pb-6 relative z-10">
                            {/* Grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between border-b border-gray-100">
                                <div className="border-t border-gray-100/50 w-full h-0"></div>
                                <div className="border-t border-gray-100/50 w-full h-0"></div>
                                <div className="border-t border-gray-100/50 w-full h-0"></div>
                                <div className="border-t border-gray-100 w-full h-0"></div>
                            </div>

                            {/* Bars */}
                            {[
                                { month: 'Sep', sam: 80, mam: 120, rec: 30 },
                                { month: 'Oct', sam: 75, mam: 110, rec: 45 },
                                { month: 'Nov', sam: 60, mam: 95, rec: 60 },
                                { month: 'Dec', sam: 50, mam: 80, rec: 75 },
                                { month: 'Jan', sam: 45, mam: 70, rec: 85 },
                                { month: 'Feb', sam: 30, mam: 50, rec: 110 },
                            ].map((data, i) => (
                                <div key={i} className="flex flex-col items-center flex-1 z-10 group">
                                    <div className="flex w-full max-w[32px] justify-center items-end gap-0.5 sm:gap-1.5 h-full relative">
                                        <div className="w-2 sm:w-4 bg-red-400 rounded-t-sm transition-all duration-500 group-hover:bg-red-500" style={{ height: `${data.sam}%` }}></div>
                                        <div className="w-2 sm:w-4 bg-orange-400 rounded-t-sm transition-all duration-500 group-hover:bg-orange-500" style={{ height: `${data.mam}%` }}></div>
                                        <div className="w-2 sm:w-4 bg-green-400 rounded-t-sm transition-all duration-500 group-hover:bg-green-500" style={{ height: `${data.rec}%` }}></div>
                                    </div>
                                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium mt-2">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-[10px] sm:text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400"></div> SAM Cases</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400"></div> MAM Cases</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400"></div> Recoveries</div>
                    </div>
                </div>
            </div>
            
            <div className="glass rounded-2xl border border-gray-100 p-5 mt-6 mb-10">
                 <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Clinical Interventions Queue
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-sm">
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 p-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                        <div className="col-span-2 sm:col-span-1">Patient ID</div>
                        <div className="hidden sm:block">Status</div>
                        <div>MUAC</div>
                        <div className="col-span-1 sm:col-span-2 text-right">Action</div>
                    </div>
                    {[
                        { id: 'PT-8924', status: 'SAM', muac: '10.5 cm', urgency: 'Urgent' },
                        { id: 'PT-8925', status: 'MAM', muac: '11.8 cm', urgency: 'Review' },
                        { id: 'PT-8926', status: 'SAM', muac: '11.0 cm', urgency: 'Urgent' },
                    ].map((pt, i) => (
                        <div key={i} className="grid grid-cols-4 sm:grid-cols-5 gap-4 p-3 border-b border-gray-100 hover:bg-gray-50 items-center transition-colors">
                            <div className="col-span-2 sm:col-span-1 font-mono font-medium text-gray-800">{pt.id}</div>
                            <div className="hidden sm:block">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${pt.status === 'SAM' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {pt.status}
                                </span>
                            </div>
                            <div className="text-gray-600">{pt.muac}</div>
                            <div className="col-span-1 sm:col-span-2 text-right">
                                <button className="text-clinical-blue font-semibold text-xs hover:underline inline-flex items-center gap-1">
                                    {pt.urgency === 'Urgent' ? 'Prescribe RUTF' : 'View File'} <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
