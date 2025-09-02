import { useState } from 'react';
import { saveGuests } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

type Guest = {
  name: string;
  email?: string;
  phone?: string;
  side?: 'bride' | 'groom';
  relationship?: string;
  rsvp?: 'yes' | 'no' | 'maybe';
};

export function GuestsForm() {
  const { showToast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([{ name: '', email: '', phone: '', side: 'bride', relationship: '', rsvp: 'maybe' }]);
  const [saving, setSaving] = useState(false);

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    setGuests((prev) => prev.map((g, i) => i === index ? { ...g, [field]: value } : g));
  };

  const addGuest = () => setGuests((prev) => [...prev, { name: '', email: '', phone: '' }]);
  const removeGuest = (index: number) => setGuests((prev) => prev.filter((_, i) => i !== index));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveGuests(guests);
      showToast({ variant: 'success', message: 'Guests saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save guests' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-3xl">
      <h2 className="font-medium mb-4">Guests</h2>
      <div className="space-y-4">
        {guests.map((guest, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-end">
            <div>
              <label className="block text-sm">Name</label>
              <input value={guest.name} onChange={(e) => updateGuest(idx, 'name', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input type="email" value={guest.email} onChange={(e) => updateGuest(idx, 'email', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm">Phone</label>
              <input value={guest.phone} onChange={(e) => updateGuest(idx, 'phone', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm">Side</label>
              <select value={guest.side} onChange={(e) => updateGuest(idx, 'side', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                <option value="bride">Bride</option>
                <option value="groom">Groom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Relationship</label>
              <input value={guest.relationship} onChange={(e) => updateGuest(idx, 'relationship', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm">RSVP</label>
              <select value={guest.rsvp} onChange={(e) => updateGuest(idx, 'rsvp', e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2 text-sm">
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="maybe">Maybe</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={addGuest} className="border rounded-md px-3 py-2 text-sm">Add</button>
              {guests.length > 1 && (
                <button type="button" onClick={() => removeGuest(idx)} className="border rounded-md px-3 py-2 text-sm">Remove</button>
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

