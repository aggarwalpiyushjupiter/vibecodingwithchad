import { useState } from 'react';
import { saveHostDetails } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

type Host = { name: string; email?: string; phone: string; countryCode: string; side: 'bride' | 'groom'; relationship: string };

export function HostDetailsForm() {
  const { showToast } = useToast();
  const [hosts, setHosts] = useState<Host[]>([
    { name: '', email: '', phone: '', countryCode: '+1', side: 'bride', relationship: '' }
  ]);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Host, value: string) => setHosts((arr) => arr.map((h, idx) => idx === i ? { ...h, [field]: value } : h));
  const add = () => setHosts((arr) => [...arr, { name: '', email: '', phone: '', countryCode: '+1', side: 'bride', relationship: '' }]);
  const remove = (i: number) => setHosts((arr) => arr.filter((_, idx) => idx !== i));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Require phone for all
      if (hosts.some((h) => !h.phone.trim())) {
        showToast({ variant: 'error', message: 'Phone is required for all hosts' });
        setSaving(false);
        return;
      }
      await saveHostDetails({ hosts });
      showToast({ variant: 'success', message: 'Hosts saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save hosts' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-3xl">
      <h2 className="font-medium mb-4">Hosts</h2>
      <div className="space-y-4">
        {hosts.map((h, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
            <div>
              <label className="block text-sm">Name</label>
              <input value={h.name} onChange={(e) => update(idx, 'name', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input type="email" value={h.email} onChange={(e) => update(idx, 'email', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm">Phone</label>
              <div className="flex gap-1">
                <select value={h.countryCode} onChange={(e) => update(idx, 'countryCode', e.target.value)} className="mt-1 border rounded-md px-2 py-2 text-sm w-20">
                  <option value="+1">+1</option>
                  <option value="+91">+91</option>
                  <option value="+44">+44</option>
                  <option value="+33">+33</option>
                  <option value="+49">+49</option>
                  <option value="+81">+81</option>
                  <option value="+86">+86</option>
                  <option value="+61">+61</option>
                  <option value="+55">+55</option>
                  <option value="+52">+52</option>
                </select>
                <input value={h.phone} onChange={(e) => update(idx, 'phone', e.target.value)} className="mt-1 flex-1 border rounded-md px-3 py-2 text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-sm">Side</label>
              <select value={h.side} onChange={(e) => update(idx, 'side', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                <option value="bride">Bride</option>
                <option value="groom">Groom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Relationship</label>
              <input value={h.relationship} onChange={(e) => update(idx, 'relationship', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="Father, Brother" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={add} className="border rounded-md px-3 py-2 text-sm">Add</button>
              {hosts.length > 1 && (
                <button type="button" onClick={() => remove(idx)} className="border rounded-md px-3 py-2 text-sm">Remove</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm disabled:opacity-50" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

