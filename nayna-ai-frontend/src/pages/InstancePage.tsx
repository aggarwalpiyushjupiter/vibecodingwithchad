import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HostDetailsForm } from './forms/HostDetailsForm';
import { VenueEventForm } from './forms/VenueEventForm';
import { GuestsForm } from './forms/GuestsForm';
import { ScheduleForm } from './forms/ScheduleForm';
import { listInstances, InstanceSummary } from '../services/api';

export function InstancePage() {
  const { instanceId } = useParams();
  const [instance, setInstance] = useState<InstanceSummary | null>(null);

  useEffect(() => {
    const fetchInstance = async () => {
      try {
        const instances = await listInstances();
        const foundInstance = instances.find(inst => inst.instanceId === instanceId);
        setInstance(foundInstance || null);
      } catch (error) {
        console.error('Failed to fetch instance:', error);
      }
    };

    if (instanceId) {
      fetchInstance();
    }
  }, [instanceId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Event: {instance?.eventId || instanceId}</h1>
      </div>

      <div className="border-b mb-4 text-sm">
        <nav className="flex gap-4">
          <NavLink to={"hosts"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Hosts</NavLink>
          <NavLink to={"venue-event"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Venue & Event</NavLink>
          <NavLink to={"guests"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Guests</NavLink>
          <NavLink to={"schedule"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Communication Calendar</NavLink>
        </nav>
      </div>

      <Routes>
        <Route path="hosts" element={<HostDetailsForm />} />
        <Route path="venue-event" element={<VenueEventForm />} />
        <Route path="guests" element={<GuestsForm />} />
        <Route path="schedule" element={<ScheduleForm />} />
        <Route index element={<HostDetailsForm />} />
      </Routes>
    </div>
  );
}

