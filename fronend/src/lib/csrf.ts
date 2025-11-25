import { API_URL } from './api';

// Get CSRF token from cookies
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  
  // If no cookie, try to get from sessionStorage as fallback
  if (!cookieValue && typeof sessionStorage !== 'undefined') {
    cookieValue = sessionStorage.getItem('csrftoken');
  }
  
  return cookieValue;
}

// Fetch CSRF token from Django
export async function fetchCsrfToken(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/csrf/`, {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      // Store in sessionStorage as backup
      if (data.csrfToken && typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('csrftoken', data.csrfToken);
      }
    }
  } catch (err) {
    console.error('Failed to fetch CSRF token:', err);
  }
}
