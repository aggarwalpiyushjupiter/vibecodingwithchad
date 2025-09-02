import { useState } from 'react';
import { saveHostDetails } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

export function HostDetailsForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    hostName: '',
    hostEmail: '',
    hostPhone: ''
  });
  const [saving, setSaving] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveHostDetails(form);
      showToast({ variant: 'success', message: 'Host details saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save host details' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-2xl">
      <h2 className="font-medium mb-4">Host Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Host Name</label>
          <input name="hostName" value={form.hostName} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm">Host Email</label>
          <input type="email" name="hostEmail" value={form.hostEmail} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm">Host Phone</label>
          <input name="hostPhone" value={form.hostPhone} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
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

