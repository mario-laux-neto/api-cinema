// Importa o módulo nodemailer para envio de e-mails
import nodemailer from 'nodemailer';

// Função assíncrona para enviar e-mails
async function sendMail(to, name, body, subject) {

    // Configura o transporte SMTP para o envio de e-mails usando o servidor Gmail
    const smtp = nodemailer.createTransport({
        host: 'smtp.gmail.com',  // Servidor SMTP do Gmail
        port: 587,  // Porta do servidor SMTP
        secure: false,  // Define se a conexão deve ser segura (não é necessário para a porta 587)
        auth: {
            user: 'marioneto@unochapeco.edu.br',  // E-mail do remetente
            pass: 'aocu gius dahp ztgu',  // Senha do e-mail (DEVE SER ALTERADA PARA EVITAR VAZAMENTO)
        }
    });

    // Envia o e-mail utilizando o transporte SMTP configurado
    await smtp.sendMail({
        from: `"${name}" <marioneto@unochapeco.edu.br>`,  // Remetente, incluindo o nome
        to,  // Destinatário
        subject,  // Assunto do e-mail
        html: body  // Corpo do e-mail em formato HTML
    });
}

// Exporta a função para ser usada em outros módulos
export default sendMail;
