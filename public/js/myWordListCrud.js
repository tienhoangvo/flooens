import axios from 'axios';
import { showAlert, hideAlert } from './alerts';
export const createWordList = async (name, description) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/me/wordLists',
      data: {
        name,
        description,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Created new wordList succesfully');
      window.setTimeout(() => {
        location.assign('/my-word-lists');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const updateWordList = async (wordListId, name, description) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/me/wordLists/${wordListId}`,
      data: {
        name,
        description,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated wordList succesfully');
      window.setTimeout(() => {
        location.assign('/my-word-lists');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const deleteWordlist = async (wordListId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/users/me/wordLists/${wordListId}`,
    });

    showAlert('success', 'Deleted wordList succesfully');
    // window.setTimeout(() => {
    //   location.assign('/my-word-lists');
    // }, 1500);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const createWordListItem = async (wordListId, wordListItem) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/me/wordLists/${wordListId}/wordListItems`,
      data: wordListItem,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Created new wordListItem succesfully');
      window.setTimeout(() => {
        document.querySelector('#my-wordLists').classList.add('hide');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const deleteWordListItem = async (wordListId, wordListItemId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/users/me/wordLists/${wordListId}/wordListItems/${wordListItemId}`,
    });

    showAlert('success', 'Deleted new wordListItem succesfully');
    window.setTimeout(() => {
      location.reload(true);
    }, 1500);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
