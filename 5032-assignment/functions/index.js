const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

// ✅ 读取 Firebase 上配置的 SendGrid key
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendEmailWithAttachment = functions.https.onCall(async (data, context) => {
  const { to, subject, message } = data;

  // 附件内容（示例）
  const csvContent = "Full Name,Role\nNew User,Client\n";
  const base64File = Buffer.from(csvContent).toString("base64");

  // ✅ 这里一定要改成你 **SendGrid 验证通过的邮箱**
  const msg = {
    to, // 注册者邮箱
    from: "monashapple@outlook.com", // ✅ 这必须和 SendGrid 验证一致
    subject: subject || "Welcome to Community Gym!",
    text: message || "Your registration was successful.",
    attachments: [
      {
        content: base64File,
        filename: "Welcome.csv",
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
