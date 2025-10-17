import * as functions from "firebase-functions";
import sgMail from "@sendgrid/mail";


sgMail.setApiKey(functions.config().sendgrid.key);


export const sendEmailWithAttachment = functions.https.onCall(async (data, context) => {
  const { to, subject, message } = data;


  const csvContent = "Full Name,Role\nNew User,Client\n";
  const base64File = Buffer.from(csvContent).toString("base64");

  const msg = {
    to,
    from: "noreply@communitygym.com", 
    subject,
    text: message,
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
    console.log("✅ Email sent to:", to);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("❌ SendGrid Error:", error);
    throw new functions.https.HttpsError("internal", "Failed to send email");
  }
});