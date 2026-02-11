import React, { useState, createContext, useContext } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

// Create a context to share search state
interface LayoutContextType {
    searchQuery: string;
}
export const LayoutContext = createContext<LayoutContextType>({ searchQuery: '' });
export const useLayout = () => useContext(LayoutContext);

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <LayoutContext.Provider value={{ searchQuery }}>
            <div className="min-h-screen bg-gray-50/50 flex overflow-hidden font-sans">
                {/* Desktop Sidebar */}
                <div className="hidden md:block h-screen shadow-xl z-20 sticky top-0">
                    <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
                </div>

                {/* Mobile Sidebar (Drawer) */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setMobileMenuOpen(false)}
                        ></div>
                        <div className="absolute inset-y-0 left-0 w-64 animate-in slide-in-from-left duration-200">
                            <Sidebar
                                collapsed={false}
                                setCollapsed={() => { }}
                                mobile
                                onClose={() => setMobileMenuOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Header
                        onMobileMenuToggle={() => setMobileMenuOpen(true)}
                        onSearch={setSearchQuery}
                    />

                    <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-8 relative">
                        {/* Background pattern for visual interest */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(#4d8b98 1px, transparent 1px)',
                                backgroundSize: '24px 24px'
                            }}>
                        </div>
                        <div className="relative z-0">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </LayoutContext.Provider>
    );
};
