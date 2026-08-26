import PolicyPageLayout, { type PolicyBlock } from '../components/legal/PolicyPageLayout'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_URL,
} from '../lib/contact'
import { BRAND_INK, BRAND_MUTED, BRAND_SANS } from '../lib/brand'

const EFFECTIVE = '24 August 2026'

const SHIPPING_SECTIONS: PolicyBlock[] = [
  {
    heading: '1. Order Processing',
    paragraphs: [
      'Orders are generally processed after successful payment and order confirmation. Processing time may vary depending on product availability, order volume and delivery location.',
    ],
  },
  {
    heading: '2. Delivery Time',
    paragraphs: [
      'Estimated delivery timelines will depend on the delivery address and logistics partner. Delays may occur due to weather, public holidays, transportation issues or other circumstances beyond our control.',
    ],
  },
  {
    heading: '3. Shipping Charges',
    paragraphs: [
      'Shipping charges, if applicable, will be displayed during checkout or communicated before order confirmation.',
    ],
  },
  {
    heading: '4. Delivery Address',
    paragraphs: [
      'Customers must provide a complete and accurate delivery address and contact number. Tasneem Mukhwas is not responsible for delays or failed deliveries caused by incorrect or incomplete information.',
    ],
  },
  {
    heading: '5. Damaged or Incorrect Orders',
    paragraphs: [
      'If your package arrives damaged, tampered with or contains an incorrect product, please contact us as soon as possible with your order details and supporting photographs.',
    ],
  },
  {
    heading: '6. International Shipping',
    paragraphs: [
      'International orders, where available, may be subject to customs duties, import taxes, clearance charges and local regulations. Such charges are the responsibility of the customer unless otherwise agreed.',
    ],
  },
  {
    heading: '7. Shipping Contact',
    paragraphs: [
      'For shipping-related questions, please contact Tasneem Mukhwas through the contact details provided at the end of this page.',
    ],
  },
]

const RETURN_SECTIONS: PolicyBlock[] = [
  {
    heading: '1. Food Products',
    paragraphs: [
      'For safety and hygiene reasons, opened or used food products are generally not eligible for return or exchange.',
    ],
  },
  {
    heading: '2. Damaged or Incorrect Products',
    paragraphs: [
      'If you receive a damaged, defective, expired or incorrect product, please contact us promptly after delivery with:',
    ],
    bullets: ['Order number', 'Product details', 'Photographs or video of the package/product'],
  },
  {
    heading: '3. Refunds',
    paragraphs: [
      'Approved refunds will be processed through the applicable payment method or as otherwise communicated by Tasneem Mukhwas.',
      'After verification, we may offer a replacement or refund, as applicable. The time taken for the refund to reflect in your account may depend on your bank or payment provider.',
    ],
  },
  {
    heading: '4. Order Cancellation',
    paragraphs: [
      'Cancellation requests should be made before the order is dispatched. Once an order has been dispatched, cancellation may not be possible.',
    ],
  },
  {
    heading: '5. Non-Returnable Situations',
    paragraphs: [
      'Returns or refunds may not be accepted for products damaged due to improper storage, misuse, opened packaging or customer negligence.',
    ],
  },
  {
    heading: '6. Return Contact',
    paragraphs: [
      'For return or refund requests, please contact us with your order details through the contact information below.',
    ],
  },
]

function ContactDetails() {
  return (
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
  )
}

export default function ShippingPolicyPage() {
  return (
    <PolicyPageLayout
      title="Shipping & Delivery Policy"
      effectiveDate={EFFECTIVE}
      intro={['At Tasneem Mukhwas, we aim to deliver your order safely and on time.']}
      sections={[
        ...SHIPPING_SECTIONS,
        {
          heading: 'Return & Refund Policy',
          paragraphs: [
            'Effective Date: 24 August 2026',
            'At Tasneem Mukhwas, we take care to provide quality food products and ensure that orders are packed securely.',
          ],
        },
        ...RETURN_SECTIONS,
      ]}
      contact={
        <div>
          <h2
            className="m-0 text-[1.02rem] font-bold sm:text-[1.08rem]"
            style={{ color: BRAND_INK, fontFamily: BRAND_SANS }}
          >
            Contact Information
          </h2>
          <ContactDetails />
        </div>
      }
    />
  )
}
