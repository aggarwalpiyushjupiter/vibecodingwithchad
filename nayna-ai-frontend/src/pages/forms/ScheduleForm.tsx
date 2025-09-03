import { useState } from 'react';
import { saveSchedule } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

type Item = { 
  triggerName: string; 
  date: string; 
  time: string; 
  type: 'Direct' | 'Host prompt'; 
  prompt: string; 
  description: string; 
  image: File | null;
};

export function ScheduleForm() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Item[]>([{ triggerName: '', date: '', time: '', type: 'Direct', prompt: '', description: '', image: null }]);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Item, value: string | File | null) => setItems((arr) => arr.map((x, idx) => idx === i ? { ...x, [field]: value } : x));
  const add = () => setItems((arr) => [...arr, { triggerName: '', date: '', time: '', type: 'Direct', prompt: '', description: '', image: null }]);
  const remove = (i: number) => setItems((arr) => arr.filter((_, idx) => idx !== i));

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      update(index, 'image', file);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSchedule(items);
      showToast({ variant: 'success', message: 'Schedule saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save schedule' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-7xl">
      <h2 className="font-medium mb-4">Communication Calendar</h2>
      <div className="space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-8 gap-3 items-end border rounded-lg p-4 bg-gray-50">
            <div>
              <label className="block text-sm">Trigger Name</label>
              <input value={it.triggerName} onChange={(e) => update(idx, 'triggerName', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm">Date</label>
              <input type="date" value={it.date} onChange={(e) => update(idx, 'date', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm">Time</label>
              <input type="time" value={it.time} onChange={(e) => update(idx, 'time', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm">Type</label>
              <select value={it.type} onChange={(e) => update(idx, 'type', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                <option value="Direct">Direct</option>
                <option value="Host prompt">Host prompt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Prompt</label>
              <select value={it.prompt} onChange={(e) => update(idx, 'prompt', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                <option value="">Select Prompt</option>
                <option value="haldi done">Haldi Done</option>
                <option value="baraat agyi">Baraat Agyi</option>
                <option value="ceremony started">Ceremony Started</option>
                <option value="reception started">Reception Started</option>
                <option value="dinner served">Dinner Served</option>
                <option value="cake cutting">Cake Cutting</option>
                <option value="first dance">First Dance</option>
                <option value="event ended">Event Ended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(idx, e)} 
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
              />
              {it.image && (
                <p className="text-xs text-green-600 mt-1">{it.image.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea value={it.description} onChange={(e) => update(idx, 'description', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm h-16" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={add} className="border rounded-md px-3 py-2 text-sm">Add</button>
              {items.length > 1 && <button type="button" onClick={() => remove(idx)} className="border rounded-md px-3 py-2 text-sm">Remove</button>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm disabled:opacity-50" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}

