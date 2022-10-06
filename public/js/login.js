import { showAlert } from '/js/alerts.js';

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      var expires = '';
      var date = new Date();
      date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
      document.cookie = 'jwt=' + (res.data.token || '') + expires + '; path=/';
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else alert('Incorrect email or password');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logout = async () => {
  try {
    var expires = '';
    var date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 1000);
    expires = '; expires=' + date.toUTCString();
    document.cookie = 'jwt=loggedout' + expires + '; path=/';
    location.reload(true); // true forces to get the data again from server not browser cache
  } catch (err) {
    showAlert('error', 'Error logging out! please try again.');
  }
};

const loginForm = document.querySelector('#login');

if (loginForm) {
  loginForm.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

const logOutBtn = document.querySelector('.nav__el--logout');

if (logOutBtn) logOutBtn.addEventListener('click', logout);
