import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    // Retrieve data saved in token
    return decode(this.getToken());
  }

  loggedIn() {
    // Check if the user is still logged in
    const token = this.getToken();
    // Use type coercion to check if token is NOT undefined and the token is NOT expired
    console.log(token);
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    // Check if the token has expired
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieve token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // Set token to localStorage and reload page to homepage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear token from localStorage and force logout with reload
    localStorage.removeItem('id_token');
    localStorage.removeItem('saved_books');
    // This will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

const authService = new AuthService();

export default authService;