const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const Word = require('./../models/wordModel');
const WordList = mongoose.model('WordList');

exports.getSearchForm = (req, res) => {
  res.status(200).render('search', {
    title: 'Best English Dictionary',
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your new account',
  });
};

exports.getWord = catchAsync(async (req, res) => {
  const word = await Word.findOne({
    slug: req.params.slug,
  });

  console.log(word);
  res.status(200).render('word', {
    title: word.spelling,
    word,
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('settings', {
    title: 'Account settings',
    user: req.user,
  });
};

exports.getMyWordLists = (req, res) => {
  const { wordLists } = req.user;
  res.status(200).render('myWordLists', {
    title: 'My word lists',
    wordLists,
  });
};

exports.getMyWordList = catchAsync(
  async (req, res) => {
    const { slug } = req.params;
    const wordList = await WordList.findOne({
      slug,
    });

    console.log(wordList);
    res.status(200).render('wordList', {
      title: `My word list | ${wordList.slug}`,
      wordList,
    });
  }
);

exports.getForgotMyPasswordForm = (req, res) => {
  res.status(200).render('forgotMyPassword', {
    title: 'Forgot my password',
  });
};

exports.getResetMyPasswordForm = (req, res) => {
  res.status(200).render('resetMyPassword', {
    title: 'Reset my password',
  });
};
