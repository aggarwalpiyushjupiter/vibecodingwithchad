import { useState } from 'react';
import { saveVenueDetails } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

export function VenueDetailsForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    venueName: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: ''
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
      await saveVenueDetails(form);
      showToast({ variant: 'success', message: 'Venue details saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save venue details' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-2xl">
      <h2 className="font-medium mb-4">Venue Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Venue Name</label>
          <input name="venueName" value={form.venueName} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm">Address Line 1</label>
          <input name="addressLine1" value={form.addressLine1} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm">City</label>
          <input name="city" value={form.city} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm">State</label>
          <input name="state" value={form.state} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm">Postal Code</label>
          <input name="postalCode" value={form.postalCode} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
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

