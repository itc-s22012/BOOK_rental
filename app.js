import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import indexRouter from './routes/index.js';
import usersRouter from './routes/user.js';
import bookRouter from './routes/books.js';
import adminRouter from './routes/admin.js';
import rentalRouter from './routes/rental.js';
import authConfig from './util/auth.js';
const app = express();
BigInt.prototype.toJSON = function () {
  return this.toString()
}

app.set('views', path.join(import.meta.dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "B02CGO2YqVlyDXbfQ7a6CX3zNLSHzLkXM0BjRqfhIoSiVxtH",
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60 * 60 * 1000}
}));
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(passport.authenticate("session"));
authConfig(passport);

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use("/books", bookRouter);
app.use("/admin", adminRouter);
app.use("/rental", rentalRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
