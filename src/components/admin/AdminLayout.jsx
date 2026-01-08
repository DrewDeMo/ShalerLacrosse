import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Trophy, Users, LogOut } from 'lucide-react';

export default function AdminLayout() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { to: '/admin/games', icon: Calendar, label: 'Games' },
        { to: '/admin/results', icon: Trophy, label: 'Results' },
        { to: '/admin/players', icon: Users, label: 'Players' },
    ];

    return (
        <div className="min-h-screen bg-off-white flex flex-col">
            {/* Header */}
            <header className="bg-navy border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red rounded-xl flex items-center justify-center">
                                <span className="font-bebas text-2xl text-white">T</span>
                            </div>
                            <div>
                                <h1 className="font-bebas text-2xl text-white tracking-wide">
                                    TITANS ADMIN
                                </h1>
                                <p className="text-white/60 text-sm">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-white text-sm transition-colors"
                            >
                                View Site →
                            </a>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${isActive
                                        ? 'border-red text-navy'
                                        : 'border-transparent text-navy/60 hover:text-navy'
                                    }`
                                }
                            >
                                <item.icon size={20} />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm text-navy/60">
                        Backend system designed & maintained by{' '}
                        <a
                            href="https://github.com/DrewDeMo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red hover:text-red/80 font-medium transition-colors"
                        >
                            Drew DeMaiolo
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
