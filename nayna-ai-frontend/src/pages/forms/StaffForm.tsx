import { useState } from 'react';
import { saveStaff } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

type Staff = { name: string; role: string; phone?: string };

export function StaffForm() {
  const { showToast } = useToast();
  const [staff, setStaff] = useState<Staff[]>([{ name: '', role: '', phone: '' }]);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Staff, value: string) => setStaff((arr) => arr.map((x, idx) => idx === i ? { ...x, [field]: value } : x));
  const add = () => setStaff((arr) => [...arr, { name: '', role: '', phone: '' }]);
  const remove = (i: number) => setStaff((arr) => arr.filter((_, idx) => idx !== i));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveStaff(staff);
      showToast({ variant: 'success', message: 'Staff saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save staff' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-3xl">
      <h2 className="font-medium mb-4">Event Staff</h2>
      <div className="space-y-4">
        {staff.map((s, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm">Name</label>
              <input value={s.name} onChange={(e) => update(idx, 'name', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm">Role</label>
              <input value={s.role} onChange={(e) => update(idx, 'role', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm">Phone</label>
              <input value={s.phone} onChange={(e) => update(idx, 'phone', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="sm:col-span-5 flex gap-2">
              <button type="button" onClick={add} className="border rounded-md px-3 py-2 text-sm">Add</button>
              {staff.length > 1 && <button type="button" onClick={() => remove(idx)} className="border rounded-md px-3 py-2 text-sm">Remove</button>}
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

