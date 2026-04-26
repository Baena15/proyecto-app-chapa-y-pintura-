# 02 — Modelos de Datos

## users

```python
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('receptionist', 'Recepcionista'),
        ('mechanic', 'Mecanico / Chapista'),
        ('painter', 'Pintor'),
        ('client', 'Cliente'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## customers

```python
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    dni = models.CharField(max_length=20, blank=True)  # NIF/DNI
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Vehicle(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='vehicles')
    license_plate = models.CharField(max_length=20, unique=True)  # Matricula
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    color = models.CharField(max_length=30)
    vin = models.CharField(max_length=17, blank=True)  # Numero de bastidor
    insurance_company = models.CharField(max_length=100, blank=True)
    insurance_policy = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## workorders

```python
class WorkOrder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('in_progress', 'En progreso'),
        ('in_bodywork', 'En chapa'),
        ('waiting_parts', 'Esperando piezas'),
        ('in_painting', 'En pintura'),
        ('quality_control', 'Control de calidad'),
        ('ready', 'Listo para entrega'),
        ('delivered', 'Entregado'),
        ('cancelled', 'Cancelado'),
    ]

    code = models.CharField(max_length=20, unique=True)  # OT-2024-0001
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='work_orders')
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='work_orders')
    description = models.TextField()  # Descripcion del problema / danos
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_work_orders')
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estimated_completion = models.DateField(null=True, blank=True)
    actual_completion = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_work_orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class WorkOrderItem(models.Model):
    TYPE_CHOICES = [
        ('bodywork', 'Chapa'),
        ('painting', 'Pintura'),
        ('mechanical', 'Mecanica'),
        ('electrical', 'Electricidad'),
        ('other', 'Otro'),
    ]
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    item_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    estimated_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    actual_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    parts_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

class WorkOrderStatusHistory(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='status_history')
    from_status = models.CharField(max_length=20)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## estimates

```python
class Estimate(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('sent', 'Enviado'),
        ('approved', 'Aprobado'),
        ('rejected', 'Rechazado'),
    ]
    work_order = models.OneToOneField(WorkOrder, on_delete=models.CASCADE, related_name='estimate')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_labor = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_parts = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valid_until = models.DateField()
    sent_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class EstimateItem(models.Model):
    TYPE_CHOICES = [
        ('labor', 'Mano de obra'),
        ('part', 'Pieza / Material'),
    ]
    estimate = models.ForeignKey(Estimate, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    item_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
```

---

## invoices

```python
class Invoice(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('sent', 'Enviada'),
        ('paid', 'Pagada'),
        ('overdue', 'Vencida'),
    ]
    code = models.CharField(max_length=20, unique=True)  # FAC-2024-0001
    work_order = models.OneToOneField(WorkOrder, on_delete=models.PROTECT, related_name='invoice')
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=21.00)  # IVA %
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    due_date = models.DateField()
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, blank=True)  # cash, card, transfer
    created_at = models.DateTimeField(auto_now_add=True)

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
```

---

## photos

```python
class Photo(models.Model):
    TYPE_CHOICES = [
        ('damage', 'Danos iniciales'),
        ('progress', 'Progreso'),
        ('final', 'Resultado final'),
        ('document', 'Documento'),
    ]
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='work_orders/%Y/%m/')
    photo_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.CharField(max_length=255, blank=True)
    taken_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    taken_at = models.DateTimeField(auto_now_add=True)
```

---

## notifications

```python
class Notification(models.Model):
    CHANNEL_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('sent', 'Enviado'),
        ('failed', 'Fallido'),
    ]
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```
