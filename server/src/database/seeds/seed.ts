import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "../../config/database";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from "../../config/env";
import { UserModel } from "../../modules/users/user.model";
import { JobModel } from "../../modules/jobs/job.model";
import { ApplicationModel } from "../../modules/applications/application.model";
import { BookmarkModel } from "../../modules/bookmarks/bookmark.model";
import { ActivityLogModel } from "../../modules/dashboards/activityLog.model";
import {
  UserRole,
  UserStatus,
  JobType,
  JobStatus,
  ApplicationStatus,
  ActivityType,
} from "../../shared/types/enums";

const SALT_ROUNDS = 10;

async function hash(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function seed() {
  await connectDatabase();
  console.log("[seed] seeding database...");

  const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    await UserModel.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash: await hash(ADMIN_PASSWORD!),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
    console.log(`[seed] created admin ${ADMIN_EMAIL}`);
  }

  const recruiterSeeds = [
    { name: "Priya Sharma", email: "recruiter1@example.com" },
    { name: "David Chen", email: "recruiter2@example.com" },
  ];
  const recruiters = [];
  for (const r of recruiterSeeds) {
    let recruiter = await UserModel.findOne({ email: r.email });
    if (!recruiter) {
      recruiter = await UserModel.create({
        name: r.name,
        email: r.email,
        passwordHash: await hash("Recruiter@123"),
        role: UserRole.RECRUITER,
        status: UserStatus.ACTIVE,
      });
    }
    recruiters.push(recruiter);
  }

  const candidateSeeds = [
    {
      name: "Aarav Patel",
      email: "candidate1@example.com",
      skills: ["React", "Node.js", "TypeScript"],
      exp: 3,
    },
    {
      name: "Emma Wilson",
      email: "candidate2@example.com",
      skills: ["Python", "Django", "PostgreSQL"],
      exp: 5,
    },
    {
      name: "Liam Brown",
      email: "candidate3@example.com",
      skills: ["Java", "Spring Boot"],
      exp: 2,
    },
    {
      name: "Sofia Garcia",
      email: "candidate4@example.com",
      skills: ["React", "CSS", "Figma"],
      exp: 1,
    },
    {
      name: "Noah Kim",
      email: "candidate5@example.com",
      skills: ["Node.js", "MongoDB", "AWS"],
      exp: 4,
    },
  ];
  const candidates = [];
  for (const c of candidateSeeds) {
    let candidate = await UserModel.findOne({ email: c.email });
    if (!candidate) {
      candidate = await UserModel.create({
        name: c.name,
        email: c.email,
        passwordHash: await hash("Candidate@123"),
        role: UserRole.CANDIDATE,
        status: UserStatus.ACTIVE,
        skills: c.skills,
        yearsOfExperience: c.exp,
      });
    }
    candidates.push(candidate);
  }

  const jobCount = await JobModel.countDocuments();
  let jobs = await JobModel.find();
  if (jobCount === 0) {
    const jobSeeds = [
      {
        title: "Frontend Developer (React)",
        skills: ["React", "TypeScript", "CSS"],
        min: 60000,
        max: 90000,
        type: JobType.FULL_TIME,
        location: "Remote",
      },
      {
        title: "Backend Engineer (Node.js)",
        skills: ["Node.js", "MongoDB", "Express"],
        min: 70000,
        max: 100000,
        type: JobType.FULL_TIME,
        location: "Bengaluru, India",
      },
      {
        title: "Full Stack Developer",
        skills: ["React", "Node.js", "TypeScript"],
        min: 65000,
        max: 95000,
        type: JobType.FULL_TIME,
        location: "Remote",
      },
      {
        title: "Junior Python Developer",
        skills: ["Python", "Django"],
        min: 40000,
        max: 55000,
        type: JobType.INTERNSHIP,
        location: "Austin, TX",
      },
      {
        title: "DevOps Engineer",
        skills: ["AWS", "Docker", "Kubernetes"],
        min: 90000,
        max: 130000,
        type: JobType.FULL_TIME,
        location: "Remote",
      },
      {
        title: "UI/UX Designer",
        skills: ["Figma", "CSS"],
        min: 50000,
        max: 75000,
        type: JobType.PART_TIME,
        location: "New York, NY",
      },
      {
        title: "Java Backend Developer",
        skills: ["Java", "Spring Boot"],
        min: 75000,
        max: 110000,
        type: JobType.FULL_TIME,
        location: "Chicago, IL",
      },
      {
        title: "Contract QA Engineer",
        skills: ["Testing", "Playwright"],
        min: 45000,
        max: 65000,
        type: JobType.CONTRACT,
        location: "Remote",
      },
      {
        title: "Data Analyst",
        skills: ["Python", "SQL"],
        min: 55000,
        max: 80000,
        type: JobType.FULL_TIME,
        location: "Seattle, WA",
      },
    ];

    jobs = [];
    for (let i = 0; i < jobSeeds.length; i++) {
      const s = jobSeeds[i];
      const recruiter = recruiters[i % recruiters.length];
      const job = await JobModel.create({
        recruiterId: recruiter._id,
        title: s.title,
        description: `We are looking for a ${s.title} to join our growing team. You'll work closely with product and engineering to ship features end to end.`,
        requiredSkills: s.skills,
        salaryMin: s.min,
        salaryMax: s.max,
        currency: "USD",
        jobType: s.type,
        location: s.location,
        applicationDeadline: daysFromNow(i % 3 === 0 ? -5 : 30), // a couple of expired jobs for realism
        status: i === jobSeeds.length - 1 ? JobStatus.CLOSED : JobStatus.OPEN,
      });
      jobs.push(job);

      await ActivityLogModel.create({
        userId: recruiter._id,
        type: ActivityType.JOB_CREATED,
        message: `Job posted: ${job.title}`,
        entityType: "JOB",
        entityId: job._id,
      });
    }
  }

  const applicationCount = await ApplicationModel.countDocuments();
  if (applicationCount === 0) {
    const openJobs = jobs.filter((j) => j.status === JobStatus.OPEN);
    const statuses = [
      ApplicationStatus.APPLIED,
      ApplicationStatus.SHORTLISTED,
      ApplicationStatus.INTERVIEWED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.HIRED,
    ];

    let statusIndex = 0;
    for (const candidate of candidates) {
      const jobsToApplyTo = openJobs.slice(0, 3);
      for (const job of jobsToApplyTo) {
        const status = statuses[statusIndex % statuses.length];
        statusIndex++;
        const application = await ApplicationModel.create({
          jobId: job._id,
          candidateId: candidate._id,
          recruiterId: job.recruiterId,
          coverLetter: `I'm excited to apply for the ${job.title} role and believe my background is a strong match.`,
          resumeUrl: "asdasd",
          status,
        });

        await ActivityLogModel.create({
          userId: job.recruiterId,
          type: ActivityType.APPLICATION_RECEIVED,
          message: `${candidate.name} applied for ${job.title}`,
          entityType: "APPLICATION",
          entityId: application._id,
        });
      }

      const bookmarkTarget = openJobs[(statusIndex + 1) % openJobs.length];
      if (bookmarkTarget) {
        await BookmarkModel.findOneAndUpdate(
          { candidateId: candidate._id, jobId: bookmarkTarget._id },
          { candidateId: candidate._id, jobId: bookmarkTarget._id },
          { upsert: true },
        );
      }
    }
  }

  console.log("[seed] done");
  console.log("[seed] demo credentials:");
  console.log(`  admin:      ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log("  recruiter:  recruiter1@example.com / Recruiter@123");
  console.log("  candidate:  candidate1@example.com / Candidate@123");

  await disconnectDatabase();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] failed", err);
  process.exit(1);
});
