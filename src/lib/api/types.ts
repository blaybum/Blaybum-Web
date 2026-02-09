export type Priority = 'high' | 'medium' | 'low';
export type TodoStatus = 'todo' | 'done'; // Inferred from usage in planner page, adapt if different in spec
export type PomoCategory = '수학' | '영어' | '국어' | '과학' | '사회' | '기타';

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
}

// Auth
export interface TokenPairResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserRead {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  username?: string | null;
  full_name?: string | null;
  profile_image?: string | null;
  role: 'mentor' | 'mentee';
}

// Planners
export interface PlannerResponse {
  planner_id: string;
  plan_date: string; // YYYY-MM-DD
  day_of_week: string;
  daily_goal?: number | null;
  memo?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlannerCreateRequest {
  plan_date: string;
}

export interface PlannerUpdateRequest {
  daily_goal?: number | null;
  memo?: string | null;
}

// Todos
export interface TodoResponse {
  todo_id: string;
  planner_id: string;
  title: string;
  description?: string | null;
  scheduled_time?: string | null; // HH:MM
  priority: Priority;
  status: string;
  estimated_duration_minutes?: number | null;
  actual_duration_minutes?: number | null;
  completed_at?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TodoCreateRequest {
  planner_id: string;
  title: string;
  description?: string | null;
  scheduled_time?: string | null;
  estimated_duration_minutes?: number | null;
  priority?: Priority;
}

export interface TodoUpdateRequest {
  title?: string | null;
  description?: string | null;
  scheduled_time?: string | null;
  estimated_duration_minutes?: number | null;
  actual_duration_minutes?: number | null;
  priority?: Priority | null;
  status?: string | null;
}

export interface TodoReorderRequest {
  planner_id: string;
  orders: { todo_id: string; order_index: number }[];
}

// Pomo (Pomodoro)
export interface PomoCreateRequest {
  planner_id?: string | null;
  todo_id?: string | null;
  real_start_time?: string | null;
  real_end_time?: string | null;
  category?: PomoCategory;
}

export interface PomoResponse {
  id: string;
  planner_id?: string | null;
  todo_id?: string | null;
  real_start_time: string;
  real_end_time: string;
  category: PomoCategory;
  distraction_count: number;
  edit_start_time: string;
  edit_end_time: string;
  created_at: string;
  updated_at: string;
}

export interface PomoUpdateRequest {
  todo_id?: string | null;
  category?: PomoCategory | null;
  edit_start_time?: string | null;
  edit_end_time?: string | null;
}

// Statistics
export interface DailyBreakdown {
  date: string;
  total: number;
  completed: number;
}

export interface PlannerWeeklyStatisticsResponse {
  week_start: string;
  week_end: string;
  total_todos: number;
  completed_todos: number;
  completion_rate: number;
  daily_breakdown: DailyBreakdown[];
}

export interface PlannerDailyStatisticsResponse {
  date: string;
  total_todos: number;
  completed_todos: number;
  completion_rate: number;
  by_priority: {
    high: { total: number; completed: number };
    medium: { total: number; completed: number };
    low: { total: number; completed: number };
  };
}

export interface PomoDailyStatisticsResponse {
  date: string;
  total_study_time_minutes: number;
  pomo_count: number;
  completed_todos: number;
  total_distraction_count: number;
}

export interface PomoMeStatisticsResponse {
  total_study_time_minutes: number;
  average_daily_minutes: number;
  total_pomo_count: number;
  total_distraction_count: number;
  best_day?: string | null;
}

export interface ConcentrationCreate {
  event_type: 'PICK_UP' | 'PUT_DOWN';
  timestamp?: string | null;
}

export interface ConcentrationResponse {
  id: string;
  pomo_id: string;
  event_type: 'PICK_UP' | 'PUT_DOWN';
  timestamp: string;
}
