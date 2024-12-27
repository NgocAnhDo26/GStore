import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendResetEmail(email, newPassword) {
  const msg = {
    to: email,
    from: {
      email: "phamhoangkha14032004@gmail.com",
      name: "GStore",
    },
    subject: "Your new password in GStore",
    text: `Your new password is: ${newPassword}`,
    html: `<p>Your new password is: <strong>${newPassword}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Reset email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export { sendResetEmail };
