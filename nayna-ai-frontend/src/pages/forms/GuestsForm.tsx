import { useState } from 'react';
import { saveGuests } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

type Guest = {
  name: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  side?: 'bride' | 'groom';
  relationship?: string;
  rsvp?: 'yes' | 'no' | 'maybe';
};

export function GuestsForm() {
  const { showToast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([{ name: '', email: '', phone: '', countryCode: '+1', side: 'bride', relationship: '', rsvp: 'maybe' }]);
  const [saving, setSaving] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    setGuests((prev) => prev.map((g, i) => i === index ? { ...g, [field]: value } : g));
  };

  const addGuest = () => setGuests((prev) => [...prev, { name: '', email: '', phone: '', countryCode: '+1' }]);
  const removeGuest = (index: number) => setGuests((prev) => prev.filter((_, i) => i !== index));

  const parseCSV = (csvText: string): Guest[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const guests: Guest[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < headers.length) continue;

      const guest: Guest = {
        name: '',
        email: '',
        phone: '',
        countryCode: '+1',
        side: 'bride',
        relationship: '',
        rsvp: 'maybe'
      };

      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'name':
            guest.name = value;
            break;
          case 'email':
            guest.email = value;
            break;
          case 'phone':
            guest.phone = value;
            break;
          case 'countrycode':
          case 'country_code':
            guest.countryCode = value || '+1';
            break;
          case 'side':
            guest.side = (value.toLowerCase() === 'groom' ? 'groom' : 'bride') as 'bride' | 'groom';
            break;
          case 'relationship':
            guest.relationship = value;
            break;
          case 'rsvp':
            guest.rsvp = (value.toLowerCase() === 'yes' ? 'yes' : value.toLowerCase() === 'no' ? 'no' : 'maybe') as 'yes' | 'no' | 'maybe';
            break;
        }
      });

      if (guest.name) {
        guests.push(guest);
      }
    }

    return guests;
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      showToast({ variant: 'error', message: 'Please select a CSV file' });
      return;
    }

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsedGuests = parseCSV(csvText);
      
      if (parsedGuests.length === 0) {
        showToast({ variant: 'error', message: 'No valid guest data found in CSV file' });
        return;
      }

      setGuests(parsedGuests);
      showToast({ variant: 'success', message: `Successfully imported ${parsedGuests.length} guests from CSV` });
    };
    reader.readAsText(file);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">Guests</h2>
        <div className="flex gap-2">
          <label className="bg-green-600 text-white rounded-md px-3 py-1 text-sm hover:bg-green-700 cursor-pointer">
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* CSV Upload Instructions */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">CSV Upload Instructions</h3>
        <p className="text-xs text-blue-700 mb-2">
          Upload a CSV file with the following columns (case-insensitive):
        </p>
        <div className="text-xs text-blue-600">
          <strong>Required:</strong> name<br/>
          <strong>Optional:</strong> email, phone, countrycode, side, relationship, rsvp
        </div>
        <div className="text-xs text-blue-600 mt-1">
          <strong>Example:</strong> name,email,phone,side,relationship,rsvp
        </div>
      </div>
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
              <div className="flex gap-1">
                <select value={guest.countryCode} onChange={(e) => updateGuest(idx, 'countryCode', e.target.value)} className="mt-1 border rounded-md px-2 py-2 text-sm w-20">
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
                <input value={guest.phone} onChange={(e) => updateGuest(idx, 'phone', e.target.value)} className="mt-1 flex-1 border rounded-md px-3 py-2 text-sm" />
              </div>
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

