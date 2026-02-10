const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://blaybum.haeyul.cloud:8000';

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  username: string;
  full_name: string;
  profile_image: string;
  role: 'mentee' | 'mentor';
}

export const getUser = async (id: string): Promise<User> => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  
  const response = await fetch(`${API_URL}/auth/users/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('유저 정보를 가져오는데 실패했습니다');
  }

  return response.json();
};

export interface Mentee {
  mentee_id: string;
  username: string;
  full_name: string;
  profile_image: string;
  mentoring_id: string;
  status: 'REQUEST' | 'APPROVED' | 'REJECTED' | 'ONGOING' | 'FINISHED';
  started_at: string;
}

export const getMentees = async (): Promise<Mentee[]> => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token');
  
  console.log('token:', token);

  const response = await fetch(`${API_URL}/mentoring/mentees`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('멘티 API 실패', response.status, text);
    throw new Error(`멘티 목록 실패 (${response.status})`);
  }

  const result = await response.json();
  return result.data;
};