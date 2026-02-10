import type {
  PlannerResponse,
  PlannerCreateRequest,
  PlannerUpdateRequest,
  TodoResponse,
  TodoCreateRequest,
  TodoUpdateRequest,
  TodoReorderRequest,
  PomoResponse,
  PomoCreateRequest,
  PomoUpdateRequest,
  ConcentrationCreate,
  ConcentrationResponse,
  PlannerDailyStatisticsResponse,
  PlannerWeeklyStatisticsResponse,
  PomoDailyStatisticsResponse,
  PomoMeStatisticsResponse,
  UserRead,
  TokenPairResponse,
  PaginatedResponse,
  ApiResponse,
} from './types';

const BASE_URL = '/api';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
let pomoBackendDown = false;
let weeklyStatsBackendDown = false;

const POMO_LOCAL_KEY = 'pomo_local_cache';

function readLocalPomos(): PomoResponse[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(POMO_LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as PomoResponse[];
    return [];
  } catch {
    return [];
  }
}

function writeLocalPomos(pomos: PomoResponse[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(POMO_LOCAL_KEY, JSON.stringify(pomos));
}

function upsertLocalPomo(pomo: PomoResponse) {
  const list = readLocalPomos();
  const idx = list.findIndex((item) => item.id === pomo.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...pomo, updated_at: new Date().toISOString() };
  } else {
    list.unshift(pomo);
  }
  writeLocalPomos(list);
  return pomo;
}

function removeLocalPomo(id: string) {
  const list = readLocalPomos().filter((item) => item.id !== id);
  writeLocalPomos(list);
}

function shouldFallback(error: unknown) {
  if (!(error instanceof Error)) return false;
  const msg = error.message || '';
  return msg.includes('500') || msg.includes('Failed to fetch');
}

async function tryRefreshToken(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/jwt/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (data?.access_token) {
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
      if (data.token_type) localStorage.setItem('token_type', data.token_type);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const tokenType = typeof window !== 'undefined' ? localStorage.getItem('token_type') : null;

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `${tokenType ?? 'Bearer'} ${token}`);
  if (options.headers) {
    const extra = new Headers(options.headers);
    extra.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    // Handle 401 with token refresh
    if (response.status === 401 && typeof window !== 'undefined' && retryCount === 0) {
      // Try to refresh the token
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = tryRefreshToken();
      }

      const refreshSuccess = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (refreshSuccess) {
        // Retry the original request with new token
        return request<T>(endpoint, options, retryCount + 1);
      }

      // Refresh failed - clear tokens and redirect
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_type');
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth';
      }
    }
    const errorBody = await response.text();
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  let json: any = {};
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }

  // Check if response conforms to our standard success envelope
  // Some endpoints return data directly or wrapped in { success: true, data: ... }
  // We need to handle both based on observation. 
  // Based on OpenAPI, most GET list responses are PaginatedResponseModel
  // Single item responses are ResponseModel

  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data as T;
  }

  return json as T;
}

// Helper to construct query string
function queryString(params: Record<string, any>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        if (value.length === 0) continue;
        query.append(key, value.join(' '));
      } else {
        query.append(key, String(value));
      }
    }
  }
  return query.toString() ? `?${query.toString()}` : '';
}

export const api = {
  auth: {
    login: async (data: { email?: string; username?: string; password: string }) => {
      const formData = new URLSearchParams();
      formData.append('username', data.email || data.username || '');
      formData.append('password', data.password);
      const res = await request<TokenPairResponse>('/auth/jwt/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      if (res && res.access_token) {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('token_type', res.token_type ?? 'Bearer');
        if (res.refresh_token) localStorage.setItem('refresh_token', res.refresh_token);
      }
      return res;
    },
    logout: async () => {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      if (refreshToken) {
        await request<void>('/auth/jwt/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_type');
    },
    register: (data: any) => request<UserRead>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    // Form.tsx uses getMe naming
    getMe: () => request<UserRead>('/auth/users/me'),
    getUser: (id: string) => request<UserRead>(`/auth/users/${id}`),
    patchMe: (data: Partial<UserRead>) => request<UserRead>('/auth/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
    patchUser: (id: string, data: Partial<UserRead>) => request<UserRead>(`/auth/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteUser: (id: string) => request<void>(`/auth/users/${id}`, { method: 'DELETE' }),
    refresh: async (refresh_token: string) => {
      const res = await request<TokenPairResponse>('/auth/jwt/refresh', { method: 'POST', body: JSON.stringify({ refresh_token }) });
      if (res?.access_token) localStorage.setItem('access_token', res.access_token);
      if (res?.refresh_token) localStorage.setItem('refresh_token', res.refresh_token);
      if (res?.token_type) localStorage.setItem('token_type', res.token_type);
      return res;
    },

    // Password & Verification
    forgotPassword: (email: string) => request<void>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token: string, password: string) => request<void>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
    requestVerifyToken: (email: string) => request<void>('/auth/request-verify-token', { method: 'POST', body: JSON.stringify({ email }) }),
    verify: (token: string) => request<UserRead>('/auth/verify', { method: 'POST', body: JSON.stringify({ token }) }),

    // Social & OAuth
    googleAuthorize: (scopes: string[] = []) => request<{ authorization_url: string }>(`/auth/google/authorize${queryString({ scopes })}`),
    googleCallback: (params: { code?: string; state?: string; error?: string }) => request<TokenPairResponse>(`/auth/google/callback${queryString(params)}`),

    kakaoAuthorize: (scopes: string[] = []) => request<{ authorization_url: string }>(`/auth/kakao/authorize${queryString({ scopes })}`),
    kakaoCallback: (params: { code?: string; state?: string; error?: string }) => request<TokenPairResponse>(`/auth/kakao/callback${queryString(params)}`),

    googleAssociateAuthorize: (scopes: string[] = []) => request<{ authorization_url: string }>(`/auth/google/associate/authorize${queryString({ scopes })}`),
    googleAssociateCallback: (params: { code?: string; state?: string; error?: string }) => request<UserRead>(`/auth/google/associate/callback${queryString(params)}`),

    kakaoAssociateAuthorize: (scopes: string[] = []) => request<{ authorization_url: string }>(`/auth/kakao/associate/authorize${queryString({ scopes })}`),
    kakaoAssociateCallback: (params: { code?: string; state?: string; error?: string }) => request<UserRead>(`/auth/kakao/associate/callback${queryString(params)}`),
  },
  planners: {
    list: (params: { start_date?: string; end_date?: string; page?: number; limit?: number }) =>
      request<any>(`/planners/${queryString(params)}`).then(res => {
        if (res && Array.isArray(res.items)) return res.items as PlannerResponse[];
        if (res && res.data && Array.isArray(res.data.items)) return res.data.items as PlannerResponse[];
        // If the backend returns wrapped response in "data" property but request unwrapped it
        if (res && Array.isArray(res)) return res as PlannerResponse[];
        return [] as PlannerResponse[];
      }),
    create: (data: PlannerCreateRequest) => request<PlannerResponse>('/planners/', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => request<PlannerResponse>(`/planners/${id}`),
    update: (id: string, data: PlannerUpdateRequest) => request<PlannerResponse>(`/planners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/planners/${id}`, { method: 'DELETE' }),
  },
  todos: {
    list: (params: { planner_id: string; status?: string; priority?: string; sort_by?: string }) =>
      request<any>(`/todos/${queryString(params)}`).then(res => {
        // Todos list endpoint returns ResponseModel_List_TodoResponse__ which contains data: TodoResponse[]
        // request() unwraps data. So res is TodoResponse[] or { items: ... }?
        // Specification says: ResponseModel_List_TodoResponse__ { success: boolean, data: TodoResponse[] }
        // request() returns json.data. So it should be TodoResponse[]
        if (Array.isArray(res)) return res as TodoResponse[];
        if (res && Array.isArray(res.items)) return res.items as TodoResponse[]; // Just in case it's paginated
        return [] as TodoResponse[];
      }),
    create: (data: TodoCreateRequest) => request<TodoResponse>('/todos/', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => request<TodoResponse>(`/todos/${id}`),
    update: (id: string, data: TodoUpdateRequest) => request<TodoResponse>(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (id: string, data: TodoUpdateRequest) => request<TodoResponse>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/todos/${id}`, { method: 'DELETE' }),
    reorder: (id: string, data: TodoReorderRequest) => request<TodoResponse>(`/todos/${id}/reorder`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  pomos: {
    list: async (params: { page?: number; limit?: number } = {}) => {
      if (pomoBackendDown) return readLocalPomos();
      try {
        const res = await request<any>(`/pomos/${queryString(params)}`);
        if (res && Array.isArray(res.items)) return res.items as PomoResponse[];
        // data: { items: [] } case handled by request unwrap + this check
        if (res && res.data && Array.isArray(res.data.items)) return res.data.items as PomoResponse[];
        if (Array.isArray(res)) return res as PomoResponse[];
        return [] as PomoResponse[];
      } catch (error) {
        if (shouldFallback(error)) {
          pomoBackendDown = true;
          return readLocalPomos();
        }
        throw error;
      }
    },
    create: async (data: PomoCreateRequest) => {
      if (pomoBackendDown) {
        const now = new Date().toISOString();
        const local: PomoResponse = {
          id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `local-${Date.now()}`,
          planner_id: data.planner_id ?? null,
          todo_id: data.todo_id ?? null,
          real_start_time: data.real_start_time ?? now,
          real_end_time: data.real_end_time ?? data.real_start_time ?? now,
          category: data.category ?? '기타',
          distraction_count: 0,
          edit_start_time: data.real_start_time ?? now,
          edit_end_time: data.real_end_time ?? data.real_start_time ?? now,
          created_at: now,
          updated_at: now,
        };
        return upsertLocalPomo(local);
      }
      try {
        const created = await request<PomoResponse>('/pomos/', { method: 'POST', body: JSON.stringify(data) });
        return created;
      } catch (error) {
        if (shouldFallback(error)) {
          pomoBackendDown = true;
          const now = new Date().toISOString();
          const local: PomoResponse = {
            id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `local-${Date.now()}`,
            planner_id: data.planner_id ?? null,
            todo_id: data.todo_id ?? null,
            real_start_time: data.real_start_time ?? now,
            real_end_time: data.real_end_time ?? data.real_start_time ?? now,
            category: data.category ?? '기타',
            distraction_count: 0,
            edit_start_time: data.real_start_time ?? now,
            edit_end_time: data.real_end_time ?? data.real_start_time ?? now,
            created_at: now,
            updated_at: now,
          };
          return upsertLocalPomo(local);
        }
        throw error;
      }
    },
    get: async (id: string) => {
      if (pomoBackendDown) {
        const local = readLocalPomos().find((item) => item.id === id);
        if (local) return local;
      }
      try {
        return await request<PomoResponse>(`/pomos/${id}`);
      } catch (error) {
        if (shouldFallback(error)) {
          pomoBackendDown = true;
          const local = readLocalPomos().find((item) => item.id === id);
          if (local) return local;
        }
        throw error;
      }
    },
    update: async (id: string, data: PomoUpdateRequest) => {
      if (pomoBackendDown) {
        const existing = readLocalPomos().find((item) => item.id === id);
        if (existing) {
          return upsertLocalPomo({
            ...existing,
            ...data,
            category: data.category ?? existing.category,
            edit_start_time: data.edit_start_time ?? existing.edit_start_time,
            edit_end_time: data.edit_end_time ?? existing.edit_end_time,
          });
        }
      }
      try {
        return await request<PomoResponse>(`/pomos/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
      } catch (error) {
        if (shouldFallback(error)) {
          pomoBackendDown = true;
          const existing = readLocalPomos().find((item) => item.id === id);
          if (existing) {
            return upsertLocalPomo({
              ...existing,
              ...data,
              category: data.category ?? existing.category,
              edit_start_time: data.edit_start_time ?? existing.edit_start_time,
              edit_end_time: data.edit_end_time ?? existing.edit_end_time,
            });
          }
        }
        throw error;
      }
    },
    delete: async (id: string) => {
      if (pomoBackendDown) {
        removeLocalPomo(id);
        return;
      }
      try {
        await request<void>(`/pomos/${id}`, { method: 'DELETE' });
      } catch (error) {
        if (shouldFallback(error)) {
          pomoBackendDown = true;
          removeLocalPomo(id);
          return;
        }
        throw error;
      }
    },
    addConcentration: async (id: string, data: ConcentrationCreate) => {
      if (pomoBackendDown) {
        const existing = readLocalPomos().find((item) => item.id === id);
        if (existing) {
          const next = {
            ...existing,
            distraction_count: data.event_type === 'PICK_UP' ? existing.distraction_count + 1 : existing.distraction_count,
          };
          upsertLocalPomo(next);
        }
        return {
          id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `local-log-${Date.now()}`,
          pomo_id: id,
          event_type: data.event_type,
          timestamp: data.timestamp ?? new Date().toISOString(),
        } as ConcentrationResponse;
      }
      try {
        return await request<ConcentrationResponse>(`/pomos/${id}/concentration`, { method: 'POST', body: JSON.stringify(data) });
      } catch (error) {
        if (shouldFallback(error)) {
          pomoBackendDown = true;
          const existing = readLocalPomos().find((item) => item.id === id);
          if (existing) {
            const next = {
              ...existing,
              distraction_count: data.event_type === 'PICK_UP' ? existing.distraction_count + 1 : existing.distraction_count,
            };
            upsertLocalPomo(next);
          }
          return {
            id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `local-log-${Date.now()}`,
            pomo_id: id,
            event_type: data.event_type,
            timestamp: data.timestamp ?? new Date().toISOString(),
          } as ConcentrationResponse;
        }
        throw error;
      }
    },
  },
  statistics: {
    daily: (date: string) => request<PlannerDailyStatisticsResponse>(`/statistics/daily?date=${date}`),
    plannerWeekly: async (startDate: string) => {
      if (weeklyStatsBackendDown) {
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const daily_breakdown = Array.from({ length: 7 }, (_, idx) => {
          const d = new Date(start);
          d.setDate(start.getDate() + idx);
          return { date: d.toISOString().slice(0, 10), total: 0, completed: 0 };
        });
        return {
          week_start: start.toISOString().slice(0, 10),
          week_end: end.toISOString().slice(0, 10),
          total_todos: 0,
          completed_todos: 0,
          completion_rate: 0,
          daily_breakdown,
        } satisfies PlannerWeeklyStatisticsResponse;
      }
      try {
        return await request<PlannerWeeklyStatisticsResponse>(`/statistics/planner/weekly?start_date=${startDate}`);
      } catch (error) {
        if (shouldFallback(error)) {
          weeklyStatsBackendDown = true;
        }
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const daily_breakdown = Array.from({ length: 7 }, (_, idx) => {
          const d = new Date(start);
          d.setDate(start.getDate() + idx);
          return {
            date: d.toISOString().slice(0, 10),
            total: 0,
            completed: 0,
          };
        });
        return {
          week_start: start.toISOString().slice(0, 10),
          week_end: end.toISOString().slice(0, 10),
          total_todos: 0,
          completed_todos: 0,
          completion_rate: 0,
          daily_breakdown,
        } satisfies PlannerWeeklyStatisticsResponse;
      }
    },
    pomoDaily: (date: string) => request<PomoDailyStatisticsResponse>(`/statistics/pomo/daily?date=${date}`),
    pomoMe: () => request<PomoMeStatisticsResponse>('/statistics/pomo/me'),
  },
  health: {
    check: () => request<any>('/health').then(() => ({ status: 'ok' })),
    dbTest: () => request<any>('/db-test').then(() => ({ status: 'connected' })),
  }
};
