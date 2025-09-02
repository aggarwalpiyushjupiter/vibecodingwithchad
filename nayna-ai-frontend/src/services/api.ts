import axios from 'axios';

export type InstanceSummary = {
  instanceId: string;
  eventId: string;
  brideFirstName: string;
  brideLastName?: string;
  groomFirstName: string;
  groomLastName?: string;
  eventDate: string; // ISO date (yyyy-mm-dd)
  instanceName: string; // e.g., "Bride & Groom Wedding"
  createdAt: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  timeout: 10000
});

export type AuthResponse = {
  user: { id: string; email: string; name?: string };
  token: string;
};

export async function loginWithEmail(payload: { email: string; password: string }): Promise<AuthResponse> {
  // const { data } = await api.post('/auth/login', payload);
  // return data;
  await new Promise((r) => setTimeout(r, 400));
  
  // Check for specific credentials
  if (payload.email === 'founders@nayna.ai' && payload.password === 'Nayna@101') {
    return {
      user: { id: 'user_001', email: payload.email, name: 'Nayna Support Executive' },
      token: 'mock-token'
    };
  }
  
  // For demo purposes, allow any email/password combination
  return {
    user: { id: 'user_001', email: payload.email, name: 'Nayna User' },
    token: 'mock-token'
  };
}

export async function loginWithGoogle(): Promise<AuthResponse> {
  // Typically you'd redirect to OAuth. For SPA placeholder, simulate success.
  await new Promise((r) => setTimeout(r, 400));
  return {
    user: { id: 'user_google_001', email: 'user@example.com', name: 'Google User' },
    token: 'mock-google-token'
  };
}

export async function listInstances(): Promise<InstanceSummary[]> {
  // Placeholder: replace with real backend call
  // const { data } = await api.get('/instances');
  // return data;
  return [
    {
      instanceId: 'inst_001',
      eventId: 'ananya_rahul_2025_001',
      brideFirstName: 'Ananya',
      groomFirstName: 'Rahul',
      eventDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      instanceName: 'Ananya & Rahul Wedding',
      createdAt: new Date().toISOString()
    },
    {
      instanceId: 'inst_002',
      eventId: 'meera_aarav_2025_002',
      brideFirstName: 'Meera',
      groomFirstName: 'Aarav',
      eventDate: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
      instanceName: 'Meera & Aarav Wedding',
      createdAt: new Date().toISOString()
    }
  ];
}

export async function saveHostDetails(payload: Record<string, unknown>): Promise<void> {
  // await api.post(`/instances/{id}/hosts`, payload);
  await new Promise((r) => setTimeout(r, 400));
}

export async function saveVenueDetails(payload: Record<string, unknown>): Promise<void> {
  // await api.post(`/instances/{id}/venue`, payload);
  await new Promise((r) => setTimeout(r, 400));
}

export async function saveEventDetails(payload: Record<string, unknown>): Promise<void> {
  // await api.post(`/instances/{id}/event`, payload);
  await new Promise((r) => setTimeout(r, 400));
}

export async function saveGuests(payload: unknown[]): Promise<void> {
  // await api.post(`/instances/{id}/guests`, payload);
  await new Promise((r) => setTimeout(r, 400));
}

export async function saveRSVPSettings(payload: Record<string, unknown>): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
}

export async function saveSchedule(payload: unknown[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
}

export async function saveTemplates(payload: unknown[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
}

export async function saveStaff(payload: unknown[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
}

export async function saveMessagingSettings(payload: Record<string, unknown>): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
}

export async function saveRoomDetails(payload: Record<string, unknown>): Promise<void> {
  // await api.post(`/instances/{id}/rooms`, payload);
  await new Promise((r) => setTimeout(r, 400));
}

