const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function sendEmail({ to, subject, html }) {
  const { error } = await resend.emails.send({
    from: 'The Bridge <noreply@bridgemakersmn.org>',
    to,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
};
