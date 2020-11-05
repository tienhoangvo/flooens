import '@babel/polyfill';
import { login, logout, forgotPassword, resetPassword } from './login';
import { signup } from './signup';
import { searchWords } from './search';
import { updateMe } from './updateMe';
import { readURL } from './displayUploadImage';

import { populateVoices, speakerHandler } from './textToSpeech';

import { speechToText } from './speechToText';

import {
  createWordList,
  updateWordList,
  deleteWordlist,
  createWordListItem,
  deleteWordListItem,
} from './myWordListCrud';

const loginForm = document.querySelector('.login-form .form');

const signupForm = document.querySelector('.signup-form .form');
const forgotPasswordForm = document.querySelector(
  '.forgot-password-form .form'
);
const resetPasswordForm = document.querySelector('.reset-password-form .form');
const btnLogout = document.querySelector('.nav__item--logout');

const searchForm = document.querySelector('.search-form .form');

const userDataForm = document.querySelector('.form-user-data');

const userPasswordForm = document.querySelector('.form-user-settings');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    await login(email, password);
  });
}

if (btnLogout) {
  btnLogout.addEventListener('click', logout);
}

if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(email, name, password, passwordConfirm);
  });
}

if (searchForm) {
  const searchInput = document.querySelector('#search');

  let timeOutId;

  searchInput.addEventListener('input', async (event) => {
    clearTimeout(timeOutId);
    const searchString = event.target.value;

    if (!searchString) return;
    timeOutId = setTimeout(async () => {
      await searchWords(searchString);
    }, 500);
  });
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Listening...');
    speechToText(searchWords, searchInput);
  });
}

if (userDataForm) {
  const photoInput = document.querySelector('#photo');
  console.log(photoInput);
  photoInput.addEventListener('change', (event) => readURL(event.target));
  userDataForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const photoInput = document.querySelector('#photo');
    const form = new FormData();
    form.append('name', name);
    form.append('email', email);

    if (photoInput.files && photoInput.files[0])
      form.append('photo', photoInput.files[0]);

    document.querySelector('.btn--save-password').textContent = 'Updating •••';

    await updateMe(form, 'updateMe');
    document.querySelector('.btn--save-password').textContent = 'SAVE SETTINGS';
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating •••';
    const password = document.querySelector('#password').value;
    const passwordCurrent = document.querySelector('#password-current').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    await updateMe(
      {
        password,
        passwordCurrent,
        passwordConfirm,
      },
      'password'
    );

    document.querySelector('#password').value = '';
    document.querySelector('#password-current').value = '';
    document.querySelector('#password-confirm').value = '';

    document.querySelector('.btn--save-password').textContent = 'Save password';
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value;

    await forgotPassword(email);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;

    await resetPassword(password, passwordConfirm);
  });
}

if (location.pathname.startsWith('/words/')) {
  const pronunciationSpeakers = document.querySelectorAll(
    '.pronunciation__speaker'
  );
  const addToWordListBtns = document.querySelectorAll('.add-to-word-list');
  /////////////////////////
  // HANDLING SPEAKER BTNS

  // DECLARE ACCENTS WE WANT TO USE
  populateVoices('Google US English', 'Google UK English Male');

  // ADD EVENT EACH PRON SPEAKER :)
  for (const pronunciationSpeaker of pronunciationSpeakers) {
    pronunciationSpeaker.addEventListener('click', (event) => {
      // event.stopImmediatePropagation();
      const { wordSpelling } = event.target.dataset;

      const { pronunciationAccent } = event.target.dataset;

      speakerHandler(wordSpelling, pronunciationAccent);
    });
  }

  /////////////////////////
  // HANDLING add-to-list-btn BUTTONS

  const myWordLists = document.querySelector('#my-wordLists');

  let wordListItem;

  // ADD CLICK EVENT TO EACH BTN
  for (const addToWordListBtn of addToWordListBtns) {
    addToWordListBtn.addEventListener('click', (event) => {
      console.log(event.target.dataset);
      wordListItem = JSON.parse(event.target.dataset.wordListItem);

      myWordLists.classList.remove('hide');
    });
  }

  const myWordListLinks = document.querySelectorAll(
    '.my-wordLists__list__link'
  );

  console.log(myWordListLinks);
  if (myWordListLinks) {
    for (const myWordListLink of myWordListLinks) {
      myWordListLink.addEventListener('click', async (event) => {
        if (!wordListItem) {
          myWordLists.classList.add('hide');
          return;
        }

        const { wordListId } = event.target.dataset;

        await createWordListItem(wordListId, wordListItem);
      });
    }
  }
}

if (location.pathname.startsWith('/my-word-lists')) {
  const createWordListForm = document.querySelector('#wordList__create .form');
  if (createWordListForm) {
    createWordListForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.querySelector('#wordList-name--create').value;
      const description = document.querySelector(
        '#wordList-description--create'
      ).value;

      await createWordList(name, description);
    });
  }
  const updateWordListForm = document.querySelector('#wordList__update .form');
  const editWordListBtns = document.querySelectorAll('.wordList__btn--edit');

  for (const editWordListBtn of editWordListBtns)
    editWordListBtn.addEventListener('click', (event) => {
      console.log(event.target);
      const wordList = JSON.parse(event.target.dataset.wordList);

      console.log(wordList);
      document.querySelector('#wordList-name--update').value = wordList.name;
      document.querySelector('#wordList-description--update').value =
        wordList.description;

      updateWordListForm.dataset.wordListId = wordList.id;
    });
  if (updateWordListForm)
    updateWordListForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log(event.target.dataset);
      const name = document.querySelector('#wordList-name--update').value;
      const description = document.querySelector(
        '#wordList-description--update'
      ).value;
      const { wordListId } = event.target.dataset;
      if (!wordListId) return;
      await updateWordList(wordListId, name, description);
    });

  const deleteWordListBtns = document.querySelectorAll(
    '.wordList__btn--delete'
  );

  console.log(deleteWordListBtns);

  for (const deleteWordListBtn of deleteWordListBtns) {
    deleteWordListBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      const { wordListId } = event.target.dataset;
      console.log(wordListId);

      await deleteWordlist(wordListId);

      event.target.parentNode.parentNode.remove();
    });
  }

  const removeMyWordListBtns = document.querySelectorAll(
    '.remove-from-word-list'
  );

  for (const removeMyWordListBtn of removeMyWordListBtns) {
    removeMyWordListBtn.addEventListener('click', async (event) => {
      const wordListItem = JSON.parse(event.target.dataset.wordListItem);
      console.log(wordListItem);
      const wordListItemId = wordListItem._id;
      const wordListId = wordListItem.wordList;

      await deleteWordListItem(wordListId, wordListItemId);
    });
  }
}
