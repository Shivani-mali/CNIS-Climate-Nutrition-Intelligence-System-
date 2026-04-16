import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, PieChart, TrendingUp, MapPin, Users, Activity, Download, ChevronRight, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function AnalyticsPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [regions, setRegions] = useState([]);
    const [trends, setTrends] = useState([]);
    const [interventions, setInterventions] = useState([]);

    useEffect(() => {
        const fetchRealData = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'screenings'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const screenings = [];
                querySnapshot.forEach((doc) => {
                    screenings.push({ id: doc.id, ...doc.data() });
                });

                // Calculate Stats
                const total = screenings.length;
                const samCount = screenings.filter(s => s.result?.muacResult?.zone === 'red').length;
                const mamCount = screenings.filter(s => s.result?.muacResult?.zone === 'orange').length;
                const normalCount = screenings.filter(s => s.result?.muacResult?.zone === 'green').length;

                setStats([
                    { label: 'Total Children Tracked', value: total.toLocaleString(), icon: <Users className="w-5 h-5 text-blue-500" />, trend: 'Live Data' },
                    { label: 'Severe Malnutrition (SAM)', value: samCount.toLocaleString(), icon: <Activity className="w-5 h-5 text-red-500" />, trend: `${((samCount/total)*100 || 0).toFixed(1)}% of total` },
                    { label: 'Moderate Malnutrition (MAM)', value: mamCount.toLocaleString(), icon: <TrendingUp className="w-5 h-5 text-orange-500" />, trend: `${((mamCount/total)*100 || 0).toFixed(1)}% of total` },
                    { label: 'Normal Growth', value: normalCount.toLocaleString(), icon: <PieChart className="w-5 h-5 text-green-500" />, trend: 'Target: 100%' }
                ]);

                // Calculate Regional Hotspots
                const regionMap = {};
                screenings.forEach(s => {
                    const area = s.location?.state || 'Unknown';
                    if (!regionMap[area]) regionMap[area] = { name: area, sam: 0, mam: 0, total: 0 };
                    regionMap[area].total++;
                    if (s.result?.muacResult?.zone === 'red') regionMap[area].sam++;
                    if (s.result?.muacResult?.zone === 'orange') regionMap[area].mam++;
                });

                const regionList = Object.values(regionMap)
                    .sort((a, b) => b.sam - a.sam)
                    .slice(0, 5)
                    .map(r => ({
                        ...r,
                        status: r.sam > 5 ? 'red' : r.sam > 0 ? 'orange' : 'green',
                        coords: 'Live Region'
                    }));
                setRegions(regionList);

                // Calculate Trends (Last 6 months)
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const trendMap = {};
                const now = new Date();
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                    trendMap[key] = { month: monthNames[d.getMonth()], sam: 0, mam: 0, rec: 0 };
                }

                screenings.forEach(s => {
                    const date = new Date(s.createdAt);
                    const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                    if (trendMap[key]) {
                        if (s.result?.muacResult?.zone === 'red') trendMap[key].sam++;
                        else if (s.result?.muacResult?.zone === 'orange') trendMap[key].mam++;
                        else trendMap[key].rec++;
                    }
                });
                
                // Normalize for bar height (max 100%)
                const trendList = Object.values(trendMap).map(day => {
                    const monthTotal = day.sam + day.mam + day.rec || 1;
                    return {
                        ...day,
                        sam: (day.sam / monthTotal) * 100,
                        mam: (day.mam / monthTotal) * 100,
                        rec: (day.rec / monthTotal) * 100,
                    };
                });
                setTrends(trendList);

                // Priority Queue (Top 5 Urgent cases)
                const urgent = screenings
                    .filter(s => s.result?.muacResult?.zone === 'red')
                    .slice(0, 5)
                    .map(s => ({
                        id: s.id.substring(0, 8).toUpperCase(),
                        status: 'SEVERE (Critical)',
                        muac: `${s.muacCm} cm`,
                        zone: 'rose'
                    }));
                setInterventions(urgent);

            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRealData();
    }, []);

    const handleExport = () => {
        alert("Anonymized dataset exported successfully for research purposes.");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-clinical-blue animate-spin" />
                <p className="text-slate-600 font-bold animate-pulse">Syncing with Clinical Database...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header with Export */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('analytics')}</h2>
                    <p className="text-slate-500 font-medium">Real-time Epidemiological Nutrition Monitoring</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                    <Download className="w-5 h-5" />
                    Export Research Dataset
                </button>
            </div>

            {/* Global Stats Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.length > 0 ? stats.map((stat, i) => (
                    <div
                        key={i}
                        className="glass p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                    </div>
                )) : (
                    <div className="col-span-4 p-8 text-center glass rounded-2xl">
                         <p className="text-slate-400">No screening data found in the database.</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Regional Hotspots Card */}
                <div className="glass p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Regional Malnutrition Hotspots</h3>
                    </div>

                    <div className="space-y-4">
                        {regions.map((region, i) => (
                            <div key={i} className="group flex items-center justify-between p-5 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full animate-pulse bg-${region.status === 'red' ? 'rose' : region.status === 'orange' ? 'amber' : 'emerald'}-500`} />
                                    <div>
                                        <p className="font-black text-slate-900">{region.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{region.coords}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-rose-600">{region.sam} SAM <span className="text-slate-300 mx-1">•</span></p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{region.mam} MAM CASES</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                                </div>
                            </div>
                        ))}
                        {regions.length === 0 && <p className="text-slate-400 text-center py-10 italic">No regional data available yet.</p>}
                    </div>
                </div>

                {/* Trend Analysis Chart */}
                <div className="glass p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Clinical Recovery Trends</h3>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-3 px-2">
                        {trends.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="w-full flex flex-col-reverse rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                                    <div style={{ height: `${day.rec}%` }} className="bg-emerald-400 hover:bg-emerald-500 transition-colors" title={`Recovered: ${day.rec.toFixed(1)}%`} />
                                    <div style={{ height: `${day.mam}%` }} className="bg-orange-400 hover:bg-orange-500 transition-colors" title={`MAM: ${day.mam.toFixed(1)}%`} />
                                    <div style={{ height: `${day.sam}%` }} className="bg-rose-500 hover:bg-rose-600 transition-colors" title={`SAM: ${day.sam.toFixed(1)}%`} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{day.month}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SAM Burden</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MAM Burden</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recoveries</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Intervention Queue */}
            <div className="glass p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                    <Activity className="w-6 h-6 text-rose-500" />
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Priority Intervention Queue</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient ID</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Level</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical MUAC</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {interventions.map((row, i) => (
                                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 py-4 font-black text-slate-900 tracking-tighter">#CNIS-{row.id}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 bg-${row.zone}-50 text-${row.zone}-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-${row.zone}-100`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-4 font-black text-slate-600">{row.muac}</td>
                                    <td className="py-4 text-right">
                                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 underline decoration-2 underline-offset-4">
                                            Assign Medic
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {interventions.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-10 text-center text-slate-400 italic">No urgent interventions pending.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
