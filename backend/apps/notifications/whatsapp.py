# ─── WhatsApp Service (Twilio) ───────────────
from django.conf import settings


def get_twilio_client():
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        return None
    from twilio.rest import Client

    return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


def send_whatsapp_message(to_number: str, body: str) -> dict:
    """Send a WhatsApp message via Twilio.

    Args:
        to_number: E.164 format, e.g. "+34612345678"
        body: Message text

    Returns:
        dict with success flag and sid or error
    """
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}

    if not settings.TWILIO_WHATSAPP_FROM:
        return {"success": False, "error": "TWILIO_WHATSAPP_FROM not configured"}

    # Ensure to_number has whatsapp: prefix
    to = to_number if to_number.startswith("whatsapp:") else f"whatsapp:{to_number}"
    from_ = (
        settings.TWILIO_WHATSAPP_FROM
        if settings.TWILIO_WHATSAPP_FROM.startswith("whatsapp:")
        else f"whatsapp:{settings.TWILIO_WHATSAPP_FROM}"
    )

    try:
        message = client.messages.create(from_=from_, body=body, to=to)
        return {"success": True, "sid": message.sid, "status": message.status}
    except Exception as e:
        return {"success": False, "error": str(e)}


def send_sms(to_number: str, body: str) -> dict:
    """Send an SMS via Twilio (fallback when WhatsApp is not available)."""
    client = get_twilio_client()
    if not client:
        return {"success": False, "error": "Twilio not configured"}

    if not settings.TWILIO_SMS_FROM:
        return {"success": False, "error": "TWILIO_SMS_FROM not configured"}

    to = to_number.replace("whatsapp:", "")
    try:
        message = client.messages.create(
            from_=settings.TWILIO_SMS_FROM, body=body, to=to
        )
        return {"success": True, "sid": message.sid, "status": message.status}
    except Exception as e:
        return {"success": False, "error": str(e)}


def notify_workorder_status_update(work_order, old_status: str, new_status: str) -> dict:
    """Notify customer when their work order status changes."""
    customer = work_order.customer
    if not customer or not customer.phone:
        return {"success": False, "error": "Customer has no phone number"}

    body = (
        f"Hola {customer.full_name}, tu vehiculo {work_order.vehicle.license_plate} "
        f"ha cambiado de estado: {old_status} -> {new_status}.\n"
        f"Puedes ver los detalles en: https://baena15.github.io/proyecto-app-chapa-y-pintura-/"
    )
    return send_whatsapp_message(customer.phone, body)


def notify_estimate_ready(estimate) -> dict:
    """Notify customer when an estimate is created."""
    work_order = estimate.work_order
    customer = work_order.customer
    if not customer or not customer.phone:
        return {"success": False, "error": "Customer has no phone number"}

    body = (
        f"Hola {customer.full_name}, tu presupuesto para el vehiculo "
        f"{work_order.vehicle.license_plate} esta listo.\n"
        f"Total: {estimate.total}€\n"
        f"Puedes ver los detalles en: https://baena15.github.io/proyecto-app-chapa-y-pintura-/"
    )
    return send_whatsapp_message(customer.phone, body)


def notify_invoice_ready(invoice) -> dict:
    """Notify customer when an invoice is ready."""
    work_order = invoice.work_order
    customer = work_order.customer
    if not customer or not customer.phone:
        return {"success": False, "error": "Customer has no phone number"}

    body = (
        f"Hola {customer.full_name}, tu factura para el vehiculo "
        f"{work_order.vehicle.license_plate} esta lista.\n"
        f"Total: {invoice.total}€\n"
        f"Puedes ver los detalles en: https://baena15.github.io/proyecto-app-chapa-y-pintura-/"
    )
    return send_whatsapp_message(customer.phone, body)
