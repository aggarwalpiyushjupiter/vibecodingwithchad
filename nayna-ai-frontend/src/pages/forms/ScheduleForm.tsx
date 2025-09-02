import { useState } from 'react';
import { saveSchedule } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

type Item = { time: string; title: string; description?: string };

export function ScheduleForm() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Item[]>([{ time: '', title: '', description: '' }]);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Item, value: string) => setItems((arr) => arr.map((x, idx) => idx === i ? { ...x, [field]: value } : x));
  const add = () => setItems((arr) => [...arr, { time: '', title: '', description: '' }]);
  const remove = (i: number) => setItems((arr) => arr.filter((_, idx) => idx !== i));

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
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-3xl">
      <h2 className="font-medium mb-4">Event Schedule</h2>
      <div className="space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-sm">Time</label>
              <input value={it.time} onChange={(e) => update(idx, 'time', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="10:00" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm">Title</label>
              <input value={it.title} onChange={(e) => update(idx, 'title', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm">Description</label>
              <input value={it.description} onChange={(e) => update(idx, 'description', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="sm:col-span-6 flex gap-2">
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

