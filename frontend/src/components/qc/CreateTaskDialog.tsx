import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from 'lucide-react';

export const CreateTaskDialog = () => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        workOrder: '',
        project: '',
        department: '',
        signType: '',
        quantity: 1
    });

    const createMutation = useMutation({
        mutationFn: async (newTimew: any) => {
            await axios.post('/api/tasks', newTimew);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setOpen(false);
            setFormData({
                workOrder: '',
                project: '',
                department: '',
                signType: '',
                quantity: 1
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-full px-6 transition-transform active:scale-95">
                    <Plus className="w-4 h-4 mr-2" /> Create New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New QC Task</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new quality control inspection task.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="workOrder" className="text-right">
                                Work Order
                            </Label>
                            <Input
                                id="workOrder"
                                value={formData.workOrder}
                                onChange={(e) => setFormData({ ...formData, workOrder: e.target.value })}
                                className="col-span-3"
                                placeholder="WO-2024-..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="project" className="text-right">
                                Project
                            </Label>
                            <Input
                                id="project"
                                value={formData.project}
                                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                className="col-span-3"
                                placeholder="Project Name"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="department" className="text-right">
                                Dept.
                            </Label>
                            <Select onValueChange={(val) => setFormData({ ...formData, department: val })} required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Metal">Metal</SelectItem>
                                    <SelectItem value="Acrylic">Acrylic</SelectItem>
                                    <SelectItem value="Assembly">Assembly</SelectItem>
                                    <SelectItem value="Paint">Paint</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="signType" className="text-right">
                                Sign Type
                            </Label>
                            <Input
                                id="signType"
                                value={formData.signType}
                                onChange={(e) => setFormData({ ...formData, signType: e.target.value })}
                                className="col-span-3"
                                placeholder="e.g. 3D Letters"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">
                                Quantity
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
