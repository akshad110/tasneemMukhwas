import type { MouseEvent } from 'react'
import PolicyPageLayout from '../components/legal/PolicyPageLayout'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_URL,
} from '../lib/contact'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { BRAND_INK, BRAND_MUTED, BRAND_SANS } from '../lib/brand'

const EFFECTIVE = '4 September 2026'

function policyLink(href: string, label: string) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    navigateApp(href)
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className="font-semibold text-[#0a2e22] underline decoration-[rgba(10,46,34,0.35)] underline-offset-[3px] transition-colors hover:text-[#b8860b]"
    >
      {label}
    </a>
  )
}

function ContactBlock() {
  return (
    <div>
      <h2
        className="m-0 text-[1.02rem] font-bold sm:text-[1.08rem]"
        style={{ color: BRAND_INK, fontFamily: BRAND_SANS }}
      >
        11. Contact Us
      </h2>
      <p
        className="mt-3 m-0 text-[0.88rem] leading-[1.72] sm:text-[0.92rem]"
        style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
      >
        For any questions regarding these Terms, products or orders:
      </p>
      <ul
        className="mt-3 m-0 list-none space-y-2 p-0 text-[0.88rem] leading-[1.65] sm:text-[0.92rem]"
        style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
      >
        <li>
          <strong style={{ color: BRAND_INK }}>Tasneem Mukhwas</strong>
        </li>
        <li>
          <strong style={{ color: BRAND_INK }}>A Brand of Furat Gruh Udyog</strong>
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

export default function TermsConditionsPage() {
  return (
    <PolicyPageLayout
      title="Terms & Conditions"
      effectiveDate={EFFECTIVE}
      intro={[
        'Welcome to Tasneem Mukhwas, a food brand developed under Furat Gruh Udyog. By accessing or using tasneemmukhwas.com, you agree to the following Terms & Conditions.',
      ]}
      sections={[
        {
          heading: '1. Acceptance of Terms',
          paragraphs: [
            'By using our Website, you confirm that you have read, understood and agreed to these Terms & Conditions and our other applicable policies.',
          ],
        },
        {
          heading: '2. Products & Information',
          paragraphs: [
            'We make every reasonable effort to provide accurate product descriptions, images, ingredients, pricing and availability. However, minor variations in product appearance or packaging may occur.',
            'All products are subject to availability, and we reserve the right to modify or discontinue products when necessary.',
          ],
        },
        {
          heading: '3. Orders & Payment',
          paragraphs: [
            'Placing an order on our Website constitutes a request to purchase the selected products. Orders are subject to confirmation and availability.',
            'We reserve the right to cancel an order in cases such as product unavailability, incorrect pricing, payment issues or incorrect customer information. Any eligible payment received for a cancelled order will be refunded.',
            'Payments may be processed through secure third-party payment providers.',
          ],
        },
        {
          heading: '4. Shipping & Delivery',
          paragraphs: [
            'Customers are responsible for providing accurate delivery and contact information. Delivery timelines are estimates and may vary depending on location, logistics partners, weather or other circumstances beyond our control.',
          ],
          footer: (
            <p
              className="m-0 text-[0.88rem] leading-[1.72] sm:text-[0.92rem]"
              style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
            >
              Please refer to our {policyLink(APP_ROUTES.shippingPolicy, 'Shipping & Delivery Policy')} for complete
              details.
            </p>
          ),
        },
        {
          heading: '5. Returns & Refunds',
          paragraphs: [
            'As our products are food items, returns and exchanges may be subject to hygiene and food-safety considerations.',
            'If you receive a damaged, defective or incorrect product, please contact us promptly with your order details and supporting photographs.',
          ],
          footer: (
            <p
              className="m-0 text-[0.88rem] leading-[1.72] sm:text-[0.92rem]"
              style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
            >
              Please refer to our {policyLink(APP_ROUTES.shippingPolicy, 'Return & Refund Policy')} for complete
              details.
            </p>
          ),
        },
        {
          heading: '6. Customer Responsibility',
          paragraphs: [
            'Customers should carefully check the product label, ingredients, allergen information and storage instructions before consumption.',
          ],
        },
        {
          heading: '7. Intellectual Property',
          paragraphs: [
            'All Tasneem Mukhwas branding, logos, product images, website content, designs and other materials are the property of Tasneem Mukhwas/Furat Gruh Udyog and may not be copied or used without permission.',
          ],
        },
        {
          heading: '8. Website Use',
          paragraphs: [
            'You agree not to misuse the Website, attempt unauthorized access, interfere with its operation or use it for any unlawful purpose.',
          ],
        },
        {
          heading: '9. Changes to These Terms',
          paragraphs: [
            'We may update these Terms & Conditions from time to time. Changes will become effective when published on the Website.',
          ],
        },
        {
          heading: '10. Governing Law',
          paragraphs: [
            'These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the applicable jurisdiction of the courts in Gujarat, India.',
          ],
        },
      ]}
      contact={<ContactBlock />}
    />
  )
}
