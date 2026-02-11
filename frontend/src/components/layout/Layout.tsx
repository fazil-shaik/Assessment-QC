import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Settings,
    FileText,
    CheckSquare,
    ShieldAlert,
    Calculator,
    Search,
    Bell,
    User,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Settings, label: 'Setup', path: '/setup' },
        { icon: FileText, label: 'Transactions', path: '/transactions' },
        { icon: CheckSquare, label: 'QC', path: '/qc', active: true },
        { icon: ShieldAlert, label: 'HSE', path: '/hse' },
        { icon: Calculator, label: 'Estimation', path: '/estimation' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-blue-900 italic">BLUE RHINE</h1>
                    <span className="text-xs tracking-widest text-gray-500 font-semibold block mt-1">INDUSTRIES</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                location.pathname.startsWith(item.path) || item.active
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">QC Module</h2>
                        <div className="relative ml-8 w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Here..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </Button>
                        <div className="flex items-center gap-3 border-l pl-4">
                            <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center overflow-hidden">
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">Mayank Agarwal</p>
                                <p className="text-xs text-gray-500">Ajman, Dubai</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
