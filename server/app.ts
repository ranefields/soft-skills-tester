import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as crypto from 'crypto';
import * as cors from 'cors';
import 'reflect-metadata';
import './utility/console-extensions';
import './config/config';
import { loadPassport} from './config/passport';
import { loadRoutes } from './routes/routes';
import { createConnection } from 'typeorm';
import { AuthService } from './services/auth.service';
import { RoleService } from './services/role.service';
import { SoftSkillService } from './services/soft-skill.service';

export class App {
  /** Very important function. */
  private static showStartupMessage() {
    console.logInEnvironment({exclude: ['testing']},
      "===============================\n" +
      "==           WELCOME         ==\n" +
      "==============================="
    );
    console.logInEnvironment({exclude: ['testing']}, `Node environment: ${process.env.NODE_ENV}\n`);
  }

  /** Connects to the database with the default connection. */
  private static async connectToDb() {
    console.logInEnvironment({exclude: ['testing']}, "Connecting to the database...");
    await createConnection()
      .then(async (connection) => {
        console.logInEnvironment({exclude: ['testing']}, "Loading initial data...");
        let roleService = new RoleService();
        let softSkillService = new SoftSkillService();
        let authService = new AuthService();
        await roleService.syncRolesToDbAsync();
        await softSkillService.syncSoftSkillsToDbAsync();
        await authService.generateDefaultAdminIfNoAdminAsync();
        console.logInEnvironment({exclude: ['testing']}, "Successfully connected to the database.");
      })
      .catch((err) => console.error("Error connecting to the database!\n" + err));
  }

  /** Returns a promise wrapper for the Express app. */
  static async initAsync(): Promise<any> {
    this.showStartupMessage();
    // TODO: Connecting breaks in testing environment?
    await this.connectToDb();

    let app = express();
    if (process.env.NODE_ENV === 'development') { app.use(logger('dev')); } // Log http requests in dev mode

    // Load middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname, '/../dist'))); // Add Angular build folder to static files

    // Load api routes with passport
    loadPassport();
    app.use(passport.initialize());
    app.use(loadRoutes());

    // Load Angular and let it handle view routes
    app.get('**', function(req, res, next) {
      // If not AJAX request
      if (!(req.xhr || req.headers.accept.indexOf('json') > -1)) {
        let indexPage = path.join(__dirname, '../dist/index.html');
        res.sendFile(indexPage, (err) => {
          if (err) {
            let errMsg = "index.html could not be found!";
            console.error(errMsg);
            res.status(500);
            res.send(errMsg);
          }
        });
      }
      else {
        next();
      }
    });

    // ===== Error handling ===== //
    // Catch 404 and forward to error handler
    app.use(function(req, res, next) {
      let err = new Error('The requested route could not be found');
      err["status"] = 404;
      next(err);
    });

    // Error handler
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.json({"message": err.name + ": " + err.message});
    });

    return app;
  };
}
