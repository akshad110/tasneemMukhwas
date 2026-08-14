import { connectDB } from '../config/db.js'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { Product } from '../models/Product.js'
import { Customer } from '../models/Customer.js'
import { Order } from '../models/Order.js'
import { Transaction } from '../models/Transaction.js'

const force = process.argv.includes('--force')

const SEED_PRODUCTS = [
  {
    name: 'Shahi Mukhwas',
    description: 'Premium quality digestive mouth freshener. Tradition that freshens every bite.',
    category: 'Classic Mukhwas',
    brand: 'Tasneem',
    fill: '#6b1018',
    lightText: true,
    image: '/products/shahi-mukhwas.png',
    images: ['/products/shahi-mukhwas.png'],
    price: 249,
    compareAt: 299,
    stock: 86,
    rating: 5,
    reviews: 42,
    variants: [
      { id: 'shahi', label: 'Shahi', color: '#6b1018', image: '/products/shahi-mukhwas.png' },
      { id: 'royal', label: 'Royal', color: '#b8860b', image: '/products/shahi-mukhwas.png' },
      { id: 'festive', label: 'Festive', color: '#8b1e2d', image: '/products/mouth-freshener.png' },
    ],
  },
  {
    name: 'Mango Slice Mukhwas',
    description: 'Bright mango-slice crunch with classic mukhwas warmth.',
    category: 'Fruit Blend',
    brand: 'Tasneem',
    fill: '#eab126',
    lightText: false,
    image: '/products/mango-slice-mukhwas.png',
    images: ['/products/mango-slice-mukhwas.png'],
    price: 199,
    compareAt: 249,
    stock: 42,
    rating: 4,
    reviews: 28,
    variants: [
      { id: 'mango', label: 'Mango', color: '#eab126', image: '/products/mango-slice-mukhwas.png' },
      { id: 'ripe', label: 'Ripe', color: '#d97706', image: '/products/mango-slice-mukhwas.png' },
    ],
  },
  {
    name: 'Paan Shots Mukhwas',
    description: 'Glossy paan shots in a premium mix — fun, fresh, and flavourful.',
    category: 'Paan Special',
    brand: 'Master Paan',
    fill: '#c8e6d1',
    lightText: false,
    image: '/products/paan-shots-mukhwas.png',
    images: ['/products/paan-shots-mukhwas.png'],
    price: 279,
    compareAt: 329,
    stock: 55,
    rating: 5,
    reviews: 36,
    variants: [
      { id: 'paan', label: 'Paan', color: '#4ade80', image: '/products/paan-shots-mukhwas.png' },
      { id: 'meetha', label: 'Meetha', color: '#86efac', image: '/products/paan-shots-mukhwas.png' },
    ],
  },
  {
    name: 'Mouth Freshener',
    description: 'Everyday cool freshness for after meals and gatherings.',
    category: 'Mouth Freshener',
    brand: 'Patel Mukhwas',
    fill: '#004865',
    lightText: true,
    image: '/products/mouth-freshener.png',
    images: ['/products/mouth-freshener.png'],
    price: 179,
    stock: 120,
    rating: 4,
    reviews: 19,
    variants: [
      { id: 'fresh', label: 'Fresh', color: '#004865', image: '/products/mouth-freshener.png' },
    ],
  },
  {
    name: 'Alsi Til Mukhwas',
    description: 'Nutty alsi-til seed mix with traditional digestive balance.',
    category: 'Seed Mix',
    brand: 'Furat Gruh',
    fill: '#4b1916',
    lightText: true,
    image: '/products/alsi-til-mukhwas.png',
    images: ['/products/alsi-til-mukhwas.png'],
    price: 229,
    compareAt: 269,
    stock: 33,
    rating: 5,
    reviews: 31,
    variants: [
      { id: 'alsi', label: 'Alsi', color: '#4b1916', image: '/products/alsi-til-mukhwas.png' },
      { id: 'til', label: 'Til', color: '#78350f', image: '/products/alsi-til-mukhwas.png' },
    ],
  },
  {
    name: 'Shahi Family Pack',
    description: 'Larger pack of signature Shahi mukhwas for gifting and gatherings.',
    category: 'Classic Mukhwas',
    brand: 'Tasneem',
    fill: '#6b1018',
    lightText: true,
    image: '/products/shahi-mukhwas.png',
    images: ['/products/shahi-mukhwas.png'],
    price: 499,
    compareAt: 599,
    stock: 18,
    rating: 5,
    reviews: 18,
    variants: [
      { id: '1kg', label: '1kg', color: '#6b1018', image: '/products/shahi-mukhwas.png' },
    ],
  },
  {
    name: 'Mango Slice Mini',
    description: 'Travel-friendly mango crunch pouches.',
    category: 'Fruit Blend',
    brand: 'Tasneem',
    fill: '#eab126',
    lightText: false,
    image: '/products/mango-slice-mukhwas.png',
    images: ['/products/mango-slice-mukhwas.png'],
    price: 129,
    stock: 64,
    rating: 4,
    reviews: 14,
    variants: [{ id: 'mini', label: 'Mini', color: '#eab126', image: '/products/mango-slice-mukhwas.png' }],
  },
  {
    name: 'Paan Shots Gift Box',
    description: 'Festive gift box of glossy paan shots.',
    category: 'Paan Special',
    brand: 'Master Paan',
    fill: '#c8e6d1',
    lightText: false,
    image: '/products/paan-shots-mukhwas.png',
    images: ['/products/paan-shots-mukhwas.png'],
    price: 649,
    compareAt: 749,
    stock: 22,
    rating: 5,
    reviews: 22,
    variants: [{ id: 'box', label: 'Box', color: '#4ade80', image: '/products/paan-shots-mukhwas.png' }],
  },
]

const DEMO_CUSTOMERS = [
  {
    name: 'Ayesha Khan',
    email: 'ayesha.k@email.com',
    phone: '+91 98765 43210',
    city: 'Ahmedabad',
    status: 'active',
  },
  {
    name: 'Rahul Patel',
    email: 'rahul.p@email.com',
    phone: '+91 98250 11223',
    city: 'Surat',
    status: 'active',
  },
  {
    name: 'Fatima Sheikh',
    email: 'fatima.s@email.com',
    phone: '+91 99099 88776',
    city: 'Chhapi',
    status: 'active',
  },
  {
    name: 'Vikram Shah',
    email: 'vikram.shah@email.com',
    phone: '+91 90160 44556',
    city: 'Vadodara',
    status: 'inactive',
  },
  {
    name: 'Meera Desai',
    email: 'meera.d@email.com',
    phone: '+91 97277 33445',
    city: 'Rajkot',
    status: 'active',
  },
  {
    name: 'Imran Qureshi',
    email: 'imran.q@email.com',
    phone: '+91 96876 22110',
    city: 'Gandhinagar',
    status: 'active',
  },
]

function atDay(year, monthIndex, day, hour = 12) {
  return new Date(Date.UTC(year, monthIndex, day, hour, 0, 0))
}

function normalizeProduct(p) {
  const hasDiscount = Boolean(p.compareAt && p.compareAt > p.price)
  return {
    ...p,
    price: hasDiscount ? p.compareAt : p.price,
    showDiscountedPrice: hasDiscount,
    discountedPrice: hasDiscount ? p.price : undefined,
    compareAt: hasDiscount ? p.compareAt : undefined,
    outOfStock: p.stock <= 0,
    sales: 0,
  }
}

function sellPrice(p) {
  if (p.showDiscountedPrice && p.discountedPrice > 0) return p.discountedPrice
  return p.price
}

async function seed() {
  await connectDB()

  const adminEmail = env.adminEmail.toLowerCase()
  let admin = await User.findOne({ email: adminEmail })
  if (!admin) {
    admin = await User.create({
      name: env.adminName,
      email: adminEmail,
      password: env.adminPassword,
      phone: env.adminPhone,
      role: 'admin',
    })
    console.log(`Admin created: ${adminEmail}`)
  } else {
    admin.role = 'admin'
    admin.name = env.adminName
    if (env.adminPhone) admin.phone = env.adminPhone
    await admin.save()
    console.log(`Admin ensured: ${adminEmail}`)
  }

  // Demo storefront users (customers)
  for (const c of DEMO_CUSTOMERS) {
    const existing = await User.findOne({ email: c.email })
    if (!existing) {
      await User.create({
        name: c.name,
        email: c.email,
        password: 'Demo@12345',
        phone: c.phone,
        role: 'customer',
      })
    }
  }
  console.log(`Demo users ensured (${DEMO_CUSTOMERS.length})`)

  let products = await Product.find()
  if (products.length === 0 || force) {
    if (force) await Product.deleteMany({})
    products = await Product.insertMany(SEED_PRODUCTS.map(normalizeProduct))
    console.log(`Seeded ${products.length} products`)
  } else {
    console.log(`Products already present (${products.length}) — skipped product seed`)
  }

  const orderCount = await Order.countDocuments()
  if (orderCount > 0 && !force) {
    console.log(`Orders already present (${orderCount}) — skipped commerce seed (use --force to reset)`)
    console.log('Seed complete')
    process.exit(0)
  }

  if (force) {
    await Promise.all([
      Order.deleteMany({}),
      Transaction.deleteMany({}),
      Customer.deleteMany({}),
    ])
    console.log('Cleared existing orders / transactions / customers')
  }

  const byName = Object.fromEntries(products.map((p) => [p.name, p]))

  const customerDocs = []
  for (const c of DEMO_CUSTOMERS) {
    customerDocs.push(
      await Customer.create({
        name: c.name,
        email: c.email,
        phone: c.phone,
        city: c.city,
        orders: 0,
        spent: 0,
        lastActive: '2026-08-14',
        status: c.status,
        interactions: [],
      }),
    )
  }

  const year = 2026
  const demoOrders = [
    // Spread across months for sales chart
    { n: 'TM-1001', cust: 0, items: [['Shahi Mukhwas', 2]], payment: 'razorpay', status: 'completed', city: 'Ahmedabad', date: atDay(year, 0, 18), tracking: 'INPOST87001' },
    { n: 'TM-1002', cust: 1, items: [['Mango Slice Mukhwas', 1]], payment: 'cod', status: 'completed', city: 'Surat', date: atDay(year, 1, 12), tracking: 'INPOST87022' },
    { n: 'TM-1003', cust: 2, items: [['Paan Shots Mukhwas', 3]], payment: 'razorpay', status: 'completed', city: 'Chhapi', date: atDay(year, 2, 8), tracking: 'INPOST87110' },
    { n: 'TM-1004', cust: 4, items: [['Alsi Til Mukhwas', 2], ['Mouth Freshener', 1]], payment: 'upi', status: 'completed', city: 'Rajkot', date: atDay(year, 3, 21), tracking: 'INPOST87201' },
    { n: 'TM-1005', cust: 5, items: [['Shahi Family Pack', 1]], payment: 'razorpay', status: 'completed', city: 'Gandhinagar', date: atDay(year, 4, 9), tracking: 'INPOST87330' },
    { n: 'TM-1006', cust: 0, items: [['Mango Slice Mini', 4]], payment: 'cod', status: 'completed', city: 'Ahmedabad', date: atDay(year, 5, 15), tracking: 'INPOST87440' },
    { n: 'TM-1007', cust: 2, items: [['Paan Shots Gift Box', 1]], payment: 'razorpay', status: 'completed', city: 'Chhapi', date: atDay(year, 6, 3), tracking: 'INPOST87555' },
    { n: 'TM-1008', cust: 1, items: [['Shahi Mukhwas', 1], ['Mouth Freshener', 2]], payment: 'card', status: 'completed', city: 'Surat', date: atDay(year, 6, 28), tracking: 'INPOST87620' },
    { n: 'TM-1036', cust: 0, items: [['Shahi Mukhwas', 2], ['Alsi Til Mukhwas', 2]], payment: 'razorpay', status: 'completed', city: 'Ahmedabad', date: atDay(year, 7, 8), tracking: 'INPOST88002' },
    { n: 'TM-1037', cust: 3, items: [['Mango Slice Mukhwas', 1]], payment: 'razorpay', status: 'cancelled', city: 'Vadodara', date: atDay(year, 7, 10) },
    { n: 'TM-1038', cust: 1, items: [['Mango Slice Mukhwas', 2]], payment: 'cod', status: 'shipped', city: 'Surat', date: atDay(year, 7, 12), tracking: 'INPOST88311' },
    { n: 'TM-1039', cust: 1, items: [['Paan Shots Mukhwas', 1], ['Mouth Freshener', 1]], payment: 'cod', status: 'pending', city: 'Surat', date: atDay(year, 7, 13) },
    { n: 'TM-1040', cust: 2, items: [['Shahi Family Pack', 1], ['Paan Shots Mukhwas', 2]], payment: 'razorpay', status: 'completed', city: 'Chhapi', date: atDay(year, 7, 13), tracking: 'INPOST88390' },
    { n: 'TM-1041', cust: 4, items: [['Shahi Mukhwas', 1]], payment: 'cod', status: 'processing', city: 'Rajkot', date: atDay(year, 7, 14) },
    { n: 'TM-1042', cust: 0, items: [['Shahi Mukhwas', 1], ['Mango Slice Mukhwas', 1], ['Mouth Freshener', 1]], payment: 'razorpay', status: 'shipped', city: 'Ahmedabad', date: atDay(year, 7, 14), tracking: 'INPOST88421' },
    { n: 'TM-1043', cust: 5, items: [['Alsi Til Mukhwas', 3]], payment: 'upi', status: 'processing', city: 'Gandhinagar', date: atDay(year, 7, 14) },
    { n: 'TM-1044', cust: 4, items: [['Paan Shots Gift Box', 1]], payment: 'razorpay', status: 'pending', city: 'Rajkot', date: atDay(year, 7, 14) },
  ]

  let txnSeq = 8990
  for (const row of demoOrders) {
    const customer = customerDocs[row.cust]
    const lineItems = []
    let itemCount = 0
    let subtotal = 0

    for (const [name, qty] of row.items) {
      const product = byName[name]
      if (!product) continue
      const variant = product.variants?.[0] || {
        id: 'default',
        label: 'Default',
        image: product.image,
      }
      const unitPrice = sellPrice(product)
      const lineTotal = unitPrice * qty
      itemCount += qty
      subtotal += lineTotal
      product.sales = (product.sales || 0) + qty
      lineItems.push({
        product: product._id,
        productId: product._id.toString(),
        name: product.name,
        variantId: variant.id,
        variantLabel: variant.label,
        image: variant.image || product.image,
        qty,
        unitPrice,
        lineTotal,
      })
    }

    if (!lineItems.length) continue

    const deliveryFee = 49
    const total = subtotal + deliveryFee
    const paymentMethod = row.payment === 'upi' || row.payment === 'card' ? 'razorpay' : row.payment

    const order = await Order.create({
      orderNumber: row.n,
      customer: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      address: `${customer.city}, Gujarat`,
      city: row.city,
      country: 'India',
      postal: '380001',
      items: lineItems,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      status: row.status,
      payment: paymentMethod,
      tracking: row.tracking || '',
      createdAt: row.date,
      updatedAt: row.date,
    })

    // Force timestamps (mongoose may override on create)
    await Order.collection.updateOne(
      { _id: order._id },
      { $set: { createdAt: row.date, updatedAt: row.date } },
    )

    const txnStatus =
      row.status === 'cancelled'
        ? 'refunded'
        : row.status === 'completed' || paymentMethod === 'razorpay'
          ? 'paid'
          : row.status === 'pending'
            ? 'pending'
            : 'pending'

    // One failed txn for demo variety
    const finalTxnStatus = row.n === 'TM-1002' ? 'paid' : row.n === 'TM-1029' ? 'failed' : txnStatus

    txnSeq += 1
    const txnNumber = `TX-${txnSeq}`
    const invoice = `INV-${year}-${row.n.replace('TM-', '')}`
    const method =
      row.payment === 'upi' || row.payment === 'card' ? row.payment : paymentMethod

    const txn = await Transaction.create({
      txnNumber,
      order: order._id,
      orderNumber: row.n,
      customerName: customer.name,
      customerEmail: customer.email,
      amount: total,
      method,
      status: finalTxnStatus === 'refunded' && row.status !== 'cancelled' ? 'paid' : finalTxnStatus,
      invoice,
      createdAt: row.date,
      updatedAt: row.date,
    })
    await Transaction.collection.updateOne(
      { _id: txn._id },
      { $set: { createdAt: row.date, updatedAt: row.date } },
    )

    if (row.status !== 'cancelled') {
      customer.orders += 1
      customer.spent += total
    }
    customer.lastActive = row.date.toISOString().slice(0, 10)
    customer.interactions.unshift({
      date: customer.lastActive,
      type: row.status === 'cancelled' ? 'Refund' : 'Order',
      detail:
        row.status === 'cancelled'
          ? `Cancelled ${row.n}`
          : `Placed ${row.n} · ₹${total}`,
    })
  }

  // Extra failed txn (orphan style for transactions page variety)
  await Transaction.create({
    txnNumber: 'TX-8888',
    orderNumber: 'TM-1029',
    customerName: 'Meera Desai',
    customerEmail: 'meera.d@email.com',
    amount: 649,
    method: 'upi',
    status: 'failed',
    invoice: 'INV-2026-1029',
    createdAt: atDay(year, 7, 1),
    updatedAt: atDay(year, 7, 1),
  })
  await Transaction.collection.updateOne(
    { txnNumber: 'TX-8888' },
    { $set: { createdAt: atDay(year, 7, 1), updatedAt: atDay(year, 7, 1) } },
  )

  for (const c of customerDocs) {
    c.interactions = c.interactions.slice(0, 8)
    await c.save()
  }
  for (const p of products) {
    await p.save()
  }

  // Low-stock / out-of-stock demos for inventory widget
  const mouth = byName['Mouth Freshener']
  const family = byName['Shahi Family Pack']
  if (mouth) {
    mouth.stock = 9
    await mouth.save()
  }
  if (family) {
    family.stock = 4
    await family.save()
  }
  const mini = byName['Mango Slice Mini']
  if (mini) {
    mini.stock = 0
    mini.outOfStock = true
    await mini.save()
  }

  console.log(`Seeded ${customerDocs.length} customers, ${demoOrders.length} orders, transactions`)
  console.log('Seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
