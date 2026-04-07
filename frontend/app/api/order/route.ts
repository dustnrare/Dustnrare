import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, address, paymentMethod, subtotal, shipping, total } = body

    if (!items?.length) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 })
    }
    if (!address?.name || !address?.phone) {
      return NextResponse.json({ message: 'Delivery address required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Generate order ID
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    const orderId = `DNR-${String((count || 0) + 1).padStart(4, '0')}`

    // Save order to Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        items,
        subtotal,
        shipping,
        total,
        customer_name: address.name,
        customer_phone: address.phone,
        address,
        payment_method: paymentMethod,
        status: 'placed',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase order insert error:', error)
      return NextResponse.json({ message: 'Failed to save order' }, { status: 500 })
    }

    // ── Build WhatsApp message ──────────────────────────────
    const itemLines = items
      .map((i: any) => `• ${i.name} × ${i.qty} (Size: ${i.size}) — ₹${(i.price * i.qty).toLocaleString('en-IN')}`)
      .join('\n')

    const waText = encodeURIComponent(
`🛍️ New Order — Dust N Rare
Order ID: ${orderId}

Items:
${itemLines}

Subtotal: ₹${subtotal.toLocaleString('en-IN')}
Shipping: ${shipping === 0 ? 'Free' : '₹' + shipping}
*Total: ₹${total.toLocaleString('en-IN')}*

Delivery to:
${address.name}
${address.line1}${address.line2 ? ', ' + address.line2 : ''}
${address.city}, ${address.state} — ${address.pincode}
Phone: ${address.phone}

Payment: Will pay via UPI/bank transfer`)

    const waNumber = process.env.ORDER_WHATSAPP || '917033182211'
    const waLink = `https://wa.me/${waNumber}?text=${waText}`

    // ── Build Email mailto link ─────────────────────────────
    const emailSubject = encodeURIComponent(`New Order ${orderId} — Dust N Rare`)
    const emailBody = encodeURIComponent(
`New Order Received — Dust N Rare

Order ID: ${orderId}

ITEMS:
${items.map((i: any) => `${i.name} x${i.qty} (Size: ${i.size}) — Rs.${i.price * i.qty}`).join('\n')}

Subtotal: Rs.${subtotal}
Shipping: ${shipping === 0 ? 'Free' : 'Rs.' + shipping}
Total: Rs.${total}

DELIVERY ADDRESS:
${address.name}
${address.line1}${address.line2 ? ', ' + address.line2 : ''}
${address.city}, ${address.state} - ${address.pincode}
Phone: ${address.phone}

Payment: Pending (UPI/bank transfer)`)

    const orderEmail = process.env.ORDER_EMAIL || 'dustnrare@gmail.com'
    const emailLink = `mailto:${orderEmail}?subject=${emailSubject}&body=${emailBody}`

    // ── Send email notification via Resend ──────────────────
    // NOTE: RESEND_API_KEY must be set. The 'from' address must be either:
    // 1. onboarding@resend.dev (only works if TO address is the Resend account email)
    // 2. A verified domain email like orders@yourdomain.com
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key') {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
        await resend.emails.send({
          from: fromEmail,
          to: orderEmail,
          subject: `🛍 New Order ${orderId} — Dust N Rare`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f8f7f5;">
              <div style="background: #2a2622; padding: 24px 32px; margin-bottom: 32px;">
                <h1 style="font-size: 20px; color: #f8f7f5; margin: 0; letter-spacing: 4px; font-weight: 400;">DUST·N·RARE</h1>
                <p style="color: #b8965a; font-size: 11px; letter-spacing: 3px; margin: 4px 0 0; text-transform: uppercase;">New Order Notification</p>
              </div>

              <div style="background: white; padding: 32px; border: 1px solid #eae3dc; margin-bottom: 16px;">
                <p style="font-size: 13px; color: #6b635c; margin: 0 0 8px;">Order Reference</p>
                <h2 style="font-size: 24px; color: #2a2622; margin: 0 0 24px; font-weight: 400;">${orderId}</h2>

                <div style="border-top: 1px solid #eae3dc; padding-top: 20px;">
                  <p style="font-size: 11px; color: #9e958e; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px;">Items Ordered</p>
                  ${items.map((i: any) => `
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0ece7;">
                      <div>
                        <p style="font-size: 14px; color: #2a2622; margin: 0;">${i.name}</p>
                        <p style="font-size: 11px; color: #9e958e; margin: 4px 0 0;">Qty: ${i.qty} · Size: ${i.size}</p>
                      </div>
                      <strong style="font-size: 14px; color: #2a2622;">₹${(i.price * i.qty).toLocaleString('en-IN')}</strong>
                    </div>
                  `).join('')}
                </div>

                <div style="margin-top: 20px; padding: 16px; background: #f8f7f5;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 13px; color: #6b635c;">Subtotal</span>
                    <span style="font-size: 13px; color: #2a2622;">₹${subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eae3dc;">
                    <span style="font-size: 13px; color: #6b635c;">Shipping</span>
                    <span style="font-size: 13px; color: #2a2622;">${shipping === 0 ? 'Free' : '₹' + shipping}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="font-size: 15px; color: #2a2622; font-weight: 600;">Total</span>
                    <span style="font-size: 18px; color: #b8965a; font-weight: 700;">₹${total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div style="background: white; padding: 32px; border: 1px solid #eae3dc; margin-bottom: 16px;">
                <p style="font-size: 11px; color: #9e958e; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px;">Delivery Address</p>
                <p style="font-size: 14px; color: #2a2622; line-height: 1.7; margin: 0;">
                  <strong>${address.name}</strong><br/>
                  ${address.line1}${address.line2 ? ', ' + address.line2 : ''}<br/>
                  ${address.city}, ${address.state} — ${address.pincode}<br/>
                  📞 ${address.phone}
                </p>
              </div>

              <div style="background: #b8965a; padding: 16px 32px; text-align: center;">
                <p style="color: white; font-size: 12px; margin: 0; letter-spacing: 1px;">
                  ⚡ Payment: Pending — UPI / Bank Transfer on confirmation
                </p>
              </div>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Resend email error (non-blocking):', emailErr)
      }
    }

    return NextResponse.json({ order, orderId, waLink, emailLink })
  } catch (err: any) {
    console.error('Order API error:', err)
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 })
  }
}
