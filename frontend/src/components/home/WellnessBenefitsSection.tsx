import { BRAND_INK, BRAND_SANS } from '../../lib/brand'
import { WELLNESS_BENEFITS } from '../../lib/wellnessBenefitsContent'

export default function WellnessBenefitsSection() {
  return (
    <section
      className="wellness-benefits"
      aria-labelledby="wellness-benefits-title"
    >
      <div className="wellness-benefits__inner">
        <h2
          id="wellness-benefits-title"
          className="wellness-benefits__title"
          style={{ fontFamily: BRAND_SANS, color: BRAND_INK }}
        >
          Discover the Wellness Benefits of Mukhwas
        </h2>

        <ul className="wellness-benefits__grid">
          {WELLNESS_BENEFITS.map((item) => (
            <li key={item.label} className="wellness-benefits__item" tabIndex={0}>
              <div className="wellness-benefits__icon-circle">{item.icon}</div>
              <p className="wellness-benefits__label" style={{ fontFamily: BRAND_SANS }}>
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
