import { useState } from 'react';
import { saveEventDetails } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

export function EventDetailsForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    eventName: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveEventDetails(form);
      showToast({ variant: 'success', message: 'Event details saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save event details' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-2xl">
      <h2 className="font-medium mb-4">Event Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Event Name</label>
          <input name="eventName" value={form.eventName} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm">Event Date</label>
          <input type="date" name="eventDate" value={form.eventDate} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm">Start Time</label>
          <input type="time" name="startTime" value={form.startTime} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm">End Time</label>
          <input type="time" name="endTime" value={form.endTime} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm h-24" />
        </div>
      </div>
      <div className="mt-4">
        <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm disabled:opacity-50" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

