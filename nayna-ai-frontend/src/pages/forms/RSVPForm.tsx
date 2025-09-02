import { useState } from 'react';
import { saveRSVPSettings } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

export function RSVPForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    rsvpEnabled: true,
    rsvpDeadline: '',
    customQuestions: ''
  });
  const [saving, setSaving] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target as HTMLInputElement;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement).value;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveRSVPSettings(form);
      showToast({ variant: 'success', message: 'RSVP settings saved' });
    } catch (e) {
      showToast({ variant: 'error', message: 'Failed to save RSVP settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-2xl">
      <h2 className="font-medium mb-4">RSVP Settings</h2>
      <div className="space-y-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="rsvpEnabled" checked={form.rsvpEnabled} onChange={onChange} />
          Enable RSVP
        </label>
        <div>
          <label className="block text-sm">RSVP Deadline</label>
          <input type="date" name="rsvpDeadline" value={form.rsvpDeadline} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm">Custom Questions</label>
          <textarea name="customQuestions" value={form.customQuestions} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm h-24" />
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

