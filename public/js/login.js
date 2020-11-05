import axios from 'axios';
import { showAlert } from './alerts.js';

export const login = async (email, password) => {
  try {
    const res = await axios({
      url: `${window.location.origin}/api/v1/users/login`,
      method: 'POST',
      data: { email, password },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${window.location.origin}/api/v1/users/logout`,
    });
    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
  }
};

export const forgotPassword = async (email) => {
  try {
    console.log(email);
    const res = await axios({
      url: `${window.location.origin}/api/v1/users/forgotPassword`,
      method: 'POST',
      data: { email },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `We sent a reset password link to this email address: ${email}`
      );
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirm) => {
  try {
    console.log({ password, passwordConfirm });
    const resetToken = location.pathname.split('/')[2];
    const res = await axios({
      url: `${window.location.origin}/api/v1/users/resetPassword/${resetToken}`,
      method: 'PATCH',
      data: { password, passwordConfirm },
    });
    console.log(res.data);

    if (res.data.status === 'success') {
      showAlert('success', `Your password has been updated successfully`);
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', error.response.data.message);
    window.setTimeout(() => {
      location.assign('/login');
    }, 1500);
  }
};
