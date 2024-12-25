import sgMail from "@sendgrid/mail";
import { prisma } from '../../config/config.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function replyFeedback(email, content) {
    const msg = {
        to: email,
        from: {
            email: "phamhoangkha14032004@gmail.com",
            name: "GStore",
        },
        subject: "Feedback from G-Store",
        
        html: `<p>Hello, thank you for reaching out to G-Store. </p>
           <p>${content}</p>
           <p>Best regards,<br/>The GStore Team</p>`,
    };

    try {
        await sgMail.send(msg);
        console.log("Feedback email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}
async function fetchFeedback() {
    const feedback = await prisma.feedback.findMany({
        select: {
            account_id: true,
            content: true,
            type_id: true,
        },
        include: {
            account: {
                select: {
                    email: true,
                    username: true,
                },
            },
        },
        
    });
    const feedbacks = feedback.map((item) => {
        return {
            email: item.account.email,
            username: item.account.username,
            content: item.content,
            type_id: item.type_id,
        };
    });
}

export { replyFeedback,fetchFeedback };
