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

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://blaybum.haeyul.cloud:8000';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const tokenType = typeof window !== 'undefined' ? localStorage.getItem('token_type') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `${tokenType ?? 'Bearer'} ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
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
    list: (params: { page?: number; limit?: number } = {}) =>
      request<any>(`/pomos/${queryString(params)}`).then(res => {
        if (res && Array.isArray(res.items)) return res.items as PomoResponse[];
        // data: { items: [] } case handled by request unwrap + this check
        if (res && res.data && Array.isArray(res.data.items)) return res.data.items as PomoResponse[];
        if (Array.isArray(res)) return res as PomoResponse[];
        return [] as PomoResponse[];
      }),
    create: (data: PomoCreateRequest) => request<PomoResponse>('/pomos/', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => request<PomoResponse>(`/pomos/${id}`),
    update: (id: string, data: PomoUpdateRequest) => request<PomoResponse>(`/pomos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/pomos/${id}`, { method: 'DELETE' }),
    addConcentration: (id: string, data: ConcentrationCreate) => request<ConcentrationResponse>(`/pomos/${id}/concentration`, { method: 'POST', body: JSON.stringify(data) }),
  },
  statistics: {
    daily: (date: string) => request<PlannerDailyStatisticsResponse>(`/statistics/daily?date=${date}`),
    plannerWeekly: (startDate: string) => request<PlannerWeeklyStatisticsResponse>(`/statistics/planner/weekly?start_date=${startDate}`),
    pomoDaily: (date: string) => request<PomoDailyStatisticsResponse>(`/statistics/pomo/daily?date=${date}`),
    pomoMe: () => request<PomoMeStatisticsResponse>('/statistics/pomo/me'),
  },
  health: {
    check: () => request<any>('/health').then(() => ({ status: 'ok' })),
    dbTest: () => request<any>('/db-test').then(() => ({ status: 'connected' })),
  }
};
