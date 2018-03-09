import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany,
  Repository, getRepository
} from "typeorm";
import { ProgramRequest } from "./ProgramRequest";

/** Represents a soft skill that a client can request. */
@Entity('soft_skills')
export class SoftSkill {
  /** Autogenerated id as an integer. */
  @PrimaryGeneratedColumn()
  id: number;

  /** Name of the soft skill. */
  @Column()
  name: string;

  /** All requests requesting this soft skill. */
  @ManyToMany(type => ProgramRequest, programRequests => programRequests.softSkills)
  programRequests: ProgramRequest[];
}

export class SoftSkillService {
  public softSkillRepo: Repository<SoftSkill>;

  constructor(softSkillRepo: Repository<SoftSkill> = null) {
    this.softSkillRepo = softSkillRepo || getRepository(SoftSkill);
  }

  /** Saves all soft skills in the SoftSkillNames enum to the database. */
  public async syncSoftSkillsToDbAsync() {
    let skillList = Object.values(SoftSkillType);
    await Promise.all(skillList.map(async (skillName) => {
      let skillFinder = await this.softSkillRepo.findOne({name: skillName});
      if (!skillFinder) {
        let newSoftSkill = new SoftSkill();
        newSoftSkill.name = skillName;
        await this.softSkillRepo.save(newSoftSkill);
      }
      return;
    }));
  }

  /** Retrieves a soft skill from the database by its SoftSkillType */
  public async findByNameAsync(skillName: SoftSkillType): Promise<SoftSkill> {
    return this.softSkillRepo.findOne({name: skillName});
  }
}

/** Enumerated list of all soft skill names. */
export enum SoftSkillType {
  StrongWorkEthic = "Strong Work Ethic",
  PositiveAttitude = "Positive Attitude",
  GoodCommunicationSkills = "Good Communication Skills",
  TimeManagementAbilities = "Time Management Abilities",
  ProblemSolvingSkills = "Problem-Solving Skills",
  ActingAsATeamPlayer = "Acting as a Team Player",
  SelfConfidence = "Self-Confidence",
  AbilityToAcceptCriticism = "Ability to Accept and Learn From Criticism",
  FlexibilityAdaptability = "Flexibility/Adaptability",
  WorkingWellUnderPressure = "Working Well Under Pressure",
}
