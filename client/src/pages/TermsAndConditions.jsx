export default function TermsAndConditions() {
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
            Terms and Conditions
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-subtle)' }}>
            Effective date: June 2025 &nbsp;·&nbsp; Bridgemakers &mdash; The Bridge
          </p>
        </div>

        {section('1. Acceptance of terms', <>
          {p('By creating an account or using The Bridge, you agree to these Terms and Conditions. If you do not agree, please do not use the platform.')}
          {p('These terms apply to all users of The Bridge, operated by Bridgemakers (bridgemakersmn.org).')}
        </>)}

        {section('2. Eligibility', <>
          {p('You must be at least 13 years old to use The Bridge. By registering, you confirm that the information you provide is accurate and that you have the legal capacity to agree to these terms.')}
        </>)}

        {section('3. Your account', <>
          {p('You are responsible for maintaining the confidentiality of your account credentials. You agree to:')}
          <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
            {li('Keep your password secure and not share it with others')}
            {li('Provide accurate and up-to-date information in your profile')}
            {li('Notify us at admin@bridgemakersmn.org if you suspect unauthorized access to your account')}
          </ul>
          {p('We reserve the right to suspend or terminate accounts that violate these terms.')}
        </>)}

        {section('4. Acceptable use', <>
          {p('You agree to use The Bridge in good faith and in a manner consistent with the spirit of the community. You must not:')}
          <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
            {li('Post false, misleading, or fraudulent information')}
            {li('Harass, threaten, or harm other members')}
            {li('Use the platform for spam, unsolicited promotions, or commercial solicitation')}
            {li('Attempt to gain unauthorized access to other accounts or platform systems')}
            {li('Upload or share content that is illegal, offensive, or infringes on the rights of others')}
          </ul>
          {p('We reserve the right to remove content or accounts that violate these guidelines.')}
        </>)}

        {section('5. User content', <>
          {p('Any information, bio, or content you add to your profile remains yours. By submitting content to The Bridge, you grant Bridgemakers a limited, non-exclusive license to display that content to other members as part of normal platform operation.')}
          {p('You are solely responsible for the accuracy and appropriateness of what you post.')}
        </>)}

        {section('6. Community standards', <>
          {p('The Bridge is built on mutual respect. We expect all members to treat each other professionally and courteously. Discriminatory, hateful, or abusive behavior of any kind is not tolerated and may result in immediate removal from the platform.')}
        </>)}

        {section('7. Intellectual property', <>
          {p('The Bridge platform, including its design, code, and branding, is owned by Bridgemakers. You may not reproduce or redistribute any part of the platform without prior written permission.')}
        </>)}

        {section('8. Disclaimer of warranties', <>
          {p('The Bridge is provided "as is" without any warranties, express or implied. We do not guarantee that the platform will be available at all times, error-free, or free of security vulnerabilities. Use the platform at your own risk.')}
        </>)}

        {section('9. Limitation of liability', <>
          {p('To the fullest extent permitted by law, Bridgemakers shall not be liable for any indirect, incidental, or consequential damages arising from your use of The Bridge, including but not limited to loss of data, reputation, or business opportunities.')}
        </>)}

        {section('10. Termination', <>
          {p('You may stop using The Bridge at any time. You may request deletion of your account by contacting admin@bridgemakersmn.org. We may also suspend or terminate your access if you breach these terms.')}
        </>)}

        {section('11. Changes to these terms', <>
          {p('We may update these Terms and Conditions from time to time. The effective date at the top of this page will reflect the most recent version. Continued use of The Bridge after changes are posted constitutes your acceptance of the updated terms.')}
        </>)}

        {section('12. Governing law', <>
          {p('These terms are governed by the laws of the State of Minnesota, United States, without regard to conflict of law principles.')}
        </>)}

        {section('13. Contact us', <>
          {p('If you have any questions about these Terms and Conditions, please contact us at:')}
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
