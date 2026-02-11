import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckpointCard, Checkpoint } from '@/components/qc/CheckpointCard';
import { Save, ArrowLeft, Printer, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
    id: number;
    workOrder: string;
    project: string;
    signType: string;
    quantity: number;
    projectNo: string;
    status: string;
    assignedTo: string;
}

export const QCDetail = ({ printMode = false }: { printMode?: boolean }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: task } = useQuery<Task>({
        queryKey: ['task', id],
        queryFn: async () => {
            const res = await axios.get(`/api/tasks/${id}`);
            return res.data;
        },
        enabled: !!id
    });

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

    const handleUpdate = (sectionTitle: string, id: string, updates: Partial<Checkpoint>) => {
        setSections(prev => ({
            ...prev,
            [sectionTitle]: prev[sectionTitle].map(cp => cp.id === id ? { ...cp, ...updates } : cp)
        }));
    };

    const submitMutation = useMutation({
        mutationFn: async () => {
            // Validate: All checked items must have comment and image
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
            await axios.post(`/api/tasks/${id}/assign`, { assignee: "Me" }); // In real app, current user
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', id] });
        }
    });

    const handleSave = () => {
        // Basic check if all items are filled (optional based on workflow strictness)
        // For now, allow saving partials? Or enforce all? 
        // Let's enforce that IF a value is set, it needs evidence.
        submitMutation.mutate();
    };

    const handlePrint = () => {
        window.print();
    };

    if (!task) return <div className="p-8 flex justify-center">Loading...</div>;

    const isAssignedToMe = task.status === 'Assigned' || task.status === 'Completed'; // Simplified check

    return (
        <div className={cn("max-w-6xl mx-auto space-y-8", printMode ? 'p-8 bg-white print-container' : 'p-6')}>
            {!printMode && (
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/qc')} className="pl-0 hover:bg-transparent hover:text-blue-600">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Task List
                    </Button>
                    <div className="flex gap-2">
                        {task.status === 'Pending' && (
                            <Button onClick={() => assignMutation.mutate()} disabled={assignMutation.isPending} className="bg-blue-600">
                                Assign to Me
                            </Button>
                        )}
                        <Button variant="outline" onClick={handlePrint} className="gap-2">
                            <Printer className="w-4 h-4" /> Print Report
                        </Button>
                    </div>
                </div>
            )}

            {/* Header Info */}
            <Card className="border-none shadow-md bg-white overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">QC Inspection</h1>
                                <Badge variant={task.status === 'Completed' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                                    {task.status}
                                </Badge>
                            </div>
                            <p className="text-gray-500 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Inspector: <span className="font-medium text-gray-900">{task.assignedTo || 'Unassigned'}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Work Order</p>
                            <p className="text-2xl font-mono font-bold text-gray-900">{task.workOrder}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 text-sm pt-6 border-t">
                        <div>
                            <p className="text-gray-500 mb-1">Project Name</p>
                            <p className="font-semibold text-base">{task.project}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Project #</p>
                            <p className="font-semibold text-base">{task.projectNo || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Sign Type</p>
                            <p className="font-semibold text-base">{task.signType}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Quantity</p>
                            <p className="font-semibold text-base">{task.quantity}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {!isAssignedToMe && !printMode && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-800 font-medium">Please assign this task to yourself to begin the inspection.</p>
                </div>
            )}

            {/* Checkpoints */}
            <div className={cn("grid grid-cols-1 gap-8", !isAssignedToMe && "opacity-50 pointer-events-none")}>
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
            <div className="flex justify-end pt-8 pb-16 no-print">
                {task.status !== 'Completed' && (
                    <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
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
