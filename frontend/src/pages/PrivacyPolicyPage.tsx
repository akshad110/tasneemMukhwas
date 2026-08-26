import PolicyPageLayout from '../components/legal/PolicyPageLayout'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_URL,
} from '../lib/contact'
import { BRAND_INK, BRAND_MUTED, BRAND_SANS } from '../lib/brand'

const EFFECTIVE = '24 August 2026'

function ContactBlock() {
  return (
    <div>
      <h2
        className="m-0 text-[1.02rem] font-bold sm:text-[1.08rem]"
        style={{ color: BRAND_INK, fontFamily: BRAND_SANS }}
      >
        10. Contact Us
      </h2>
      <p
        className="mt-3 m-0 text-[0.88rem] leading-[1.72] sm:text-[0.92rem]"
        style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
      >
        For any privacy-related questions or requests, please contact us:
      </p>
      <ul
        className="mt-3 m-0 list-none space-y-2 p-0 text-[0.88rem] leading-[1.65] sm:text-[0.92rem]"
        style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
      >
        <li>
          <strong style={{ color: BRAND_INK }}>Tasneem Mukhwas</strong>
        </li>
        <li>
          Website:{' '}
          <a href="https://tasneemmukhwas.com" className="text-[#0a2e22] underline">
            tasneemmukhwas.com
          </a>
        </li>
        <li>
          Email:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#0a2e22] underline">
            {CONTACT_EMAIL}
          </a>
        </li>
        <li>
          Phone/WhatsApp:{' '}
          <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-[#0a2e22] underline">
            {CONTACT_PHONE_DISPLAY}
          </a>{' '}
          ·{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#0a2e22] underline">
            WhatsApp
          </a>
        </li>
        <li>Address: {CONTACT_ADDRESS}</li>
      </ul>
    </div>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout
      title="Privacy Policy"
      effectiveDate={EFFECTIVE}
      intro={[
        'At Tasneem Mukhwas, we respect your privacy and are committed to protecting the personal information of our customers and website visitors. This Privacy Policy explains how we collect, use, store and protect your information when you visit or use our website.',
        'By using tasneemmukhwas.com, you agree to the practices described in this Privacy Policy.',
      ]}
      sections={[
        {
          heading: '1. Information We Collect',
          paragraphs: ['We may collect information such as:'],
          bullets: [
            'Name',
            'Phone number',
            'Email address',
            'Billing and delivery address',
            'Order and enquiry details',
            'Information you provide through our website',
          ],
        },
        {
          heading: '2. How We Use Your Information',
          paragraphs: ['Your information may be used to:'],
          bullets: [
            'Process and deliver orders',
            'Respond to enquiries',
            'Provide customer support',
            'Process payments',
            'Improve our products and website',
            'Send offers or updates where you have provided consent',
            'Prevent fraud or misuse',
          ],
        },
        {
          heading: '3. Payment Information',
          paragraphs: [
            'Online payments, where available, may be processed through secure third-party payment providers. Tasneem Mukhwas does not intend to store your complete card details, UPI PIN or banking passwords.',
          ],
        },
        {
          heading: '4. Cookies',
          paragraphs: [
            'Our website may use cookies to improve website functionality, understand website traffic and provide a better user experience.',
          ],
        },
        {
          heading: '5. Sharing of Information',
          paragraphs: [
            'We may share necessary information with trusted service providers such as payment gateways, delivery partners, website providers and other services required to operate our business.',
            'We do not sell or rent your personal information.',
          ],
        },
        {
          heading: '6. Data Security',
          paragraphs: [
            'We take reasonable measures to protect your personal information from unauthorized access, misuse or disclosure. However, no online system can be guaranteed to be completely secure.',
          ],
        },
        {
          heading: '7. Your Rights',
          paragraphs: [
            'Subject to applicable law, you may request access, correction or deletion of your personal information and may opt out of promotional communications.',
          ],
        },
        {
          heading: '8. Third-Party Links',
          paragraphs: [
            'Our website may contain links to third-party websites or services. Tasneem Mukhwas is not responsible for their privacy practices.',
          ],
        },
        {
          heading: '9. Updates to This Policy',
          paragraphs: [
            'We may update this Privacy Policy from time to time. Any changes will be published on this page with an updated effective date.',
          ],
        },
        {
          heading: "12. Children's Privacy",
          paragraphs: [
            'Our website is not intended to knowingly collect personal information from children without appropriate parental or guardian involvement.',
            'If you believe that a child has provided personal information to us without appropriate consent, please contact us so that we can take appropriate action.',
          ],
        },
      ]}
      contact={<ContactBlock />}
    />
  )
}
