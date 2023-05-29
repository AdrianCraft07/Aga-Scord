import nodemailer from 'nodemailer';

const CONFIG = (process as any).proyectConfig as Record<string, any>

let transporter = nodemailer.createTransport({
    host: CONFIG.MAILER_HOST,
    port: CONFIG.MAILER_PORT,
    secure: CONFIG.MAILER_SECURE,
    auth: {
        user: CONFIG.MAILER_USER,
        pass: CONFIG.MAILER_PASS
    }
});

transporter.verify().then(() => {
    console.log('Ready for send emails')
})

export = function mailer({email, text, title}:Record<string, string>){
    transporter.sendMail({
        from: `AgaScord <${CONFIG.MAILER_USER}>`,
        to: email,
        subject: title,
        text
    })
}