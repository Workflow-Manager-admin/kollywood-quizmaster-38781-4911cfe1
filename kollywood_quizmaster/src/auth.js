//
// Simple authentication utilities for Kollywood QuizMaster
// Uses localStorage for demo only (not secure for production).
//

// PUBLIC_INTERFACE
export function isLoggedIn() {
  return !!localStorage.getItem('kq_user');
}

// PUBLIC_INTERFACE
export function login(username) {
  localStorage.setItem('kq_user', JSON.stringify({ username }));
}

// PUBLIC_INTERFACE
export function logout() {
  localStorage.removeItem('kq_user');
}

// PUBLIC_INTERFACE
export function getUsername() {
  const user = localStorage.getItem('kq_user');
  if (!user) return null;
  try {
    return JSON.parse(user).username;
  } catch {
    return null;
  }
}
