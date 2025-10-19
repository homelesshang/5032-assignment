const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendEmailWithAttachment = functions.https.onCall(async (data, context) => {
  const { to, subject, message } = data;

  // ✅ 示例附件（比如课程表）
  const classSchedule = `
  Class Name,Trainer,Time,Level
  Yoga Basics,Alice,9:00 AM,Beginner
  HIIT Challenge,Cara,11:00 AM,Advanced
  Strength Training,Eva,3:00 PM,Intermediate
  Zumba Energy,Kate,6:00 PM,All Levels
  `;
  const base64File = Buffer.from(classSchedule).toString("base64");

  // ✅ 健身房欢迎邮件模板
  const msg = {
    to, // 收件人邮箱
    from: "monashapple@outlook.com", // 必须是你在 SendGrid 验证的邮箱
    subject: subject || "💪 Welcome to Community Gym — Your Fitness Journey Starts Now!",
    text:
      message ||
      `
Hi there,

Welcome to Community Gym — your new home for health, energy, and motivation!

At Community Gym, we believe fitness should be fun, inspiring, and accessible to everyone.
Join us for Yoga, HIIT, Strength Training, Zumba, and more — led by professional trainers in a friendly environment.

Attached is your Welcome Package with:
- Our current class schedule
- Gym facilities overview
- New member benefits

We can’t wait to see you at the gym! 💪

Stay strong,
The Community Gym Team
Melbourne | communitygym.com
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2 style="color:#007bff;">Welcome to <b>Community Gym</b> 💪</h2>
        <p>Hi there,</p>

        <p>Welcome to <b>Community Gym</b> — your new home for health, energy, and motivation!</p>

        <p>We’re thrilled to have you join our fitness family. Here’s what you can look forward to:</p>

        <ul>
          <li>🏋️ Modern equipment and clean facilities</li>
          <li>🧘 Yoga, HIIT, and Strength Training classes</li>
          <li>🧑‍🏫 Professional trainers to guide your every move</li>
          <li>🎁 Special offers for new members</li>
        </ul>

        <p>Please find your attached <b>Class Schedule</b> to plan your workouts.</p>

        <p>Let’s get stronger together 💪</p>
        <p>— <b>The Community Gym Team</b></p>
        <p style="font-size: 0.9em; color: #666;">📍 Melbourne | 🌐 communitygym.com</p>
      </div>
    `,
    attachments: [
      {
        content: base64File,
        filename: "CommunityGym_ClassSchedule.csv",
        type: "text/csv",
        disposition: "attachment",
      },
    ],
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent successfully to:", to);
    return { success: true, to };
  } catch (error) {
    console.error("❌ SendGrid Error:", error.response?.body || error.message);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "Failed to send email"
    );
  }
});
