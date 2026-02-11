import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Plus, ArrowRight, UserCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Task {
    id: number;
    workOrder: string;
    project: string;
    department: string;
    signType: string;
    status: string;
    assignedTo: string;
    quantity: number;
    createdAt: string;
}

export const QCList = () => {
    const queryClient = useQueryClient();
    const { data: tasks, isLoading, error } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await axios.get('/api/tasks');
            return response.data;
        },
    });

    const assignMutation = useMutation({
        mutationFn: async (taskId: number) => {
            await axios.post(`/api/tasks/${taskId}/assign`, { assignee: "Me" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    if (error) return <div className="text-red-500 p-8 text-center">Failed to load tasks. Please try again.</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">QC Tasks</h1>
                    <p className="text-gray-500">Manage and track quality inspections across departments.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> Create New Task
                </Button>
            </div>

            <Card className="border-none shadow-md overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium">Work Order</th>
                                <th className="px-6 py-4 font-medium">Project Scope</th>
                                <th className="px-6 py-4 font-medium">Department</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Assignee</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tasks?.map((task) => (
                                <tr key={task.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-medium text-gray-900">{task.workOrder}</span>
                                        <div className="text-xs text-gray-400 mt-0.5">{task.createdAt}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{task.project}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{task.signType}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{task.department}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            task.status === 'Pending' ? 'secondary' :
                                                task.status === 'Assigned' ? 'default' : 'outline'
                                        } className={cn(
                                            "font-normal capitalize",
                                            task.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' :
                                                task.status === 'Assigned' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                                                    'bg-green-50 text-green-700 hover:bg-green-100'
                                        )}>
                                            {task.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.status === 'Pending' ? (
                                            <button
                                                onClick={() => assignMutation.mutate(task.id)}
                                                className="text-xs flex items-center text-blue-600 hover:underline font-medium"
                                                disabled={assignMutation.isPending}
                                            >
                                                <UserCheck className="w-3 h-3 mr-1" />
                                                Assign to Me
                                            </button>
                                        ) : (
                                            <span className="text-gray-700 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {task.assignedTo.charAt(0)}
                                                </div>
                                                {task.assignedTo}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/qc/${task.id}`}>
                                            <Button size="sm" variant="ghost" className="hover:bg-blue-50 hover:text-blue-600 group-hover:visible">
                                                View Details <ArrowRight className="w-4 h-4 ml-1 opacity-50" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
