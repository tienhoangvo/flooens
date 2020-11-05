const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const wordClassRouter = require('./routes/wordClassRoutes');
const exampleRouter = require('./routes/exampleRoutes');
const wordFormRouter = require('./routes/wordFormRoutes');
const pronunciationRouter = require('./routes/pronunciationRoutes');
const wordSenseRouter = require('./routes/wordSenseRoutes');
const definitionRouter = require('./routes/definitionRoutes');
const wordRouter = require('./routes/wordRoutes');
const userRouter = require('./routes/userRoutes');
const wordListRouter = require('./routes/wordListRoutes');
const wordListItemRouter = require('./routes/wordListItemRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//Implement CORS
app.use(cors());
// app.use(cors({ origin: 'https://www.natours.com' }));
// Setting security HTTP Headers

app.options('*', cors());
//app.options('/api/v1/tours:id', cors());

app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Implementing Rate Limiting
const apiLimiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests sent from this IP, please try again after an hour!',
});
app.use('/api', apiLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(
  hpp({
    whitelist: ['word', 'wordClass', 'createdAt', 'updatedAt', 'guideWord'],
  })
);
app.use(compression());

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/words', wordRouter);
app.use('/api/v1/wordClasses', wordClassRouter);
app.use('/api/v1/examples', exampleRouter);
app.use('/api/v1/wordForms', wordFormRouter);
app.use('/api/v1/pronunciations', pronunciationRouter);
app.use('/api/v1/wordSenses', wordSenseRouter);
app.use('/api/v1/definitions', definitionRouter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/wordLists', wordListRouter);
app.use('/api/v1/wordListItems', wordListItemRouter);

app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);
module.exports = app;
