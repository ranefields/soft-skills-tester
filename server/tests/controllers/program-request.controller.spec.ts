import 'mocha';
import * as chai from 'chai';
import { expect } from 'chai';
import * as td from 'testdouble';
import { MockReq, MockRes } from './../../utility/mock-interfaces';
import { ProgramRequestController } from './../../controllers/program-request.controller';
import { ProgramRequestService } from './../../services/program-request.service';
import { SoftSkillService } from './../../services/soft-skill.service';
import { UserService } from './../../services/user.service';
import { ProgramRequest } from './../../models/ProgramRequest';
import { User } from './../../models/User';
import { SoftSkill } from './../../models/SoftSkill';

describe("ProgramRequestController", function() {
  let requestService: ProgramRequestService;
  let softSkillService: SoftSkillService;
  let userService: UserService;
  let requestController: ProgramRequestController;
  let req: MockReq;
  let res: MockRes;

  beforeEach(function() {
    requestService = td.object<ProgramRequestService>(new ProgramRequestService);
    softSkillService = td.object<SoftSkillService>(new SoftSkillService);
    userService = td.object<UserService>(new UserService);
    requestController = new ProgramRequestController({
      programRequestService: requestService,
      softSkillService: softSkillService,
      userService: userService
    });
    req = new MockReq();
    res = new MockRes();
  });

  afterEach(function() {
    td.reset();
    requestService = undefined;
    softSkillService = undefined;
    userService = undefined;
    requestController = undefined;
    req = undefined;
    res = undefined;
  });

  describe("constructor", function() {
    it("should return an auth controller", function() {
      expect(requestController).to.exist;
    });

    it("should have a softSkillService injected through the constructor", function() {
      expect(requestController).to.have.own.property('softSkillService').that.is.not.null;
      expect(requestController).to.have.own.property('softSkillService').that.is.equal(softSkillService);
    });

    it("should have a programRequestService injected through the constructor", function() {
      expect(requestController).to.have.own.property('programRequestService').that.is.not.null;
      expect(requestController).to.have.own.property('programRequestService').that.is.equal(requestService);
    });

    it("should have a userService injected through the constructor", function() {
      expect(requestController).to.have.own.property('userService').that.is.not.null;
      expect(requestController).to.have.own.property('userService').that.is.equal(userService);
    });
  });

  describe("makeProgramRequest method", function() {
    let resultRequest;
    let resultUser;

    beforeEach(function() {
      resultRequest = td.object<ProgramRequest>(new ProgramRequest);
      resultRequest.id = "abcde";
      resultUser = td.object<User>(new User);
      td.when(userService.findByIdAsync(td.matchers.anything()))
        .thenResolve(resultUser);
      td.when(requestService.saveNewAsync(td.matchers.anything()))
        .thenResolve(resultRequest);
    });

    afterEach(function() {
      resultRequest = undefined;
      resultUser = undefined;
    });

    it("should return status 401 if jwt is missing", async function() {
      req.jwt = undefined;
      req.body = {
        nameArray: ["testName", "testName2"]
      }
      await requestController.makeProgramRequest(req, res);
      expect(res.status()).to.equal(401);
      expect(res.json().message).to.exist;
    });

    it("should return status 400 if body is missing", async function() {
      req.jwt = {
        id: "abcde",
        role: "CLIENT"
      };
      req.body = undefined;
      await requestController.makeProgramRequest(req, res);
      expect(res.status()).to.equal(400);
      expect(res.json().message).to.exist;
    });

    it("should return status 400 if jwt is missing role", async function() {
      req.jwt = {
        id: "abcde",
        // role: "CLIENT"
      };
      req.body = {
        nameArray: ["testName", "testName2"]
      }
      await requestController.makeProgramRequest(req, res);
      expect(res.status()).to.equal(400);
      expect(res.json().message).to.exist;
    });

    it("should return status 400 if jwt is missing id", async function() {
      req.jwt = {
        id: "abcde",
        // role: "CLIENT"
      };
      req.body = {
        nameArray: ["testName", "testName2"]
      }
      await requestController.makeProgramRequest(req, res);
      expect(res.status()).to.equal(400);
      expect(res.json().message).to.exist;
    });

    it("should return status 400 if nameArray parameter is missing", async function() {
      req.jwt = {
        id: "abcde",
        role: "CLIENT"
      };
      req.body = {
        // nameArray: ["testName", "testName2"]
      }
      await requestController.makeProgramRequest(req, res);
      expect(res.status()).to.equal(400);
      expect(res.json().message).to.exist;
    });

    it("should return status 401 if jwt role is not 'CLIENT'", async function() {
      req.jwt = {
        id: "abcde",
        role: "ASDFGH"
      };
      req.body = {
        nameArray: ["testName", "testName2"]
      }
      await requestController.makeProgramRequest(req, res);
      expect(res.status()).to.equal(401);
      expect(res.json().message).to.exist;
    });

    it("should return status 200 if request is saved successfully", async function() {
      req.jwt = {
        id: "abcde",
        role: "CLIENT"
      };
      req.body = {
        nameArray: ["testName", "testName2"]
      }
      await requestController.makeProgramRequest(req, res);
      expect(res.status()).to.equal(200);
      expect(res.json().message).to.exist;
    });

    it("should return status 500 if request is not saved successfully", async function() {
      req.jwt = {
        id: "abcde",
        role: "CLIENT"
      };
      req.body = {
        nameArray: ["testName", "testName2"]
      }
      td.when(requestService.saveNewAsync(td.matchers.anything()))
        .thenResolve(null);
      await requestController.makeProgramRequest(req, res);
      expect(res.status()).to.equal(500);
      expect(res.json().message).to.exist;
    });

    it("should return status 500 if an exception is thrown", async function() {
      req.jwt = {
        id: "abcde",
        role: "CLIENT"
      };
      req.body = {
        nameArray: ["testName", "testName2"]
      }
      td.when(requestService.saveNewAsync(td.matchers.anything()))
        .thenReject(new Error("test error"));
      await requestController.makeProgramRequest(req, res);
      expect(res.status()).to.equal(500);
      expect(res.json().message).to.exist;
    });
  });

  describe("getAllSoftSkills method", function() {
    let resultSkills;

    beforeEach(function() {
      resultSkills = [td.object<SoftSkill>(new SoftSkill), td.object<SoftSkill>(new SoftSkill)];
      td.when(softSkillService.getAllSkills())
        .thenResolve(resultSkills);
    });

    it("should return status 200 on success", async function() {
      await requestController.getAllSoftSkills(req, res);
      expect(res.status()).to.equal(200);
      expect(res.json().message).to.exist;
    });

    it("should return 'skillArray' array of soft skills on success", async function() {
      await requestController.getAllSoftSkills(req, res);
      expect(res.json().skillArray).to.equal(resultSkills);
    });

    it("should return status 204 if no soft skills found", async function() {
      td.when(softSkillService.getAllSkills())
        .thenResolve([]);
      await requestController.getAllSoftSkills(req, res);
      expect(res.status()).to.equal(204);
      expect(res.json().message).to.exist;
    });

    it("should return status 500 if an exception was thrown", async function() {
      td.when(softSkillService.getAllSkills())
        .thenReject(new Error("test error"));
      await requestController.getAllSoftSkills(req, res);
      expect(res.status()).to.equal(500);
      expect(res.json().message).to.exist;
    });
  });
});