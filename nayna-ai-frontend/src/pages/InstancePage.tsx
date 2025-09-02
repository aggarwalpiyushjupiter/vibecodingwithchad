import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import { HostDetailsForm } from './forms/HostDetailsForm';
import { VenueDetailsForm } from './forms/VenueDetailsForm';
import { EventDetailsForm } from './forms/EventDetailsForm';
import { GuestsForm } from './forms/GuestsForm';
import { ScheduleForm } from './forms/ScheduleForm';
import { TemplatesForm } from './forms/TemplatesForm';
import { StaffForm } from './forms/StaffForm';
import { MessagingSettingsForm } from './forms/MessagingSettingsForm';

export function InstancePage() {
  const { instanceId } = useParams();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Instance: {instanceId}</h1>
      </div>

      <div className="border-b mb-4 text-sm">
        <nav className="flex gap-4">
          <NavLink to={"hosts"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Hosts</NavLink>
          <NavLink to={"venue"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Venue</NavLink>
          <NavLink to={"event"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Event</NavLink>
          <NavLink to={"guests"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Guests</NavLink>
          <NavLink to={"schedule"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Schedule</NavLink>
          <NavLink to={"templates"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Templates</NavLink>
          <NavLink to={"staff"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Staff</NavLink>
          <NavLink to={"messaging"} className={({ isActive }) => isActive ? 'border-b-2 border-blue-600 py-2' : 'py-2 text-gray-600'}>Messaging</NavLink>
        </nav>
      </div>

      <Routes>
        <Route path="hosts" element={<HostDetailsForm />} />
        <Route path="venue" element={<VenueDetailsForm />} />
        <Route path="event" element={<EventDetailsForm />} />
        <Route path="guests" element={<GuestsForm />} />
        <Route path="schedule" element={<ScheduleForm />} />
        <Route path="templates" element={<TemplatesForm />} />
        <Route path="staff" element={<StaffForm />} />
        <Route path="messaging" element={<MessagingSettingsForm />} />
        <Route index element={<HostDetailsForm />} />
      </Routes>
    </div>
  );
}

