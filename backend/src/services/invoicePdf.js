import PDFDocument from 'pdfkit'
import { GST_RATE, INVOICE_SELLER } from '../config/invoice.js'

function fmt(n) {
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDate(d) {
  const dt = d instanceof Date ? d : new Date(d)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const yyyy = dt.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

/**
 * Generate a tax invoice PDF buffer for an order + transaction.
 * @param {{ order: object, transaction: object }} payload
 * @returns {Promise<Buffer>}
 */
export function buildInvoicePdf({ order, transaction }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const subtotal = order.subtotal || 0
    const deliveryFee = order.deliveryFee || 0
    const taxable = subtotal
    const cgst = Math.round(taxable * (GST_RATE / 2) * 100) / 100
    const sgst = Math.round(taxable * (GST_RATE / 2) * 100) / 100
    const rawTotal = subtotal + deliveryFee + cgst + sgst
    const total = Math.round(rawTotal)
    const roundOff = Math.round((total - rawTotal) * 100) / 100

    const invoiceNo = transaction.invoice.replace(/^INV-/, '') || order.orderNumber
    const invoiceDate = fmtDate(order.createdAt || new Date())

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text(INVOICE_SELLER.legalName, 40, 40)
    doc.fontSize(8).font('Helvetica')
    INVOICE_SELLER.addressLines.forEach((line, i) => {
      doc.text(line, 40, 62 + i * 11)
    })
    doc.text(`Phone: ${INVOICE_SELLER.phone}`, 40, 90)
    doc.text(`GSTIN: ${INVOICE_SELLER.gstin}`, 40, 102)
    doc.text(`STATE: ${INVOICE_SELLER.state}, CODE: ${INVOICE_SELLER.stateCode}`, 40, 114)

    doc.fontSize(18).font('Helvetica-Bold').text('TAX INVOICE', 400, 40, { align: 'right', width: 155 })
    doc.fontSize(9).font('Helvetica')
    const metaX = 380
    let metaY = 68
    ;[
      ['INVOICE #', invoiceNo],
      ['DATE', invoiceDate],
      ['ORDER #', order.orderNumber],
      ['TERMS', order.payment === 'cod' ? 'COD' : 'Prepaid'],
    ].forEach(([k, v]) => {
      doc.font('Helvetica-Bold').text(k, metaX, metaY, { width: 70 })
      doc.font('Helvetica').text(String(v), metaX + 72, metaY, { width: 100 })
      metaY += 14
    })

    doc.moveTo(40, 135).lineTo(555, 135).stroke('#cccccc')

    // Bill to
    doc.fontSize(9).font('Helvetica-Bold').text('BILL TO', 40, 148)
    doc.font('Helvetica').fontSize(9)
    doc.text(order.customerName, 40, 162)
    doc.text(order.address || '', 40, 174, { width: 220 })
    doc.text(`${order.city || ''}${order.postal ? ` - ${order.postal}` : ''}`, 40, 198)
    doc.text(order.customerEmail, 40, 210)
    if (order.customerPhone) doc.text(`Phone: ${order.customerPhone}`, 40, 222)

    doc.font('Helvetica-Bold').text('SHIP TO', 300, 148)
    doc.font('Helvetica')
    doc.text(order.customerName, 300, 162)
    doc.text(order.address || '', 300, 174, { width: 240 })
    doc.text(`${order.city || ''}, ${order.country || 'India'}`, 300, 198)

    doc.moveTo(40, 245).lineTo(555, 245).stroke('#cccccc')

    // Table header
    const tableTop = 255
    const cols = [
      { label: 'DESCRIPTION', x: 40, w: 200 },
      { label: 'HSN', x: 245, w: 40 },
      { label: 'UNIT', x: 290, w: 35 },
      { label: 'QTY', x: 330, w: 35 },
      { label: 'UNIT PRICE', x: 370, w: 70 },
      { label: 'AMOUNT', x: 445, w: 110 },
    ]
    doc.fontSize(8).font('Helvetica-Bold')
    cols.forEach((c) => doc.text(c.label, c.x, tableTop, { width: c.w }))
    doc.moveTo(40, tableTop + 14).lineTo(555, tableTop + 14).stroke('#aaaaaa')

    let rowY = tableTop + 22
    doc.font('Helvetica').fontSize(8)
    for (const item of order.items || []) {
      const name = item.variantLabel && item.variantLabel !== 'Default'
        ? `${item.name} (${item.variantLabel})`
        : item.name
      doc.text(name, cols[0].x, rowY, { width: cols[0].w })
      doc.text(INVOICE_SELLER.defaultHsn, cols[1].x, rowY, { width: cols[1].w })
      doc.text('PCS', cols[2].x, rowY, { width: cols[2].w })
      doc.text(String(item.qty), cols[3].x, rowY, { width: cols[3].w })
      doc.text(fmt(item.unitPrice), cols[4].x, rowY, { width: cols[4].w })
      doc.text(fmt(item.lineTotal), cols[5].x, rowY, { width: cols[5].w, align: 'right' })
      rowY += 16
      if (rowY > 680) {
        doc.addPage()
        rowY = 50
      }
    }

    if (deliveryFee > 0) {
      doc.text('Delivery fee', cols[0].x, rowY, { width: cols[0].w })
      doc.text('9965', cols[1].x, rowY, { width: cols[1].w })
      doc.text('—', cols[2].x, rowY, { width: cols[2].w })
      doc.text('1', cols[3].x, rowY, { width: cols[3].w })
      doc.text(fmt(deliveryFee), cols[4].x, rowY, { width: cols[4].w })
      doc.text(fmt(deliveryFee), cols[5].x, rowY, { width: cols[5].w, align: 'right' })
      rowY += 16
    }

    rowY += 10
    doc.moveTo(40, rowY).lineTo(555, rowY).stroke('#cccccc')
    rowY += 12

    // Tax summary bar
    doc.fontSize(8).font('Helvetica-Bold')
    doc.text('RATE', 40, rowY)
    doc.text('TAX VALUE', 120, rowY)
    doc.text('CGST', 220, rowY)
    doc.text('SGST', 320, rowY)
    doc.font('Helvetica')
    doc.text(`${GST_RATE * 100}%`, 40, rowY + 14)
    doc.text(fmt(taxable), 120, rowY + 14)
    doc.text(fmt(cgst), 220, rowY + 14)
    doc.text(fmt(sgst), 320, rowY + 14)

    // Totals (right)
    const totalsX = 380
    let ty = rowY
    const totalRows = [
      ['SUBTOTAL', fmt(subtotal)],
      ['CGST', fmt(cgst)],
      ['SGST', fmt(sgst)],
      ['Delivery', fmt(deliveryFee)],
      ['Round off', fmt(roundOff)],
    ]
    doc.fontSize(9)
    totalRows.forEach(([label, val]) => {
      doc.font('Helvetica').text(label, totalsX, ty, { width: 80 })
      doc.text(val, totalsX + 85, ty, { width: 90, align: 'right' })
      ty += 14
    })
    doc.font('Helvetica-Bold').fontSize(11)
    doc.text('TOTAL', totalsX, ty + 4)
    doc.text(`₹ ${fmt(total)}`, totalsX + 85, ty + 4, { width: 90, align: 'right' })

    ty += 40
    doc.fontSize(8).font('Helvetica')
    doc.text('Thank you for your business', 40, ty)
    doc.text('Bank Details:', 40, ty + 20)
    doc.text(
      `${INVOICE_SELLER.bank.name} · A/C ${INVOICE_SELLER.bank.account} · IFSC ${INVOICE_SELLER.bank.ifsc} · ${INVOICE_SELLER.bank.branch}`,
      40,
      ty + 32,
      { width: 320 },
    )

    doc.text(`Payment: ${transaction.method.toUpperCase()} · ${transaction.status.toUpperCase()}`, 40, ty + 52)
    if (transaction.razorpayPaymentId) {
      doc.text(`Razorpay ID: ${transaction.razorpayPaymentId}`, 40, ty + 64)
    }

    doc.font('Helvetica-Bold').text(`For, ${INVOICE_SELLER.legalName}`, 400, ty + 20, { align: 'right', width: 155 })
    doc.font('Helvetica').text('Authorised Signatory', 400, ty + 70, { align: 'right', width: 155 })

    doc.end()
  })
}

export function invoiceFilename(orderNumber, invoiceId) {
  const safe = String(invoiceId || orderNumber).replace(/[^\w-]/g, '_')
  return `Invoice-${safe}.pdf`
}

/** Whether this order's invoice can be downloaded. */
export function canDownloadInvoice(order, transaction) {
  if (!transaction) return false
  if (order.status === 'cancelled') return false
  if (transaction.status === 'paid') return true
  if (order.paymentStatus === 'paid') return true
  if (order.payment === 'cod' && transaction.status === 'pending') return true
  if (order.payment === 'razorpay' && order.paymentStatus === 'paid') return true
  return false
}
