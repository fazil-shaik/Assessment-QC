import { Search, Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface HeaderProps {
    onMobileMenuToggle: () => void;
    onSearch: (query: string) => void;
}

export const Header = ({ onMobileMenuToggle, onSearch }: HeaderProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between transition-all">
            <div className="flex items-center gap-4 flex-1">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMobileMenuToggle}>
                    <Menu className="w-6 h-6 text-gray-700" />
                </Button>

                <h2 className="text-xl font-bold text-gray-800 hidden md:block">QC Module</h2>

                <div className="relative max-w-md w-full ml-4 md:ml-8 hidden sm:block group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Work Orders, Projects..."
                        className="block w-full pl-10 pr-3 py-2 border-none rounded-full leading-5 bg-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all sm:text-sm"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Button>

                <div className="flex items-center gap-3 md:pl-6 md:border-l border-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800 leading-none">Mayank A.</p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Inspector</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px]">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-700" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
