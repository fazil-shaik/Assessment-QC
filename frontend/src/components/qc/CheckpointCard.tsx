import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageUpload } from '@/components/ui/ImageUpload';

// Basic Textarea component if not exists, inline for simplicity or assuming standard HTML
const SimpleTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className={cn(
            "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            props.className
        )}
    />
);

export interface Checkpoint {
    id: string;
    label: string;
    value: 'pass' | 'fail' | null;
    comment?: string;
    image?: string;
}

interface CheckpointCardProps {
    title: string;
    checkpoints: Checkpoint[];
    onUpdate: (id: string, updates: Partial<Checkpoint>) => void;
    colorClass?: string;
    readOnly?: boolean;
}

export const CheckpointCard = ({ title, checkpoints, onUpdate, colorClass = "bg-teal-700", readOnly = false }: CheckpointCardProps) => {
    return (
        <Card className="overflow-hidden border-t-4 border-t-transparent shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className={cn("py-3 px-4 bg-gray-50 border-b")}>
                <CardTitle className={cn("text-sm font-bold uppercase tracking-wide", colorClass.replace('bg-', 'text-'))}>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
                {checkpoints.map((cp) => (
                    <div key={cp.id} className="flex flex-col space-y-3 pb-4 border-b last:border-0 last:pb-0">
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-sm font-medium text-gray-700 mt-1">{cp.label}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => !readOnly && onUpdate(cp.id, { value: 'pass' })}
                                    disabled={readOnly}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5",
                                        cp.value === 'pass'
                                            ? "bg-green-600 text-white border-green-600 shadow-sm"
                                            : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Check className="w-3.5 h-3.5" /> Pass
                                </button>
                                <button
                                    onClick={() => !readOnly && onUpdate(cp.id, { value: 'fail' })}
                                    disabled={readOnly}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5",
                                        cp.value === 'fail'
                                            ? "bg-red-600 text-white border-red-600 shadow-sm"
                                            : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <X className="w-3.5 h-3.5" /> Fail
                                </button>
                            </div>
                        </div>

                        {/* Expanded section for evidence */}
                        {cp.value && (
                            <div className="bg-gray-50/50 p-3 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-[1fr_auto] gap-4">
                                    <SimpleTextarea
                                        placeholder="Add required comment..."
                                        value={cp.comment || ''}
                                        onChange={(e) => onUpdate(cp.id, { comment: e.target.value })}
                                        disabled={readOnly}
                                        className={cn(
                                            "resize-none",
                                            !cp.comment && "border-red-300 focus-visible:ring-red-200" // Highlight if empty
                                        )}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <ImageUpload
                                            onUpload={(url) => onUpdate(cp.id, { image: url })}
                                            currentImage={cp.image}
                                            disabled={readOnly}
                                        />
                                        {!cp.image && <span className="text-[10px] text-red-500 font-medium">Req. Image</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
