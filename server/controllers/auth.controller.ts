import { fixThis } from './../utility/fix-this';
import { reqRequire, requireRole, exceptionResult } from './../utility/express-utilities';
import * as passport from 'passport';
import { User } from './../models/User';
import { ValidationToken } from './../models/ValidationToken';
import { AuthService } from './../services/auth.service';
import { RegistrationResult, FailureReason } from './../services/auth.service.models';

// https://www.sitepoint.com/user-authentication-mean-stack/

export interface AuthControllerDependencies {
  authService: AuthService;
}

export class AuthController {
  private authService: AuthService;

  constructor(dependencies: AuthControllerDependencies = null) {
    this.authService = dependencies ? dependencies.authService : new AuthService();
    fixThis(this, AuthController);
  }

  public async registerClient(req, res) {
    try {
      if(!reqRequire(req, res,
        ['body', 400, "Request body missing",
          ['username', 400, "Missing 'username' in request body"],
          ['email', 400, "Missing 'email' in request body"],
          ['password', 400, "Missing 'password' in request body"]]
      )) { return; }
      let username = req.body.username;
      let email = req.body.email;
      let password = req.body.password;
      console.logDev(`Registering ${username} | ${email}...`);
      let result = await this.authService.registerClientAsync(username, email, password);
      if (result.succeeded) {
        let user = result.registeredUser;
        let msg = `Registered ${username} with id ${user.id}`;
        console.logDev(msg);
        res.status(200);
        res.json({
          message: msg,
          token: user.generateJwt()
        });
        return;
      }
      else {
        let msg = `Registration failed: ${result.failureReason}`;
        console.logDev(msg);
        res.status(422);
        res.json({
          message: msg,
          failureReason: result.failureReason
        });
        return;
      }
    }
    catch (err) { exceptionResult(err, res); }
  }

  public async registerAdmin(req, res) {
    try {
      if(!reqRequire(req, res,
        ['body', 400, "Request body missing",
          ['email', 400, "Missing 'email' in request body"]]
      )) { return; }
      console.logDev(`Registering new Admin | ${req.body.email}...`);
      let adminCredentials = await this.authService.generateAdminCredentials(req.body.email);
      let result = await this.authService.registerAdminAsync(adminCredentials.username, adminCredentials.email, adminCredentials.password);
      if (result.succeeded) {
        let user = result.registeredUser;
        let msg = `Registered ${user.email} with id ${user.id} as Admin`;
        console.logDev(msg);
        res.status(200);
        res.json({
          message: msg
        });
        return;
      }
      else {
        let msg = `Registration failed: ${result.failureReason}`;
        console.logDev(msg);
        res.status(422);
        res.json({
          message: msg,
          failureReason: result.failureReason
        });
        return;
      }
    }
    catch (err) { exceptionResult(err, res); }
  }

  // TODO: Do checks for name/email uniqueness
  public async changeAdmin(req, res) {
    try {
      console.log(req.jwt);
      if(!reqRequire(req, res,
        ['body', 400, "Request body missing",
          ['username', 400, "Missing 'username' in request body"],
          ['email', 400, "Missing 'email' in request body"],
          ['password', 400, "Missing 'password' in request body"]],
        ['jwt', 401, "Missing auth token",
          ['id', 400, "Malformed auth token"]]
      )) { return; }
      let username = req.body.username;
      let email = req.body.email;
      let password = req.body.password;
      console.logDev(`Changing ${req.jwt.username} | ${req.jwt.email}...`);
      let user = await this.authService.changeAdmin(req.jwt.id, username, email, password);
      if (user) {
        let msg = `Changed ${username} with id ${user.id}`;
        console.logDev(msg);
        res.status(200);
        res.json({
          message: msg,
          token: user.generateJwt()
        });
        return;
      }
      else {
        let msg = `Username or email taken`;
        console.logDev(msg);
        res.status(422);
        res.json({
          message: msg
        });
        return;
      }
    }
    catch (err) { exceptionResult(err, res); }
  }

  public async registerSubject(req, res) {
    try {
      if(!reqRequire(req, res,
        ['body', 400, "Request body missing",
          ['username', 400, "Missing 'username' in request body"],
          ['email', 400, "Missing 'email' in request body"],
          ['password', 400, "Missing 'password' in request body"]]
      )) { return; }
      let username = req.body.username;
      let email = req.body.email;
      let password = req.body.password;
      console.logDev(`Registering ${username} | ${email}...`);
      let result = await this.authService.registerSubjectAsync(username, email, password);
      if (result.succeeded) {
        let user = result.registeredUser
        let msg = `Registered ${username} with id ${user.id}`;
        console.logDev(msg);
        res.status(200);
        res.json({
          message: msg,
          token: user.generateJwt()
        });
        return;
      }
      else {
        let msg = `Registration failed: ${result.failureReason}`;
        console.logDev(msg);
        res.status(422);
        res.json({
          message: msg,
          failureReason: result.failureReason
        });
        return;
      }
    }
    catch (err) { exceptionResult(err, res); }
  }

  public async loginLocal(req, res) {
    if(!reqRequire(req, res,
      ['body', 400, "Request body missing",
        ['loginName', 400, "Missing 'loginName' in request body"],
        ['password', 400, "Missing 'password' in request body"]]
    )) { return; }
    let loginName = req.body.loginName;
    let password = req.body.password;
    passport.authenticate('local', (err, user, info) => {
      console.logDev(`Logging in ${loginName}...`);
      if (err) {
        console.logDev(err);
        res.status(500).json(err);
        return;
      }
      if (user) {
        let msg = `Successfully logged in ${loginName}`;
        console.logDev(msg);
        res.status(200);
        res.json({
          message: msg,
          token: user.generateJwt()
        });
        return;
      }
      else {
        let msg = `Login failed: ${info.message}`;
        console.logDev(msg);
        res.status(401).json(info);
      }
    })(req, res);
  }

  public async sendResetEmail(req, res) {
    try {
      if(!reqRequire(req, res,
        ['body', 400, "Request body missing",
          ['email', 400, "Missing 'email' in request body"]],
        ['headers', 400, "Request headers missing",
          ['host', 400, "Missing 'host' in request headers"]]
      )) { return; }
      let sendSuccess = await this.authService.sendPassResetEmail(req.body.email, req.headers.host);
      if(sendSuccess) {
        res.status(200);
        res.json({
          message: "Email Sent"
        });
        return;
      } else {
        res.status(422);
        res.json({
          message: "Email Doesn't Exist"
        });
        return;
      }
    }
    catch (err) { exceptionResult(err, res); }
  }

  public async resendResetEmail(req, res) {
    try {
      if(!reqRequire(req, res,
        ['body', 400, "Request body missing",
          ['userId', 400, "Missing 'userId' in request body"]],
        ['headers', 400, "Request headers missing",
          ['host', 400, "Missing 'host' in request headers"]]
      )) { return; }
      let sendSuccess = await this.authService.resendPasswordResetEmail(req.body.userId, req.headers.host);
      if(sendSuccess) {
        res.status(200);
        res.json({
          message: "Email Sent"
        });
        return;
      } else {
        res.status(422);
        res.json({
          message: "Email Failed to Send"
        });
        return;
      }
    }
    catch (err) { exceptionResult(err, res); }
  }

  public async passChange(req, res) {
    try {
      if(!reqRequire(req, res,
        ['body', 400, "Request body missing",
          ['newPass', 400, "Missing 'newPass' in request body"],
          ['userId', 400, "Missing 'userId' in request body"],
          ['token', 400, "Missing 'token' in request body"]]
      )) { return; }
      let passChangeSuccess = await this.authService.changePassword(req.body.newPass, req.body.userId, req.body.token);
      if(passChangeSuccess === 0) {
        res.status(401);
        res.json({
          message: "Invalid token"
        });
        return;
      } else if (passChangeSuccess === 1) {
        res.status(422);
        res.json({
          message: "New Password Cannot Match Old Password"
        });
        return;
      } else if (passChangeSuccess === 2) {
        res.status(200);
        res.json({
          message: "Password Changed"
        });
        return;
      }
    }
    catch (err) { exceptionResult(err, res); }
  }

  public async verifyUser(req, res) {
    try {
      if(!reqRequire(req, res,
        ['body', 400, "Request body missing",
          ['code', 400, "Missing 'code' in request body"]],
        ['jwt', 401, "Missing auth token",
          ['id', 400, "Malformed auth token"]]
      )) { return; }
      let user = await this.authService.checkValidationCode(req.body.code, req.jwt.id);
      if (user) {
        res.status(200);
        res.json({
          message: "User successfully validated",
          token: user.generateJwt()
        });
        return;
      }
      else {
        res.status(401);
        res.json({
          message: "User validation failed"
        });
        return;
      }
    }
    catch (err) { exceptionResult(err, res); }
  }

  public async verifyAdmin(req, res) {
    try {
      if(!reqRequire(req, res,
        ['body', 400, "Request body missing"],
        ['jwt', 401, "Missing auth token",
          ['id', 400, "Malformed auth token"]]
      )) { return; }
      let user = await this.authService.verifyAdmin(req.jwt.id);
      if (user) {
        res.status(200);
        res.json({
          message: "Admin successfully validated",
          token: user.generateJwt()
        });
        return;
      }
      else {
        res.status(401);
        res.json({
          message: "Admin validation failed"
        });
        return;
      }
    }
    catch (err) {
      console.logDev(err);
      res.status(500);
      res.json({
        message: "Unknown error"
      });
      return;
    }
  }

  public async resendVerification(req, res) {
    try {
      if(!reqRequire(req, res,
        ['jwt', 401, "Missing auth token",
          ['email', 400, "Malformed auth token"],
          ['validated', 400, "Malformed auth token"]]
      )) { return; }
      if (req.jwt.validated === true) {
        res.status(400);
        res.json({
          message: "Already Validated"
        });
        return;
      }
      await this.authService.resendValidationEmail(req.jwt.email);
      res.status(200);
      res.json({
        message: "Validation email sent"
      });
      return;
    }
    catch (err) { exceptionResult(err, res); }
  }
}
