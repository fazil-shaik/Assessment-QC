import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Checkpoint {
    id: string;
    label: string;
    value: 'pass' | 'fail' | null;
}

interface CheckpointCardProps {
    title: string;
    checkpoints: Checkpoint[];
    onToggle: (id: string, value: 'pass' | 'fail') => void;
    colorClass?: string;
}

export const CheckpointCard = ({ title, checkpoints, onToggle, colorClass = "bg-teal-700" }: CheckpointCardProps) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader className={cn("py-3 px-4", colorClass)}>
                <CardTitle className="text-white text-sm font-bold uppercase tracking-wide">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {checkpoints.map((cp) => (
                        <div key={cp.id} className="flex flex-col space-y-1">
                            <span className="text-xs font-semibold text-gray-500">{cp.label}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onToggle(cp.id, 'pass')}
                                    className={cn(
                                        "flex-1 px-3 py-1 rounded text-xs font-medium border transition-colors flex items-center justify-center gap-1",
                                        cp.value === 'pass'
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-white text-gray-400 hover:bg-gray-50"
                                    )}
                                >
                                    <Check className="w-3 h-3" /> Yes
                                </button>
                                <button
                                    onClick={() => onToggle(cp.id, 'fail')}
                                    className={cn(
                                        "flex-1 px-3 py-1 rounded text-xs font-medium border transition-colors flex items-center justify-center gap-1",
                                        cp.value === 'fail'
                                            ? "bg-red-100 text-red-700 border-red-200"
                                            : "bg-white text-gray-400 hover:bg-gray-50"
                                    )}
                                >
                                    <X className="w-3 h-3" /> No
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
