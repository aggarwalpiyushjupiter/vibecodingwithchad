import { useState } from 'react';
import { saveTemplates } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

type Template = { name: string; channel: 'email' | 'sms' | 'whatsapp'; content: string };

export function TemplatesForm() {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([
    { name: 'Invite', channel: 'email', content: '' }
  ]);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Template, value: string) => setTemplates((arr) => arr.map((x, idx) => idx === i ? { ...x, [field]: value } : x));
  const add = () => setTemplates((arr) => [...arr, { name: '', channel: 'email', content: '' }]);
  const remove = (i: number) => setTemplates((arr) => arr.filter((_, idx) => idx !== i));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveTemplates(templates);
      showToast({ variant: 'success', message: 'Templates saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save templates' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-3xl">
      <h2 className="font-medium mb-4">Communication Templates</h2>
      <div className="space-y-4">
        {templates.map((t, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm">Name</label>
              <input value={t.name} onChange={(e) => update(idx, 'name', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm">Channel</label>
              <select value={t.channel} onChange={(e) => update(idx, 'channel', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm">Content</label>
              <textarea value={t.content} onChange={(e) => update(idx, 'content', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm h-24" />
            </div>
            <div className="sm:col-span-6 flex gap-2">
              <button type="button" onClick={add} className="border rounded-md px-3 py-2 text-sm">Add</button>
              {templates.length > 1 && <button type="button" onClick={() => remove(idx)} className="border rounded-md px-3 py-2 text-sm">Remove</button>}
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

