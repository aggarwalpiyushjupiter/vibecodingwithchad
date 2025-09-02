import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listInstances, InstanceSummary } from '../services/api';
import { useToast } from '../lib/ui/ToastContext';

export function InstancesPage() {
  const { showToast } = useToast();
  const [instances, setInstances] = useState<InstanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

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

  if (loading) {
    return <div>Loading instances…</div>;
  }

  const createInstance = async () => {
    // TODO: replace with API
    if (!name.trim()) {
      showToast({ variant: 'error', message: 'Enter a name' });
      return;
    }
    const newInst: InstanceSummary = { instanceId: `inst_${Date.now()}`, instanceName: name, createdAt: new Date().toISOString() };
    setInstances((arr) => [newInst, ...arr]);
    setName('');
    showToast({ variant: 'success', message: 'Instance created' });
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Your Instances</h1>
      <div className="bg-white border rounded-lg p-4 mb-4 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New instance name" className="border rounded-md px-3 py-2 text-sm flex-1" />
        <button onClick={createInstance} className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm">Create</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {instances.map((inst) => (
          <Link key={inst.instanceId} to={`/instances/${inst.instanceId}`} className="border rounded-lg p-4 bg-white hover:shadow">
            <div className="font-medium">{inst.instanceName}</div>
            <div className="text-xs text-gray-500">ID: {inst.instanceId}</div>
            <div className="text-xs text-gray-500">Created: {new Date(inst.createdAt).toLocaleString()}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

