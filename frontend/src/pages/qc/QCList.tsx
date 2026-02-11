import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Plus, ArrowRight, UserCheck, Calendar, MapPin, Building2, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayout } from '@/components/layout/Layout';
import { CreateTaskDialog } from '@/components/qc/CreateTaskDialog';

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
    const { searchQuery } = useLayout(); // Consume search query from Layout

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

    // Client-side filtering
    const filteredTasks = tasks?.filter(task => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            task.workOrder.toLowerCase().includes(query) ||
            task.project.toLowerCase().includes(query) ||
            task.department.toLowerCase().includes(query)
        );
    }) || [];

    if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    if (error) return <div className="text-red-500 p-8 text-center bg-red-50 rounded-xl my-4">Failed to load tasks. Please try again.</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">QC Tasks</h1>
                    <p className="text-gray-500 mt-1">Manage inspections and track quality across projects</p>
                </div>
                <CreateTaskDialog />
            </div>

            {/* Mobile/Tablet Card View - Visible on small screens */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredTasks.length === 0 && (
                    <div className="text-center p-8 text-gray-500 bg-white rounded-xl">No tasks found matching your search.</div>
                )}
                {filteredTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow active:scale-[0.99] transition-transform">
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        <Ticket className="w-3 h-3" /> {task.workOrder}
                                    </span>
                                    <h3 className="font-semibold text-gray-900">{task.project}</h3>
                                </div>
                                <Badge variant={
                                    task.status === 'Pending' ? 'secondary' :
                                        task.status === 'Assigned' ? 'default' : 'outline'
                                } className={cn(
                                    "font-medium",
                                    task.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                        task.status === 'Assigned' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-green-50 text-green-700 border-green-100'
                                )}>
                                    {task.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="truncate">{task.department}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="truncate">{task.signType}</span>
                                </div>
                                <div className="flex items-center gap-2 col-span-2">
                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs">{task.createdAt}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t flex items-center justify-between">
                                <div className="text-sm">
                                    {task.status === 'Pending' ? (
                                        <button
                                            onClick={() => assignMutation.mutate(task.id)}
                                            className="text-blue-600 text-xs font-semibold flex items-center hover:underline"
                                            disabled={assignMutation.isPending}
                                        >
                                            <UserCheck className="w-3.5 h-3.5 mr-1" />
                                            Assign to Me
                                        </button>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                                                {task.assignedTo.charAt(0)}
                                            </div>
                                            {task.assignedTo}
                                        </span>
                                    )}
                                </div>
                                <Link to={`/qc/${task.id}`}>
                                    <Button size="sm" variant="ghost" className="h-8 text-xs hover:bg-blue-50 text-blue-600">
                                        View Details <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Desktop Table View - Visible on larger screens */}
            <Card className="border-none shadow-xl shadow-gray-100/50 overflow-hidden bg-white hidden md:block rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5 font-semibold tracking-wider">Work Order</th>
                                <th className="px-6 py-5 font-semibold tracking-wider">Project Scope</th>
                                <th className="px-6 py-5 font-semibold tracking-wider">Department</th>
                                <th className="px-6 py-5 font-semibold tracking-wider">Status</th>
                                <th className="px-6 py-5 font-semibold tracking-wider">Assignee</th>
                                <th className="px-6 py-5 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <SearchIcon className="w-8 h-8 opacity-20" />
                                            <p>No tasks found matching "{searchQuery}"</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="group hover:bg-blue-50/40 transition-all duration-200">
                                    <td className="px-6 py-5">
                                        <span className="font-mono font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">{task.workOrder}</span>
                                        <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {task.createdAt}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-semibold text-gray-900">{task.project}</div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {task.signType}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Building2 className="w-4 h-4 text-gray-300" />
                                            {task.department}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className={cn(
                                            "font-medium border-0 px-2.5 py-0.5 rounded-full capitalize",
                                            task.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20' :
                                                task.status === 'Assigned' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10' :
                                                    'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5",
                                                task.status === 'Pending' ? 'bg-yellow-400' :
                                                    task.status === 'Assigned' ? 'bg-blue-500' :
                                                        'bg-green-500'
                                            )}></span>
                                            {task.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        {task.status === 'Pending' ? (
                                            <button
                                                onClick={() => assignMutation.mutate(task.id)}
                                                className="group/assign relative overflow-hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 transition-all hover:bg-blue-100 hover:pr-8"
                                                disabled={assignMutation.isPending}
                                            >
                                                <span className="flex items-center gap-1">
                                                    <UserCheck className="w-3 h-3" /> Assign Me
                                                </span>
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/assign:opacity-100">
                                                    →
                                                </span>
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-2 group-hover:scale-105 transition-transform origin-left">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {task.assignedTo.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-900">{task.assignedTo}</p>
                                                    <p className="text-[10px] text-gray-400">Inspector</p>
                                                </div>
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Link to={`/qc/${task.id}`}>
                                            <Button size="sm" variant="ghost" className="rounded-full hover:bg-white hover:shadow-md hover:text-blue-600 transition-all text-gray-400">
                                                View <ArrowRight className="w-4 h-4 ml-1" />
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

// Helper icon for empty state
const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
