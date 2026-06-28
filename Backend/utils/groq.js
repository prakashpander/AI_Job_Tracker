import dotenv from "dotenv"
dotenv.config();
import Groq from "groq-sdk";
import applicationModel from "../models/application.model.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";

const groq = new Groq();

export const chatWithAI = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: "Please ask something!" });
  }

  const userApplications = await applicationModel.find({ user: req.user._id });

  const applicationsContext = userApplications.length > 0
    ? userApplications.map(app =>
      `- ${app.companyName} (${app.jobRole || "Software Engineer"}), Status: ${app.appliedStatus}`
    ).join("\n")
    : "No applications tracked yet.";

  const userName = req.user?.username || "User";
  const userSkills = Array.isArray(req.user?.skills)
    ? req.user.skills.join(", ")
    : (req.user?.skills || "Not provided");
  const userExp = req.user?.experience || "Fresher";

  const systemPrompt = `
You are an intelligent AI assistant inside a Job Application Tracker app. 
You are a personal career coach — helpful, warm, and proactive.

## CURRENT USER PROFILE:
- Name: ${userName}
- Experience: ${userExp}
- Skills: ${userSkills}

## USER'S JOB APPLICATIONS:
${applicationsContext}

## STRICT RULES:
- NEVER show placeholder text like [user name] or [job role] — real data upar diya hai
- Greet user by their actual name: "${userName}"
- Respond in the SAME language the user writes in (Hindi/English/Hinglish)
- If applications list has data, reference it when relevant
- If experience is "Fresher", give fresher-friendly advice — never make them feel inadequate
- Keep responses concise (under 150 words unless deep explanation needed)
- Be like a senior friend — warm, honest, practical

## CAPABILITIES:
1. Application Tracking — add, update, view applications
2. Interview Prep — role-specific tips, mock questions
3. Resume & Cover Letter — review and improve
4. Follow-up Emails — draft professional HRs emails
5. Salary Negotiation — based on role and experience
6. Job Search Strategy — platforms, networking tips
7. Motivation & Support — when user feels down

## EDGE CASES:
- Frustrated user → acknowledge feelings first, then help
- Off-topic question → gently redirect to job search
- Fresher → focus on projects, internships, skills
`;

  const completion = await groq.chat.completions.create({
    model: "gpt-oss-20b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    temperature: 0.7,
    max_tokens: 1024
  });

  res.status(200).json({
    success: true,
    reply: completion.choices[0]?.message?.content,
  });
});