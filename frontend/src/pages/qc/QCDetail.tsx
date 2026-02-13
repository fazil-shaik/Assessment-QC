import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckpointCard, Checkpoint } from '@/components/qc/CheckpointCard';
import { Save, ArrowLeft, Printer, User, AlertCircle, Building, Hash, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useLayout } from '@/components/layout/Layout'; // To access any layout context if needed

interface Task {
    id: number;
    workOrder: string;
    project: string;
    signType: string;
    quantity: number;
    projectNo: string;
    status: string;
    assignedTo: string;
    qcResults?: {
        section: string;
        checkpoint: string;
        status: 'pass' | 'fail' | null;
        comment?: string;
        imagePath?: string;
    }[];
}

export const QCDetail = ({ printMode = false }: { printMode?: boolean }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [sections, setSections] = useState<{ [key: string]: Checkpoint[] }>({
        "Letter Moulding": [
            { id: "lm1", label: "Depth of Material", value: null },
            { id: "lm2", label: "Surface Finish", value: null },
            { id: "lm3", label: "Edges and Side Finish", value: null },
            { id: "lm4", label: "Workmanship", value: null }
        ],
        "Metal Fabrication": [
            { id: "mf1", label: "Material Type / Size", value: null },
            { id: "mf2", label: "Fixing Methods & Assembly", value: null },
            { id: "mf3", label: "Stretcher Support", value: null },
            { id: "mf4", label: "Surface Finish", value: null }
        ],
        "CNC Laser Cutting": [
            { id: "cl1", label: "Verify Cutting Files", value: null },
            { id: "cl2", label: "Material Types", value: null },
            { id: "cl3", label: "Cutting Quality", value: null }
        ]
    });

    // Populate state from saved results when task data loads
    const { data: task } = useQuery<Task>({
        queryKey: ['task', id],
        queryFn: async () => {
            const res = await axios.get(`/api/tasks/${id}`);
            return res.data;
        },
        enabled: !!id
    });

    useEffect(() => {
        if (task?.qcResults && task.qcResults.length > 0) {
            setSections(prevSections => {
                const newSections = { ...prevSections };
                task.qcResults?.forEach(result => {
                    if (newSections[result.section]) {
                        newSections[result.section] = newSections[result.section].map(cp => {
                            if (cp.label === result.checkpoint) {
                                return {
                                    ...cp,
                                    value: result.status,
                                    comment: result.comment,
                                    image: result.imagePath
                                };
                            }
                            return cp;
                        });
                    }
                });
                return newSections;
            });
        }
    }, [task]);

    const handleUpdate = (sectionTitle: string, id: string, updates: Partial<Checkpoint>) => {
        setSections(prev => ({
            ...prev,
            [sectionTitle]: prev[sectionTitle].map(cp => cp.id === id ? { ...cp, ...updates } : cp)
        }));
    };

    const submitMutation = useMutation({
        mutationFn: async () => {
            for (const section of Object.values(sections)) {
                for (const cp of section) {
                    if (cp.value && (!cp.comment || !cp.image)) {
                        throw new Error(`Missing evidence for ${cp.label}`);
                    }
                }
            }

            await axios.post(`/api/qc/${id}/submit`, {
                sections,
                comment: "Detailed QC Completed"
            });
        },
        onSuccess: () => {
            alert("QC Results Saved & Submitted!");
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            navigate('/qc');
        },
        onError: (err: any) => {
            console.error(err);
            alert(err.message || "Failed to submit results");
        }
    });

    const assignMutation = useMutation({
        mutationFn: async () => {
            await axios.post(`/api/tasks/${id}/assign`, { assignee: "Me" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', id] });
        }
    });

    const handleSave = () => {
        submitMutation.mutate();
    };

    const handlePrint = () => {
        // Open the dedicated print view in a new window/tab
        window.open(`/print/${id}`, '_blank');
    };

    useEffect(() => {
        if (printMode && task) {
            // Auto-print if we are in print mode
            const timer = setTimeout(() => window.print(), 1000);
            return () => clearTimeout(timer);
        }
    }, [printMode, task]);

    if (!task) return <div className="p-8 flex justify-center">Loading...</div>;

    const isAssignedToMe = task.status === 'Assigned' || task.status === 'Completed';

    return (
        <div className={cn("max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20", printMode ? 'p-8 bg-white print-container' : 'p-4 md:p-6')}>
            {!printMode && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Button variant="ghost" onClick={() => navigate('/qc')} className="pl-0 hover:bg-transparent hover:text-blue-600 -ml-2">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Task List
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto">
                        {task.status === 'Pending' && (
                            <Button onClick={() => assignMutation.mutate()} disabled={assignMutation.isPending} className="flex-1 sm:flex-none bg-blue-600">
                                Assign to Me
                            </Button>
                        )}
                        <Button variant="outline" onClick={handlePrint} className="flex-1 sm:flex-none gap-2">
                            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Print Report</span><span className="sm:hidden">Print</span>
                        </Button>
                    </div>
                </div>
            )}

            {/* Header Info - Responsive Grid */}
            <Card className="border-none shadow-lg bg-white overflow-hidden rounded-2xl">
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">QC Inspection</h1>
                                <Badge variant={task.status === 'Completed' ? 'default' : 'secondary'} className="text-sm px-3 py-1 rounded-full">
                                    {task.status}
                                </Badge>
                            </div>
                            <p className="text-gray-500 flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                Inspector: <span className="font-medium text-gray-900">{task.assignedTo || 'Unassigned'}</span>
                            </p>
                        </div>
                        <div className="text-left md:text-right bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg w-full md:w-auto">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Work Order</p>
                            <p className="text-xl md:text-2xl font-mono font-bold text-gray-900">{task.workOrder}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 md:gap-x-8 text-sm pt-6 border-t border-gray-100">
                        <div className="space-y-1">
                            <p className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1.5"><Building className="w-3 h-3" /> Project Name</p>
                            <p className="font-semibold text-gray-900 text-base leading-tight">{task.project}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1.5"><Hash className="w-3 h-3" /> Project #</p>
                            <p className="font-semibold text-gray-900 text-base">{task.projectNo || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1.5"><Layers className="w-3 h-3" /> Sign Type</p>
                            <p className="font-semibold text-gray-900 text-base">{task.signType}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Quantity</p>
                            <p className="font-semibold text-gray-900 text-base">{task.quantity}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {!isAssignedToMe && !printMode && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <p className="text-yellow-800 font-medium text-sm md:text-base">Please assign this task to yourself to begin the inspection.</p>
                </div>
            )}

            {/* Checkpoints - Grid for large screens, Stack for small */}
            <div className={cn("grid grid-cols-1 xl:grid-cols-2 gap-6", !isAssignedToMe && "opacity-50 pointer-events-none grayscale-[0.5]")}>
                {Object.entries(sections).map(([title, items]) => (
                    <CheckpointCard
                        key={title}
                        title={title}
                        checkpoints={items}
                        onUpdate={(id, updates) => handleUpdate(title, id, updates)}
                        colorClass={
                            title.includes("Moulding") ? "text-blue-600" :
                                title.includes("Fabrication") ? "text-red-600" : "text-purple-600"
                        }
                        readOnly={task.status === 'Completed'}
                    />
                ))}
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t md:static md:bg-transparent md:border-0 md:p-0 z-10 no-print flex justify-end">
                {task.status !== 'Completed' && (
                    <Button
                        size="lg"
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 rounded-xl"
                        onClick={handleSave}
                        disabled={!isAssignedToMe || submitMutation.isPending}
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {submitMutation.isPending ? 'Submitting...' : 'Complete Inspection'}
                    </Button>
                )}
            </div>
        </div>
    );
};
