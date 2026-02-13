import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        <header className="h-16 bg-white/80 backdrop-blur-md border-b sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between transition-all md:hidden">
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
                {/* Profile section removed as requested */}
            </div>
        </header>
    );
};
