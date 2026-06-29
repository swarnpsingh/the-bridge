export default function PrivacyPolicy() {
  const section = (title, children) => (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 10 }}>
        {title}
      </h2>
      {children}
    </div>
  );

  const p = (text) => (
    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 10 }}>
      {text}
    </p>
  );

  const li = (text) => (
    <li style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 6 }}>
      {text}
    </li>
  );

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 64px' }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: '40px 40px',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.5px', marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-subtle)' }}>
            Effective date: June 2025 &nbsp;·&nbsp; Bridgemakers &mdash; The Bridge
          </p>
        </div>

        {section('1. Who we are', <>
          {p('The Bridge is a community platform operated by Bridgemakers (bridgemakersmn.org). If you have any questions about this policy, you can reach us at admin@bridgemakersmn.org.')}
        </>)}

        {section('2. What information we collect', <>
          {p('When you create an account, we collect the following:')}
          <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
            {li('Name and email address')}
            {li('Password (stored securely as a hashed value — we never store it in plain text)')}
            {li('Profile information you choose to provide: role, company, location, LinkedIn URL, and a short bio')}
            {li('Member type tags (e.g. Founder, Developer, Student)')}
          </ul>
          {p('We do not collect payment information, sensitive personal data, or any information beyond what you voluntarily provide.')}
        </>)}

        {section('3. How we use your information', <>
          {p('We use the information you provide to:')}
          <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
            {li('Create and manage your account')}
            {li('Display your public profile in the member directory')}
            {li('Send you emails related to the platform — such as account notifications or community updates')}
            {li('Allow other members to discover and connect with you')}
          </ul>
          {p('We do not sell, rent, or share your personal information with third parties for marketing or any other commercial purposes.')}
        </>)}

        {section('4. Email communications', <>
          {p('Your email address may be used to send you platform-related communications, such as account confirmations or important community announcements. We will not send you unsolicited marketing emails from third parties.')}
        </>)}

        {section('5. Data visibility', <>
          {p('The information on your profile (name, role, company, location, bio, member type) is visible to other logged-in members of The Bridge. Your email address and password are never publicly displayed.')}
        </>)}

        {section('6. Data retention', <>
          {p('We retain your data for as long as your account is active. If you wish to delete your account and associated data, please contact us at admin@bridgemakersmn.org and we will handle your request promptly.')}
        </>)}

        {section('7. Security', <>
          {p('We take reasonable technical measures to protect your information, including hashing passwords and using secure connections. No method of transmission over the internet is 100% secure, but we work to protect your data to the best of our ability.')}
        </>)}

        {section('8. Changes to this policy', <>
          {p('We may update this Privacy Policy from time to time. If we make significant changes, we will update the effective date at the top of this page. Continued use of The Bridge after any changes constitutes your acceptance of the updated policy.')}
        </>)}

        {section('9. Contact us', <>
          {p('If you have any questions or concerns about this Privacy Policy, please contact us at:')}
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75 }}>
            <a href="mailto:admin@bridgemakersmn.org" style={{ color: 'var(--brand)', fontWeight: 500 }}>
              admin@bridgemakersmn.org
            </a>
          </p>
        </>)}
      </div>
    </div>
  );
}
