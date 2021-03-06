import { getRepository } from 'typeorm';
import { Program } from './../models/Program';
import { ProgramRequest } from './../models/ProgramRequest';
import { Response } from './../models/Response';
import { Role, RoleType } from './../models/Role';
import { SoftSkill, SoftSkillType } from './../models/SoftSkill';
import { User } from './../models/User';
import { ValidationToken } from './../models/ValidationToken';
import { Video } from './../models/Video';
import { AuthService } from './../services/auth.service';
import { UserRegistrationOptions } from './../services/auth.service.models';
import { UserService } from './../services/user.service';
import { VideoService } from './../services/video.service';
import { ProgramRequestService } from './../services/program-request.service';
import { ProgramService } from './../services/program.service';
import { ResponseService } from './../services/response.service';
import { RoleService } from './../services/role.service';
import { SoftSkillService } from './../services/soft-skill.service';

// =========== Users =========== //
const TestClients: UserRegistrationOptions[] = [
  {
    username: "TestClient",
    email: "test1@test.com",
    password: "password1",
    roleType: RoleType.Client,
    preValidated: true
  },
  {
    username: "TestClient2",
    email: "test2@test.com",
    password: "asdfghjklsemicolon1",
    roleType: RoleType.Client,
    preValidated: true
  },
  {
    username: "TestClient3",
    email: "test3@test.com",
    password: "1drowssap",
    roleType: RoleType.Client,
    preValidated: true
  },
  {
    username: "EyeCue_Lab",
    email: "eyecue@eyecue.com",
    password: "3y3cu3",
    roleType: RoleType.Client,
    preValidated: true
  }
];

const TestSubjects: UserRegistrationOptions[] = [
  {
    username: "TestSubjectA",
    email: "testA@test.com",
    password: "letmein1",
    roleType: RoleType.Subject,
    preValidated: true
  },
  {
    username: "TestSubjectB",
    email: "testB@test.com",
    password: "l33th4x",
    roleType: RoleType.Subject,
    preValidated: true
  },
  {
    username: "TestSubjectC",
    email: "testC@test.com",
    password: "goodPass123",
    roleType: RoleType.Subject,
    preValidated: true
  },
  {
    username: "TestSubjectD",
    email: "testD@test.com",
    password: "1passw0rd",
    roleType: RoleType.Subject,
    preValidated: true
  },
  {
    username: "TestSubjectE",
    email: "testE@test.com",
    password: "qwerty76",
    roleType: RoleType.Subject,
    preValidated: true
  },
  {
    username: "Rane",
    email: "rane@rane.com",
    password: "ran3fi3lds",
    roleType: RoleType.Subject,
    preValidated: true
  }
];

// =========== Videos =========== //
const TestVideos = [
  {
    title: "Yeeee",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/yeee.mp4",
    description: "Yeeeeee",
    softSkills: [SoftSkillType.StrongWorkEthic, SoftSkillType.PositiveAttitude, SoftSkillType.TimeManagementAbilities]
  },
  {
    title: "Something",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/testvideo2.mp4",
    description: "A man with a mission",
    softSkills: [SoftSkillType.ActingAsATeamPlayer, SoftSkillType.TimeManagementAbilities]
  },
  {
    title: "Anime",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/anime.mp4",
    description: "anime is real",
    softSkills: [SoftSkillType.AbilityToAcceptCriticism]
  },
  {
    title: "Congrats",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/congrats.mp4",
    description: "you did it",
    softSkills: [SoftSkillType.WorkingWellUnderPressure, SoftSkillType.FlexibilityAdaptability]
  },
  {
    title: "Friends",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/friends.mp4",
    description: "blank description",
    softSkills: []
  },
  {
    title: "Hello",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/hello.mp4",
    description: "is it me you're looking for?",
    softSkills: [SoftSkillType.FlexibilityAdaptability, SoftSkillType.TimeManagementAbilities, SoftSkillType.GoodCommunicationSkills, SoftSkillType.StrongWorkEthic, SoftSkillType.SelfConfidence]
  },
  {
    title: "Nuts",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/nuts.mp4",
    description: "",
    softSkills: [SoftSkillType.SelfConfidence]
  },
  {
    title: "Stats",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/stats.mp4",
    description: null,
    softSkills: [SoftSkillType.StrongWorkEthic, SoftSkillType.TimeManagementAbilities]
  },
  {
    title: "Intro",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/intro_3.mp4",
    description: "Intro for EyeCue Lab Assessment",
    softSkills: [SoftSkillType.StrongWorkEthic, SoftSkillType.TimeManagementAbilities]
  },
  {
    title: "Question 1",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/question_1_3.mp4",
    description: "First Question for EyeCue Lab Assessment",
    softSkills: [SoftSkillType.SelfConfidence]
  },
  {
    title: "Question 2",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/question_2_3.mp4",
    description: "Second Question for EyeCue Lab Assessment",
    softSkills: [SoftSkillType.FlexibilityAdaptability, SoftSkillType.TimeManagementAbilities, SoftSkillType.GoodCommunicationSkills, SoftSkillType.StrongWorkEthic, SoftSkillType.SelfConfidence]
  },
  {
    title: "Question 3",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/question_3_3.mp4",
    description: "Third Question for EyeCue Lab Assessment",
    softSkills: [SoftSkillType.FlexibilityAdaptability, SoftSkillType.GoodCommunicationSkills, SoftSkillType.StrongWorkEthic]
  },
  {
    title: "Question 4",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/question_4_3.mp4",
    description: "Fourth Question for EyeCue Lab Assessment",
    softSkills: [SoftSkillType.TimeManagementAbilities, SoftSkillType.SelfConfidence]
  },
  {
    title: "Question 5",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/question_5_3.mp4",
    description: "Fifth Question for EyeCue Lab Assessment",
    softSkills: [SoftSkillType.GoodCommunicationSkills, SoftSkillType.StrongWorkEthic, SoftSkillType.SelfConfidence]
  },
  {
    title: "Conclusion",
    url: "https://s3.amazonaws.com/epicodus-internship/Test-Folder/conclusion_3.mp4",
    description: "Conclusion for EyeCue Lab Assessment",
    softSkills: [SoftSkillType.GoodCommunicationSkills, SoftSkillType.StrongWorkEthic, SoftSkillType.SelfConfidence]
  },
];

// =========== Programs =========== //
const TestPrograms = [
  {
    jobTitle: "Doot dooter",
    description: "Test Program 1",
    expiration: 0,
    videoIndices: [0, 1, 2, 3],
    clientIndex: 0
  },
  {
    jobTitle: "Spoon collector",
    description: "Test Program 2",
    expiration: 0,
    videoIndices: [4, 5, 6, 7],
    clientIndex: 1
  },
  {
    jobTitle: "Astronaut",
    description: "Test Program 3",
    expiration: 0,
    videoIndices: [1, 7, 4],
    clientIndex: 1
  },
  {
    jobTitle: "Cat",
    description: "Test Program 4",
    expiration: 0,
    videoIndices: [5],
    clientIndex: 2
  },
];

// =========== Responses =========== //
const TestReponses = [
//   {
//     audio_gs_path: "",
//     subjectIndex: 0,
//     videoIndex: 0,
//     programIndex: 0
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 0,
//     videoIndex: 1,
//     programIndex: 0
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 0,
//     videoIndex: 2,
//     programIndex: 0
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 0,
//     videoIndex: 3,
//     programIndex: 0
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 1,
//     videoIndex: 4,
//     programIndex: 1
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 1,
//     videoIndex: 5,
//     programIndex: 1
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 1,
//     videoIndex: 6,
//     programIndex: 1
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 1,
//     videoIndex: 7,
//     programIndex: 1
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 2,
//     videoIndex: 1,
//     programIndex: 2
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 2,
//     videoIndex: 4,
//     programIndex: 2
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 2,
//     videoIndex: 7,
//     programIndex: 2
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 3,
//     videoIndex: 4,
//     programIndex: 1
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 3,
//     videoIndex: 5,
//     programIndex: 1
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 3,
//     videoIndex: 6,
//     programIndex: 1
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 3,
//     videoIndex: 7,
//     programIndex: 1
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 4,
//     videoIndex: 1,
//     programIndex: 2
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 4,
//     videoIndex: 4,
//     programIndex: 2
//   },
//   {
//     audio_gs_path: "",
//     subjectIndex: 4,
//     videoIndex: 7,
//     programIndex: 2
//   },
];

// =========== ProgramRequests =========== //
const TestProgramRequests = [
  {
    jobTitle: "Pizza maker",
    clientIndex: 0,
    expiration: 0,
    text: "Make me a pizza!",
    softSkills: [SoftSkillType.StrongWorkEthic, SoftSkillType.PositiveAttitude, SoftSkillType.GoodCommunicationSkills]
  },
  {
    jobTitle: "Angery tree stump",
    clientIndex: 0,
    expiration: 0,
    text: "Zoombinis!",
    softSkills: [SoftSkillType.TimeManagementAbilities, SoftSkillType.ProblemSolvingSkills]
  },
  {
    jobTitle: "Paladin LV99",
    clientIndex: 1,
    expiration: 0,
    text: "Find good employee pl0x",
    softSkills: [SoftSkillType.StrongWorkEthic, SoftSkillType.PositiveAttitude, SoftSkillType.GoodCommunicationSkills, SoftSkillType.TimeManagementAbilities, SoftSkillType.ProblemSolvingSkills]
  },
  {
    jobTitle: "EyeCue Intern",
    clientIndex: 3,
    expiration: 0,
    text: "We're looking for a person who takes challenges head on, is willing to work hard, and works well with a small team.",
    softSkills: [SoftSkillType.StrongWorkEthic, SoftSkillType.ActingAsATeamPlayer, SoftSkillType.WorkingWellUnderPressure, SoftSkillType.FlexibilityAdaptability, SoftSkillType.ProblemSolvingSkills]
  },
]

// =========== Data Loading Logic =========== //
export class TestData {
  static admin: User = null;
  static clients: User[] = [];
  static subjects: User[] = [];
  static videos: Video[] = [];
  static programs: Program[] = [];
  static responses: Response[] = [];
  static requests: ProgramRequest[] = [];

  public static async loadAllTestDataAsync() {
    let authService = new AuthService();
    let userService = new UserService();
    let videoService = new VideoService();
    let requestService = new ProgramRequestService();
    let programService = new ProgramService();
    let responseService = new ResponseService();
    let roleService = new RoleService();
    let softSkillService = new SoftSkillService();

    console.log("Generating roles...");
    await roleService.syncRolesToDbAsync();

    console.log("Generating admin...");
    const result = await authService.generateDefaultAdminAsync();
    this.admin = result.registeredUser;

    console.log("Generating users...");
    await authService.generateDefaultAdminIfNoAdminAsync();
    await Promise.all(TestClients.map(async (user) => {
      const result = await authService.registerAsync(user);
      this.clients.push(result.registeredUser);
      return;
    }));
    await Promise.all(TestSubjects.map(async (user) => {
      const result = await authService.registerAsync(user);
      this.subjects.push(result.registeredUser);
      return;
    }));

    console.log("Generating soft skills...");
    await softSkillService.syncSoftSkillsToDbAsync();

    console.log("Generating videos...");
    await Promise.all(TestVideos.map(async (video) => {
      let id = await videoService.createEmptyVideo();
      this.videos.push(await videoService.uploadAsync({
        id: id,
        title: video.title,
        url: video.url,
        description: video.description,
        softSkills: video.softSkills
      }));
      return;
    }));

    console.log("Generating programs...");
    await Promise.all(TestPrograms.map(async (program) => {
      let newProgram = await programService.saveNewAsync({
        jobTitle: program.jobTitle,
        description: program.description,
        expiration: program.expiration,
        videos: program.videoIndices.map(index => this.videos[index]),
        client: this.clients[program.clientIndex],
        author: this.admin
      });
      this.programs.push(newProgram);
      return;
    }));

    console.log("Generating responses...");
    await Promise.all(TestReponses.map(async (response) => {
      let newResponse = await responseService.saveNewAsync({
        audio_gs_path: response.audio_gs_path,
        subject: this.subjects[response.subjectIndex],
        video: this.videos[response.videoIndex],
        program: this.programs[response.programIndex]
      });
      this.responses.push(newResponse);
    }));

    console.log("Generating program requests...");
    await Promise.all(TestProgramRequests.map(async (request) => {
      let softSkills = await Promise.all(request.softSkills.map(async (softSkillName) => {
        return await softSkillService.findByNameAsync(softSkillName);
      }));
      let newRequest = await requestService.saveNewAsync({
        jobTitle: request.jobTitle,
        client: this.clients[request.clientIndex],
        expiration: 0,
        text: request.text,
        softSkills: softSkills
      });
      this.requests.push(newRequest);
    }));
  }
}
