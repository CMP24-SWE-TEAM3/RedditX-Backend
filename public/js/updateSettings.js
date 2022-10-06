import { showAlert } from '/js/alerts.js';

const updateData = async (data, type) => {
  try {
    const route = type === 'password' ? 'updateMyPassword' : 'updateMe';
    axios.defaults.headers.common['Authorization'] = `Bearer ${
      document.cookie.match(new RegExp('(^| )' + 'jwt' + '=([^;]+)'))[2]
    }`;
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${route}`,
      data,
    });
    if (res.data.status === 'success') {
      if (type === 'password') {
        var expires = '';
        var date = new Date();
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
        document.cookie =
          'jwt=' + (res.data.token || '') + expires + '; path=/';
      }
      showAlert('success', 'Updated data successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updateUserDataForm = document.querySelector('#save-settings');
const updatePasswordForm = document.querySelector('#save-password');

if (updateUserDataForm) {
  updateUserDataForm.addEventListener('click', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('updatePhoto').files[0]);
    await updateData(form, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('click', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateData(
      { currentPassword, password, passwordConfirm },
      'password'
    );
  });
}
