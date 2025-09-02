import { useState } from 'react';
import { saveVenueDetails, saveEventDetails } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

type Venue = {
  id: string;
  venueName: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  eventName: string;
  eventStartDate: string;
  eventStartTime: string;
  eventEndDate: string;
  eventEndTime: string;
  description: string;
};

export function VenueEventForm() {
  const { showToast } = useToast();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [saving, setSaving] = useState(false);

  const addVenue = () => {
    const newVenue: Venue = {
      id: Date.now().toString(),
      venueName: '',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      eventName: '',
      eventStartDate: '',
      eventStartTime: '',
      eventEndDate: '',
      eventEndTime: '',
      description: ''
    };
    setVenues([...venues, newVenue]);
  };

  const removeVenue = (id: string) => {
    setVenues(venues.filter(v => v.id !== id));
  };

  const updateVenue = (id: string, field: keyof Venue, value: string) => {
    setVenues(venues.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (venues.length === 0) {
      showToast({ variant: 'error', message: 'Please add at least one venue' });
      return;
    }

    setSaving(true);
    try {
      // Save venue details
      await saveVenueDetails({ venues });
      
      // Save event details for each venue
      for (const venue of venues) {
        await saveEventDetails({
          venueId: venue.id,
          eventName: venue.eventName,
          eventStartDate: venue.eventStartDate,
          eventStartTime: venue.eventStartTime,
          eventEndDate: venue.eventEndDate,
          eventEndTime: venue.eventEndTime,
          description: venue.description
        });
      }
      
      showToast({ variant: 'success', message: 'Venue and event details saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save venue and event details' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">Venue & Event Details</h2>
        <button 
          type="button" 
          onClick={addVenue}
          className="bg-green-600 text-white rounded-md px-3 py-1 text-sm hover:bg-green-700"
        >
          Add Venue
        </button>
      </div>

      {venues.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No venues added yet. Click "Add Venue" to get started.</p>
        </div>
      )}

      {venues.map((venue, index) => (
        <div key={venue.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Venue {index + 1}</h3>
            <button 
              type="button" 
              onClick={() => removeVenue(venue.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>

          <div className="space-y-6">
            {/* Venue Details Section */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-4">Venue Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm">Venue Name</label>
                  <input 
                    value={venue.venueName} 
                    onChange={(e) => updateVenue(venue.id, 'venueName', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">Address Line 1</label>
                  <input 
                    value={venue.addressLine1} 
                    onChange={(e) => updateVenue(venue.id, 'addressLine1', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">City</label>
                  <input 
                    value={venue.city} 
                    onChange={(e) => updateVenue(venue.id, 'city', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">State</label>
                  <input 
                    value={venue.state} 
                    onChange={(e) => updateVenue(venue.id, 'state', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm">Postal Code</label>
                  <input 
                    value={venue.postalCode} 
                    onChange={(e) => updateVenue(venue.id, 'postalCode', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-4">Event Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm">Event Name</label>
                  <input 
                    value={venue.eventName} 
                    onChange={(e) => updateVenue(venue.id, 'eventName', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">Event Start Date</label>
                  <input 
                    type="date" 
                    value={venue.eventStartDate} 
                    onChange={(e) => updateVenue(venue.id, 'eventStartDate', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">Event Start Time</label>
                  <input 
                    type="time" 
                    value={venue.eventStartTime} 
                    onChange={(e) => updateVenue(venue.id, 'eventStartTime', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm">Event End Date</label>
                  <input 
                    type="date" 
                    value={venue.eventEndDate} 
                    onChange={(e) => updateVenue(venue.id, 'eventEndDate', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">Event End Time</label>
                  <input 
                    type="time" 
                    value={venue.eventEndTime} 
                    onChange={(e) => updateVenue(venue.id, 'eventEndTime', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-sm">Event Description</label>
                  <textarea 
                    value={venue.description} 
                    onChange={(e) => updateVenue(venue.id, 'description', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm h-20" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {venues.length > 0 && (
        <div className="mt-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm disabled:opacity-50" 
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save All Venues & Events'}
          </button>
        </div>
      )}
    </form>
  );
}
