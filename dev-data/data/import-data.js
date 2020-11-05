const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

dotenv.config({ path: './../../config.env' });

// const app = require('../../app');
const Word = require('../../models/wordModel');
const User = require('../../models/userModel');
const Example = require('../../models/exampleModel');
const WordClass = require('../../models/wordClassModel');
const WordForm = require('../../models/wordFormModel');
const Pronunciation = require('../../models/pronunciationModel');
const WordSense = require('../../models/wordSenseModel');
const Definition = require('../../models/definitionModel');
const WordList = require('../../models/wordListModel');
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/usersData.json`)
);

const wordLists = JSON.parse(
  fs.readFileSync(
    `${__dirname}/wordListsData.json`
  )
);

const words = JSON.parse(
  fs.readFileSync(`${__dirname}/wordsData.json`)
);

const wordClasses = JSON.parse(
  fs.readFileSync(
    `${__dirname}/wordClassesData.json`
  )
);

const examples = JSON.parse(
  fs.readFileSync(
    `${__dirname}/examplesData.json`
  )
);

const wordForms = JSON.parse(
  fs.readFileSync(
    `${__dirname}/wordFormsData.json`
  )
);
const pronunciations = JSON.parse(
  fs.readFileSync(
    `${__dirname}/pronunciationsData.json`
  )
);

const wordSenses = JSON.parse(
  fs.readFileSync(
    `${__dirname}/wordSensesData.json`
  )
);

const definitions = JSON.parse(
  fs.readFileSync(
    `${__dirname}/definitionsData.json`
  )
);

const DB_URI = process.env.DB_URI.replace(
  '<PWD>',
  process.env.DB_PWD
);

mongoose
  .connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((_) => {
    console.log('DB connected successully');
  })
  .catch((err) => console.log(err));

const insertDocs = async (model, docs) => {
  try {
    await model.insertMany(docs);
    console.log('Inserted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const createDoc = async (model, doc) => {
  try {
    await model.create(doc);
    console.log('Inserted!');
  } catch (err) {
    console.log(err);
  }
};

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Word.create(words);
    await WordClass.create(wordClasses);
    await Example.create(examples);
    await WordForm.create(wordForms);
    await WordSense.create(wordSenses);
    await Pronunciation.create(pronunciations);
    await Definition.create(definitions);

    await User.create(users);
    await WordList.create(wordLists);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION FROM DB
const deleteData = async () => {
  try {
    await Word.deleteMany();
    await WordClass.deleteMany();
    await Example.deleteMany();
    await WordForm.deleteMany();
    await WordSense.deleteMany();
    await Pronunciation.deleteMany();
    await Definition.deleteMany();

    await User.deleteMany();
    await WordList.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};
console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
