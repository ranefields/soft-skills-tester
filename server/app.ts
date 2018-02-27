import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';

import './config/config';
import { createConnection } from 'typeorm';
import { router } from './routes/routes';
const crypto = require('crypto');
import { User } from "./models/User";
import { Role, RoleNames } from "./models/Role";
export let app = express();

// Get database connection
createConnection()
  .then(async connection => {
    console.log("Successfully connected to the database.");
  let role1 = new Role();
  role1.name = RoleNames.Admin;
  let role2 = new Role();
  role2.name = RoleNames.Client;
  let role3 = new Role();
  role3.name = RoleNames.Subject;
    let roles = [role1, role2, role3];
    roles.forEach(async function(role){
      let rolefinder = await connection.manager.getRepository(Role).findOne({name:role.name});
      if(!rolefinder) {
        await connection.manager.save(role);
      }
    });
    let admin = new User();
    admin.email = process.env.ADMIN_EMAIL;
    admin.normalized_email = process.env.ADMIN_EMAIL.toUpperCase();
    admin.salt = crypto.randomBytes(128).toString('hex');
    admin.hash = crypto.pbkdf2Sync(process.env.ADMIN_PASSWORD, admin.salt, 1000, 64, 'sha512').toString('hex');
    admin.role = await connection.manager.getRepository(Role).findOne({name:RoleNames.Admin});
    let finder = await connection.manager.getRepository(User).findOne({email:admin.email});
    if(!finder){
      await connection.manager.save(admin);
    }
  })
  .catch((err) => console.error("Error connecting to the database!\n" + err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../dist'))); // Add Angular build folder to static files

// load api routes
app.use(router);

// Load Angular and let it handle view routes
app.get('*', function(req, res) {
  if (req.accepts('html')) {
    res.sendfile('./dist/index.html');
  }
});

// TODO: Log errors to console instead of rendering view
// ==================================================================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err["status"] = 404;
  next(err);
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