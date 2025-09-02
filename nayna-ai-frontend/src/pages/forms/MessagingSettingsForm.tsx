import { useState } from 'react';
import { saveMessagingSettings } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

export function MessagingSettingsForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    defaultChannel: 'email',
    senderName: '',
    senderEmail: '',
    whatsappNumber: ''
  });
  const [saving, setSaving] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveMessagingSettings(form);
      showToast({ variant: 'success', message: 'Messaging settings saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save messaging settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-2xl">
      <h2 className="font-medium mb-4">Messaging Settings</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm">Default Channel</label>
          <select name="defaultChannel" value={form.defaultChannel} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Sender Name</label>
          <input name="senderName" value={form.senderName} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm">Sender Email</label>
          <input type="email" name="senderEmail" value={form.senderEmail} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm">WhatsApp Number</label>
          <input name="whatsappNumber" value={form.whatsappNumber} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="mt-4">
        <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm disabled:opacity-50" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}

