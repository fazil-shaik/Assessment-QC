import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Settings,
    FileText,
    CheckSquare,
    ShieldAlert,
    Calculator,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    mobile?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ collapsed, setCollapsed, mobile, onClose }: SidebarProps) => {
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
        <aside
            className={cn(
                "bg-white border-r flex flex-col transition-all duration-300 ease-in-out z-20",
                mobile ? "w-64 h-full" : collapsed ? "w-20" : "w-64",
                mobile && "absolute top-0 left-0 bottom-0 shadow-2xl"
            )}
        >
            <div className={cn("p-6 flex items-center justify-between", collapsed && !mobile && "justify-center p-4")}>
                {!collapsed || mobile ? (
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900 italic tracking-tighter">BLUE RHINE</h1>
                        <span className="text-[10px] tracking-[0.2em] text-gray-400 font-bold block uppercase">Industries</span>
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold italic">BR</div>
                )}

                {mobile && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                )}
            </div>

            <nav className="flex-1 p-3 space-y-2 mt-4">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        onClick={mobile ? onClose : undefined}
                        className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                            location.pathname.startsWith(item.path) || item.active
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : "text-gray-500 hover:bg-blue-50 hover:text-blue-700",
                            collapsed && !mobile && "justify-center px-2 py-3"
                        )}
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon className={cn("w-5 h-5 flex-shrink-0", location.pathname.startsWith(item.path) ? "text-white" : "text-gray-500 group-hover:text-blue-600")} />
                        {(!collapsed || mobile) && <span>{item.label}</span>}

                        {/* Tooltip for collapsed mode */}
                        {collapsed && !mobile && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                {item.label}
                            </div>
                        )}
                    </Link>
                ))}
            </nav>

            {!mobile && (
                <div className="p-4 border-t flex justify-center">
                    <Button
                        variant="ghost"
                        size={collapsed ? "icon" : "sm"}
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </Button>
                </div>
            )}

            <div className="p-4 border-t">
                <button className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors",
                    collapsed && !mobile && "justify-center"
                )}>
                    <LogOut className="w-5 h-5" />
                    {(!collapsed || mobile) && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};
