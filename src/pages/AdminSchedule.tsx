import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Schedule {
  id: string;
  type: 'private' | 'group';
  title: string;
  time_start: string | null;
  time_end: string | null;
  days: string;
  age_group: string | null;
  color: string | null;
}

const AdminSchedule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    type: 'group' as 'private' | 'group',
    title: '',
    time_start: '',
    time_end: '',
    days: '',
    age_group: '',
    color: 'bg-blue-500',
  });

  const { data: schedules } = useQuery({
    queryKey: ['training-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_schedules')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Schedule[];
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const channel = supabase
      .channel('admin-schedules-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'training_schedules'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['training-schedules'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('training_schedules')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-schedules'] });
      toast({ title: 'Schedule created successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to create schedule', variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('training_schedules')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-schedules'] });
      toast({ title: 'Schedule updated successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to update schedule', variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('training_schedules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-schedules'] });
      toast({ title: 'Schedule deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete schedule', variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      type: 'group',
      title: '',
      time_start: '',
      time_end: '',
      days: '',
      age_group: '',
      color: 'bg-blue-500',
    });
    setEditingSchedule(null);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      type: schedule.type,
      title: schedule.title,
      time_start: schedule.time_start || '',
      time_end: schedule.time_end || '',
      days: schedule.days,
      age_group: schedule.age_group || '',
      color: schedule.color || 'bg-blue-500',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSchedule) {
      updateMutation.mutate({ id: editingSchedule.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/subscribers')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Training Schedules</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'private' | 'group') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {formData.type === 'group' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="time_start">Start Time</Label>
                        <Input
                          id="time_start"
                          placeholder="e.g., 4:00 PM"
                          value={formData.time_start}
                          onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time_end">End Time</Label>
                        <Input
                          id="time_end"
                          placeholder="e.g., 5:00 PM"
                          value={formData.time_end}
                          onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="age_group">Age Group</Label>
                      <Input
                        id="age_group"
                        placeholder="e.g., Kids, Teens, Adults"
                        value={formData.age_group}
                        onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="days">Days</Label>
                  <Input
                    id="days"
                    placeholder="e.g., Friday & Saturday"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-pink-500">Pink</SelectItem>
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-green-500">Green</SelectItem>
                      <SelectItem value="bg-dojo-red">Red</SelectItem>
                      <SelectItem value="bg-purple-500">Purple</SelectItem>
                      <SelectItem value="bg-orange-500">Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {schedules?.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${schedule.color} rounded-full`}></div>
                    <CardTitle>{schedule.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(schedule)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(schedule.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Type:</strong> {schedule.type}</p>
                  <p><strong>Days:</strong> {schedule.days}</p>
                  {schedule.time_start && schedule.time_end && (
                    <p><strong>Time:</strong> {schedule.time_start} - {schedule.time_end}</p>
                  )}
                  {schedule.age_group && (
                    <p><strong>Age Group:</strong> {schedule.age_group}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSchedule;
