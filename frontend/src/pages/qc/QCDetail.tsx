import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckpointCard, Checkpoint } from '@/components/qc/CheckpointCard';
import { Calendar, Save, Download, FileText, CheckCircle, ArrowLeft } from 'lucide-react';

interface Task {
    id: number;
    workOrder: string;
    project: string;
    signType: string;
    quantity: number;
    projectNo: string;
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

    const [comment, setComment] = useState("");

    const handleToggle = (sectionTitle: string, id: string, value: 'pass' | 'fail') => {
        setSections(prev => ({
            ...prev,
            [sectionTitle]: prev[sectionTitle].map(cp => cp.id === id ? { ...cp, value } : cp)
        }));
    };

    const submitMutation = useMutation({
        mutationFn: async () => {
            await axios.post(`/api/qc/${id}/submit`, {
                sections,
                comment
            });
        },
        onSuccess: () => {
            alert("QC Results Saved!");
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            navigate('/qc');
        },
        onError: (err) => {
            console.error(err);
            alert("Failed to save QC results");
        }
    });

    const handleSave = () => {
        submitMutation.mutate();
    };

    const handlePrint = () => {
        window.print();
    };

    if (!task) return <div>Loading...</div>;

    return (
        <div className={`space-y-6 ${printMode ? 'p-8 bg-white print-container' : ''}`}>
            {!printMode && (
                <Button variant="ghost" onClick={() => navigate('/qc')} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                </Button>
            )}

            {/* Header Info */}
            <Card className="bg-gray-50 border-none shadow-sm">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-blue-900 mb-1">Quality Check</h1>
                            <p className="text-sm text-gray-500">QC Inspector: <span className="font-semibold text-gray-900">Vergin BRI</span></p>
                        </div>
                        <div className="flex gap-2">
                            {/* Status icons or flags */}
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        <div>
                            <p className="text-gray-500 mb-1">Work Order #</p>
                            <p className="font-semibold">{task.workOrder}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Date</p>
                            <p className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> 31-01-2024</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Sign Type</p>
                            <p className="font-semibold">{task.signType}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Quantity</p>
                            <p className="font-semibold">{task.quantity}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Project #</p>
                            <p className="font-semibold">{task.projectNo || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Partial or Full</p>
                            <p className="font-semibold">Full</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 mb-1">Project Name</p>
                            <p className="font-semibold">{task.project}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="w-full bg-[#3d4d6b] text-white p-2 text-center text-sm font-semibold rounded-md">
                Inter - Departmental Process Checks
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Main Checkpoints */}
                <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CheckpointCard
                            title="LETTER MOULDING"
                            checkpoints={sections["Letter Moulding"]}
                            onToggle={(id, val) => handleToggle("Letter Moulding", id, val)}
                            colorClass="bg-[#4d8b98]"
                        />
                        <CheckpointCard
                            title="METAL FABRICATION"
                            checkpoints={sections["Metal Fabrication"]}
                            onToggle={(id, val) => handleToggle("Metal Fabrication", id, val)}
                            colorClass="bg-[#e45151]" // Red header as per screenshot
                        />
                        <CheckpointCard
                            title="CNC LASER CUTTING"
                            checkpoints={sections["CNC Laser Cutting"]}
                            onToggle={(id, val) => handleToggle("CNC Laser Cutting", id, val)}
                            colorClass="bg-[#3d4d6b]" // Dark blue
                        />
                        {/* Add more cards as needed */}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4 no-print">
                        <h3 className="font-semibold text-gray-800">Files</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                            <p>Drag & Drop files here or click to upload</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="bg-blue-50 p-2 rounded flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    <span>metalfabrication.jpg</span>
                                </div>
                                <span className="text-xs text-gray-500">2.5 mb</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar History & Comments */}
                <div className="w-full md:w-80 space-y-6">
                    <Card className="no-print">
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold">Quality Check History</h3>
                            <div className="space-y-4 relative pl-4 border-l-2 border-gray-100">
                                <div className="relative">
                                    <div className="absolute -left-[21px] bg-gray-400 rounded-full w-3 h-3 top-1"></div>
                                    <p className="text-xs text-gray-500">March 2, 2024</p>
                                    <p className="text-sm font-medium">BRI UAE-J7775-01-24</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] bg-yellow-500 rounded-full w-3 h-3 top-1"></div>
                                    <p className="text-xs text-gray-500">February 20, 2024</p>
                                    <p className="text-sm font-medium">BRI UAE-J7774-01-24</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold">Comments</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-medium">David Warner</p>
                                        <p className="text-xs text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                                    </div>
                                </div>
                            </div>
                            <textarea
                                className="w-full border rounded p-2 text-sm no-print"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                            {/* Display comment in print mode */}
                            <div className="hidden print:block border p-2 text-sm bg-gray-50 min-h-[50px]">
                                {comment}
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 no-print" onClick={handleSave} disabled={submitMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" /> {submitMutation.isPending ? 'Saving...' : 'Save Results'}
                    </Button>

                    <Button className="w-full no-print" variant="outline" onClick={handlePrint}>
                        <Download className="w-4 h-4 mr-2" /> Print PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};
