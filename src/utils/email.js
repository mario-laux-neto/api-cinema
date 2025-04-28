import nodemailer from 'nodemailer';



async function sendMail(to, name, body, subject) {
    const smtp = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: 'marioneto@unochapeco.edu.br', 
            pass: 'aocu gius dahp ztgu',
        }
    });
    await smtp.sendMail({
        from: `"${name}" <marioneto@unochapeco.edu.br>`,
        to,
        subject,
        html: body
    });
}

export default sendMail;