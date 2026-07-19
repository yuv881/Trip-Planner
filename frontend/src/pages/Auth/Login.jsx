import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail, password })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 font-sans overflow-hidden">
            {/* Left Panel: Hero Graphics (Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 bg-zinc-50/50 border-r border-zinc-100 overflow-hidden">
                {/* Soft ambient glows */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-zinc-100 rounded-full blur-[120px] opacity-70" />
                <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-zinc-200/50 rounded-full blur-[120px] opacity-50" />

                {/* Top Branding */}
                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-xs">TP</div>
                    <span className="font-extrabold text-sm tracking-widest text-zinc-800">TRIP PLANNER</span>
                </div>

                {/* Center Content */}
                <div className="relative z-10 space-y-5 my-auto max-w-lg">
                    <h1 className="text-4xl font-extrabold tracking-tight leading-none text-zinc-950">
                        Organize your adventures seamlessly.
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                        A clean, minimal, and premium space to build itineraries, manage budgets, track checklists, and coordinate with friends.
                    </p>
                    <div className="pt-2 flex items-center gap-6 text-xs text-zinc-450 font-bold uppercase tracking-wider">
                        <span>✦ Custom Transport Modes</span>
                        <span>✦ Dynamic Budget Allocator</span>
                    </div>
                </div>

                {/* Bottom Footer Quote */}
                <div className="relative z-10 text-[10px] text-zinc-400 font-semibold tracking-wide">
                    © 2026 TRIP PLANNER INC. ALL RIGHTS RESERVED.
                </div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white">
                <div className="w-full max-w-sm space-y-8 relative z-10">
                    <div className="space-y-2">
                        {/* Mobile branding */}
                        <div className="flex items-center gap-2 lg:hidden mb-6">
                            <div className="w-6 h-6 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-xs">TP</div>
                            <span className="font-extrabold text-xs tracking-widest text-zinc-800">TRIP PLANNER</span>
                        </div>

                        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">Sign In</h2>
                        <p className="text-xs text-zinc-455 font-medium">Access your trip schedules and dashboards</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl animate-fade-in">
                            <AlertCircle size={15} className="shrink-0" />
                            <span className="font-semibold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Username or Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. john_doe or name@domain.com"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-hidden transition-colors"
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2 bg-white border border-zinc-200 rounded-xl text-xs placeholder-zinc-400 focus:border-zinc-955 focus:outline-hidden transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-zinc-450 hover:text-zinc-700 transition-colors cursor-pointer focus:outline-hidden"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all hover:gap-2.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
                        >
                            {loading ? 'Verifying...' : 'Sign In'}
                            <ArrowRight size={14} />
                        </button>
                    </form>

                    <div className="text-center text-xs text-zinc-550 pt-2">
                        New to Trip Planner?{' '}
                        <Link to="/register" className="text-zinc-900 hover:text-zinc-950 font-bold hover:underline transition-colors">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
