from datetime import datetime, timezone
from app.db import db


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    trade_no = db.Column(db.String(40), unique=True, nullable=False, index=True)
    access_token = db.Column(db.String(60), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="pending")

    customer_name = db.Column(db.String(80), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    customer_email = db.Column(db.String(254), nullable=False)

    shipping_method = db.Column(db.String(20), nullable=False)
    shipping_address = db.Column(db.Text)
    note = db.Column(db.Text)

    total_ntd = db.Column(db.Integer, nullable=False)
    shipping_cost_ntd = db.Column(db.Integer, nullable=False, default=0)

    ecpay_trade_no = db.Column(db.String(40))
    ecpay_rtn_msg = db.Column(db.String(200))
    paid_at = db.Column(db.DateTime(timezone=True))

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    items = db.relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    sku = db.Column(db.String(80), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    price_ntd = db.Column(db.Integer, nullable=False)
    qty = db.Column(db.Integer, nullable=False)

    order = db.relationship("Order", back_populates="items")
