import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listInstances, InstanceSummary } from '../services/api';
import { useToast } from '../lib/ui/ToastContext';

export function InstancesPage() {
  const { showToast } = useToast();
  const [instances, setInstances] = useState<InstanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [brideFirstName, setBrideFirstName] = useState('');
  const [brideLastName, setBrideLastName] = useState('');
  const [groomFirstName, setGroomFirstName] = useState('');
  const [groomLastName, setGroomLastName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await listInstances();
        setInstances(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return instances;
    const q = query.toLowerCase();
    return instances.filter((i) =>
      i.instanceName.toLowerCase().includes(q) ||
      i.eventId.toLowerCase().includes(q) ||
      i.brideFirstName.toLowerCase().includes(q) ||
      i.groomFirstName.toLowerCase().includes(q) ||
      i.eventDate.includes(q)
    );
  }, [instances, query]);

  if (loading) {
    return <div>Loading instances…</div>;
  }

  const createInstance = async () => {
    if (!brideFirstName.trim() || !groomFirstName.trim() || !eventDate) {
      showToast({ variant: 'error', message: 'Bride, Groom and Event Date are required' });
      return;
    }
    const year = new Date(eventDate).getFullYear();
    const serial = String(instances.length + 1).padStart(3, '0');
    const eventId = `${brideFirstName.toLowerCase()}_${groomFirstName.toLowerCase()}_${year}_${serial}`;
    const instanceName = `${brideFirstName} & ${groomFirstName} Wedding`;
    const newInst: InstanceSummary = {
      instanceId: `inst_${Date.now()}`,
      eventId,
      brideFirstName,
      brideLastName,
      groomFirstName,
      groomLastName,
      eventDate,
      instanceName,
      createdAt: new Date().toISOString()
    };
    setInstances((arr) => [newInst, ...arr]);
    setBrideFirstName(''); setBrideLastName(''); setGroomFirstName(''); setGroomLastName(''); setEventDate('');
    showToast({ variant: 'success', message: 'Instance created' });
  };

  

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Your Instances</h1>
      <div className="bg-white border rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-5 gap-2">
        <input value={brideFirstName} onChange={(e) => setBrideFirstName(e.target.value)} placeholder="Bride First Name" className="border rounded-md px-3 py-2 text-sm" />
        <input value={brideLastName} onChange={(e) => setBrideLastName(e.target.value)} placeholder="Bride Last Name" className="border rounded-md px-3 py-2 text-sm" />
        <input value={groomFirstName} onChange={(e) => setGroomFirstName(e.target.value)} placeholder="Groom First Name" className="border rounded-md px-3 py-2 text-sm" />
        <input value={groomLastName} onChange={(e) => setGroomLastName(e.target.value)} placeholder="Groom Last Name" className="border rounded-md px-3 py-2 text-sm" />
        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="border rounded-md px-3 py-2 text-sm" />
        <div className="sm:col-span-5 flex gap-2">
          <button onClick={createInstance} className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm">Create Instance</button>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, event ID, date…" className="border rounded-md px-3 py-2 text-sm flex-1" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-2">Event</th>
              <th className="text-left px-4 py-2">Event ID</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Days to go</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inst) => {
              const days = Math.ceil((new Date(inst.eventDate).getTime() - Date.now()) / 86400000);
              return (
                <tr key={inst.instanceId} className="border-t">
                  <td className="px-4 py-2">{inst.instanceName}</td>
                  <td className="px-4 py-2 text-gray-600">{inst.eventId}</td>
                  <td className="px-4 py-2">{inst.eventDate}</td>
                  <td className="px-4 py-2">{days >= 0 ? days : 0}</td>
                  <td className="px-4 py-2">
                    <Link to={`/instances/${inst.instanceId}`} className="text-blue-600 hover:underline">Open</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

