import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Settings,
    FileText,
    CheckSquare,
    ShieldAlert,
    Calculator,
    ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    mobile?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ mobile, onClose }: SidebarProps) => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Settings, label: 'Setup', path: '/setup' },
        { icon: FileText, label: 'Transactions', path: '/transactions' },
        { icon: CheckSquare, label: 'QC', path: '/qc', active: true },
        { icon: ShieldAlert, label: 'HSE', path: '/hse' },
        { icon: Calculator, label: 'Estimation', path: '/estimation' },
    ];

    if (mobile) {
        return (
            <aside className="bg-white w-64 h-full flex flex-col shadow-2xl">
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900 italic tracking-tighter">BLUE RHINE</h1>
                        <span className="text-[10px] tracking-[0.2em] text-gray-400 font-bold block uppercase">Industries</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </div>

                <nav className="flex-1 p-3 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                location.pathname.startsWith(item.path) || item.active
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-700"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", location.pathname.startsWith(item.path) ? "text-white" : "text-gray-500")} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        );
    }

    return (
        <nav className="bg-white border-b flex items-center justify-between px-4 md:px-8 h-16 shadow-sm z-30 sticky top-0 w-full">
            <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold italic text-xs">BR</div>
                    <div className="hidden lg:block">
                        <h1 className="text-lg font-bold text-blue-900 italic tracking-tighter leading-none">BLUE RHINE</h1>
                        <span className="text-[8px] tracking-[0.2em] text-gray-400 font-bold block uppercase leading-none">Industries</span>
                    </div>
                </div>

                {/* Desktop Navigation Items */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                location.pathname.startsWith(item.path) || item.active
                                    ? "text-blue-700 bg-blue-50"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Right Side - kept minimal as requested (initially contained logout/profile) */}
            {/* The user requested to remove logout and profile section, so we keep this empty or minimal */}
        </nav>
    );
};
