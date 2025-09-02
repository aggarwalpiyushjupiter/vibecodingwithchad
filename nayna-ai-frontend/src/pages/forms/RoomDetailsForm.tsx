import { useState } from 'react';
import { saveRoomDetails } from '../../services/api';
import { useToast } from '../../lib/ui/ToastContext';

type Room = {
  id: string;
  roomNumber: string;
  hotelName: string;
  guestIds: string[];
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  roomType: string;
  notes: string;
};

export function RoomDetailsForm() {
  const { showToast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [saving, setSaving] = useState(false);

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      roomNumber: '',
      hotelName: '',
      guestIds: [],
      checkInDate: '',
      checkInTime: '',
      checkOutDate: '',
      checkOutTime: '',
      roomType: '',
      notes: ''
    };
    setRooms([...rooms, newRoom]);
  };

  const removeRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const updateRoom = (id: string, field: keyof Room, value: string | string[]) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addGuestId = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoom(roomId, 'guestIds', [...room.guestIds, '']);
    }
  };

  const updateGuestId = (roomId: string, guestIndex: number, value: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      const updatedGuestIds = [...room.guestIds];
      updatedGuestIds[guestIndex] = value;
      updateRoom(roomId, 'guestIds', updatedGuestIds);
    }
  };

  const removeGuestId = (roomId: string, guestIndex: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      const updatedGuestIds = room.guestIds.filter((_, index) => index !== guestIndex);
      updateRoom(roomId, 'guestIds', updatedGuestIds);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rooms.length === 0) {
      showToast({ variant: 'error', message: 'Please add at least one room' });
      return;
    }

    setSaving(true);
    try {
      await saveRoomDetails({ rooms });
      showToast({ variant: 'success', message: 'Room details saved' });
    } catch {
      showToast({ variant: 'error', message: 'Failed to save room details' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">Room Details & Allocations</h2>
        <button 
          type="button" 
          onClick={addRoom}
          className="bg-green-600 text-white rounded-md px-3 py-1 text-sm hover:bg-green-700"
        >
          Add Room
        </button>
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No rooms added yet. Click "Add Room" to get started.</p>
        </div>
      )}

      {rooms.map((room, index) => (
        <div key={room.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Room {index + 1}</h3>
            <button 
              type="button" 
              onClick={() => removeRoom(room.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>

          <div className="space-y-4">
            {/* Basic Room Information */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">Room Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm">Room Number</label>
                  <input 
                    value={room.roomNumber} 
                    onChange={(e) => updateRoom(room.id, 'roomNumber', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">Hotel Name</label>
                  <input 
                    value={room.hotelName} 
                    onChange={(e) => updateRoom(room.id, 'hotelName', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">Room Type</label>
                  <select 
                    value={room.roomType} 
                    onChange={(e) => updateRoom(room.id, 'roomType', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select Room Type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Twin">Twin</option>
                    <option value="Suite">Suite</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guest Allocations */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">Guest Allocations</h4>
                <button 
                  type="button" 
                  onClick={() => addGuestId(room.id)}
                  className="bg-blue-600 text-white rounded-md px-2 py-1 text-xs hover:bg-blue-700"
                >
                  Add Guest ID
                </button>
              </div>
              <div className="space-y-2">
                {room.guestIds.map((guestId, guestIndex) => (
                  <div key={guestIndex} className="flex gap-2 items-center">
                    <input 
                      value={guestId} 
                      onChange={(e) => updateGuestId(room.id, guestIndex, e.target.value)} 
                      placeholder="Enter Guest ID"
                      className="flex-1 border rounded-md px-3 py-2 text-sm" 
                    />
                    <button 
                      type="button" 
                      onClick={() => removeGuestId(room.id, guestIndex)}
                      className="text-red-600 hover:text-red-800 text-sm px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {room.guestIds.length === 0 && (
                  <p className="text-gray-500 text-sm">No guests allocated to this room yet.</p>
                )}
              </div>
            </div>

            {/* Check-in/Check-out Information */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">Check-in & Check-out</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm">Check-in Date</label>
                  <input 
                    type="date" 
                    value={room.checkInDate} 
                    onChange={(e) => updateRoom(room.id, 'checkInDate', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">Check-in Time</label>
                  <input 
                    type="time" 
                    value={room.checkInTime} 
                    onChange={(e) => updateRoom(room.id, 'checkInTime', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm">Check-out Date</label>
                  <input 
                    type="date" 
                    value={room.checkOutDate} 
                    onChange={(e) => updateRoom(room.id, 'checkOutDate', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm">Check-out Time</label>
                  <input 
                    type="time" 
                    value={room.checkOutTime} 
                    onChange={(e) => updateRoom(room.id, 'checkOutTime', e.target.value)} 
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">Additional Notes</h4>
              <textarea 
                value={room.notes} 
                onChange={(e) => updateRoom(room.id, 'notes', e.target.value)} 
                className="w-full border rounded-md px-3 py-2 text-sm h-20" 
                placeholder="Any special requirements or notes for this room..."
              />
            </div>
          </div>
        </div>
      ))}

      {rooms.length > 0 && (
        <div className="mt-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm disabled:opacity-50" 
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save All Room Details'}
          </button>
        </div>
      )}
    </form>
  );
}
