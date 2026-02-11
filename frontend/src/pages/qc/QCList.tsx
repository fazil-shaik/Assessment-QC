import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Plus } from 'lucide-react';

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
    const { data: tasks, isLoading, error } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await axios.get('/api/tasks');
            return response.data;
        },
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-red-500 p-8">Error loading tasks</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="flex gap-4">
                    <Button variant="ghost" className="text-blue-600 font-semibold border-b-2 border-blue-600 rounded-none">QC Pending</Button>
                    <Button variant="ghost" className="text-gray-500">QC Completed</Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"> Assigned by me </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600"> <Plus className="w-4 h-4 mr-2" /> Add New</Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">QC Type</th>
                                <th className="px-6 py-3">Work Order</th>
                                <th className="px-6 py-3">Project</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Sign Type</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Assignee</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks?.map((task) => (
                                <tr key={task.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">BRI MAIN WH</td>
                                    <td className="px-6 py-4">Full</td>
                                    <td className="px-6 py-4">{task.workOrder}</td>
                                    <td className="px-6 py-4 truncate max-w-[150px]">{task.project}</td>
                                    <td className="px-6 py-4">{task.department}</td>
                                    <td className="px-6 py-4">{task.signType}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            task.status === 'Pending' ? 'secondary' :
                                                task.status === 'Assigned' ? 'default' : 'outline'
                                        } className={
                                            task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none' :
                                                task.status === 'Assigned' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-none' : 'bg-green-100 text-green-800 hover:bg-green-200 border-none'
                                        }>
                                            {task.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">{task.assignedTo}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/qc/${task.id}`}>
                                            <Button size="sm" variant="outline">View</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};
