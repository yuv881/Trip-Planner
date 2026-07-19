import { useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { Menu, X, LogOut } from 'lucide-react'

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <div className="flex min-h-screen w-full bg-zinc-50 relative overflow-x-hidden">
            {/* Mobile Header Bar */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 text-white w-full fixed top-0 left-0 z-40 border-b border-zinc-800">
                <Link to='/dashboard' className="font-extrabold text-sm tracking-wide">TRIP PLANNER</Link>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-1 text-zinc-350 hover:text-white focus:outline-hidden cursor-pointer"
                >
                    <Menu size={20} />
                </button>
            </header>

            {/* Sidebar (Responsive Overlay) */}
            <div className={`
                fixed inset-0 z-50 transition-opacity duration-300 md:relative md:block md:w-64 shrink-0
                ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
            `}>
                {/* Backdrop on mobile */}
                <div
                    className="absolute inset-0 bg-black/45 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />

                {/* Sidebar Box */}
                <div className={`
                    w-64 h-full bg-zinc-950 text-white p-4 flex flex-col justify-between absolute left-0 top-0 transition-transform duration-300 md:relative md:translate-x-0 md:h-screen md:sticky md:top-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="space-y-4 w-full">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-850 md:hidden">
                            <span className="font-bold text-[10px] uppercase tracking-wider text-zinc-400">Navigation</span>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-1 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="hidden md:block pb-4 mb-2 border-b border-zinc-850">
                            <span className="font-extrabold text-lg tracking-wide">TRIP PLANNER</span>
                        </div>
                        <Sidebar onClose={() => setIsSidebarOpen(false)} />
                    </div>

                    {/* User profile & Logout */}
                    <div className="pt-4 border-t border-zinc-850 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs uppercase text-zinc-300 shrink-0">
                                {user?.name ? user.name[0] : 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold truncate text-zinc-200">{user?.name || 'User'}</p>
                                <p className="text-[10px] text-zinc-500 truncate">{user?.email || ''}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-zinc-850/50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 min-w-0">
                <Outlet />
            </main>
        </div>
    )
}

export default Dashboard