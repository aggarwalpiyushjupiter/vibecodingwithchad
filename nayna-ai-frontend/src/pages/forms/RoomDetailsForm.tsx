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
  const [csvFile, setCsvFile] = useState<File | null>(null);

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

  const parseCSV = (csvText: string): Room[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rooms: Room[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < headers.length) continue;

      const room: Room = {
        id: Date.now().toString() + i,
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

      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'roomnumber':
          case 'room_number':
            room.roomNumber = value;
            break;
          case 'hotelname':
          case 'hotel_name':
            room.hotelName = value;
            break;
          case 'roomtype':
          case 'room_type':
            room.roomType = value;
            break;
          case 'checkindate':
          case 'check_in_date':
            room.checkInDate = value;
            break;
          case 'checkintime':
          case 'check_in_time':
            room.checkInTime = value;
            break;
          case 'checkoutdate':
          case 'check_out_date':
            room.checkOutDate = value;
            break;
          case 'checkouttime':
          case 'check_out_time':
            room.checkOutTime = value;
            break;
          case 'guestids':
          case 'guest_ids':
            room.guestIds = value ? value.split(';').map(id => id.trim()) : [];
            break;
          case 'notes':
            room.notes = value;
            break;
        }
      });

      if (room.roomNumber && room.hotelName) {
        rooms.push(room);
      }
    }

    return rooms;
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
      const parsedRooms = parseCSV(csvText);
      
      if (parsedRooms.length === 0) {
        showToast({ variant: 'error', message: 'No valid room data found in CSV file' });
        return;
      }

      setRooms(parsedRooms);
      showToast({ variant: 'success', message: `Successfully imported ${parsedRooms.length} rooms from CSV` });
    };
    reader.readAsText(file);
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
    <form onSubmit={onSubmit} className="bg-white border rounded-lg p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">Room Details & Allocations</h2>
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
          <button 
            type="button" 
            onClick={addRoom}
            className="bg-blue-600 text-white rounded-md px-3 py-1 text-sm hover:bg-blue-700"
          >
            Add Room
          </button>
        </div>
      </div>

      {/* CSV Upload Instructions */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">CSV Upload Instructions</h3>
        <p className="text-xs text-blue-700 mb-2">
          Upload a CSV file with the following columns (case-insensitive):
        </p>
        <div className="text-xs text-blue-600">
          <strong>Required:</strong> roomnumber, hotelname<br/>
          <strong>Optional:</strong> roomtype, checkindate, checkintime, checkoutdate, checkouttime, guestids (separated by ;), notes
        </div>
        <div className="text-xs text-blue-600 mt-1">
          <strong>Example:</strong> roomnumber,hotelname,roomtype,checkindate,checkoutdate,guestids,notes
        </div>
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No rooms added yet. Click "Add Room" to get started.</p>
        </div>
      )}

      {rooms.length > 0 && (
        <div className="space-y-4">
          {rooms.map((room, idx) => (
            <div key={room.id} className="grid grid-cols-1 sm:grid-cols-8 gap-3 items-end border rounded-lg p-4 bg-gray-50">
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
                  <option value="">Select Type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Twin">Twin</option>
                  <option value="Suite">Suite</option>
                  <option value="Family">Family</option>
                </select>
              </div>
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
                <label className="block text-sm">Guest IDs</label>
                <div className="mt-1 space-y-1">
                  {room.guestIds.map((guestId, guestIndex) => (
                    <div key={guestIndex} className="flex gap-1">
                      <input 
                        value={guestId} 
                        onChange={(e) => updateGuestId(room.id, guestIndex, e.target.value)} 
                        placeholder="Guest ID"
                        className="flex-1 border rounded-md px-2 py-1 text-xs" 
                      />
                      <button 
                        type="button" 
                        onClick={() => removeGuestId(room.id, guestIndex)}
                        className="text-red-600 hover:text-red-800 text-xs px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addGuestId(room.id)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    + Add Guest
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm">Notes</label>
                <textarea 
                  value={room.notes} 
                  onChange={(e) => updateRoom(room.id, 'notes', e.target.value)} 
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm h-16" 
                  placeholder="Special requirements..."
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={addRoom} className="border rounded-md px-3 py-2 text-sm">Add</button>
                {rooms.length > 1 && (
                  <button type="button" onClick={() => removeRoom(room.id)} className="border rounded-md px-3 py-2 text-sm">Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
