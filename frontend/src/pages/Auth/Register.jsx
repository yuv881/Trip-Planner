import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { API_BASE } from '../../config/api.js';

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
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
            const res = await fetch(`${API_BASE}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
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
                    <div className="w-6 h-6 rounded-lg bg-zinc-955 text-white flex items-center justify-center font-black text-xs">TP</div>
                    <span className="font-extrabold text-sm tracking-widest text-zinc-800">TRIP PLANNER</span>
                </div>

                {/* Center Content */}
                <div className="relative z-10 space-y-5 my-auto max-w-lg">
                    <h1 className="text-4xl font-extrabold tracking-tight leading-none text-zinc-950">
                        Plan with friends, anywhere.
                    </h1>
                    <p className="text-sm text-zinc-550 font-medium leading-relaxed">
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

            {/* Right Panel: Register Form */}
            <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white">
                <div className="w-full max-w-sm space-y-8 relative z-10">
                    <div className="space-y-2">
                        {/* Mobile branding */}
                        <div className="flex items-center gap-2 lg:hidden mb-6">
                            <div className="w-6 h-6 rounded-lg bg-zinc-955 text-white flex items-center justify-center font-black text-xs">TP</div>
                            <span className="font-extrabold text-xs tracking-widest text-zinc-800">TRIP PLANNER</span>
                        </div>

                        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-955">Create Account</h2>
                        <p className="text-xs text-zinc-455 font-medium">Join us to plan your next travel plan</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl animate-fade-in">
                            <AlertCircle size={15} className="shrink-0" />
                            <span className="font-semibold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Your Name"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-hidden transition-colors"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                                <input
                                    type="text"
                                    required
                                    placeholder="your_username"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-hidden transition-colors"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@domain.com"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-hidden transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    className="w-full pl-10 pr-10 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-hidden transition-colors"
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
                            {loading ? 'Creating...' : 'Register'}
                            <ArrowRight size={14} />
                        </button>
                    </form>

                    <div className="text-center text-xs text-zinc-550 pt-2">
                        Already have an account?{' '}
                        <Link to="/login" className="text-zinc-900 hover:text-zinc-955 font-bold hover:underline transition-colors">
                            Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
