import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///dev.db"
    ).replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    ECPAY_MERCHANT_ID = os.getenv("ECPAY_MERCHANT_ID", "2000132")
    ECPAY_HASH_KEY = os.getenv("ECPAY_HASH_KEY", "5294y06JbISpM5x9")
    ECPAY_HASH_IV = os.getenv("ECPAY_HASH_IV", "v77hoKGq4kWxNNIS")
    ECPAY_API_URL = os.getenv(
        "ECPAY_API_URL",
        "https://payment-stage.ecpay.com.tw/Cashier/AioCheckout/V5",
    )

    SITE_URL = os.getenv("SITE_URL", "http://localhost:5000").rstrip("/")
    USE_SECURE_COOKIES = (
        os.getenv("FLASK_ENV") == "production"
        or SITE_URL.startswith("https://")
    )

    RESEND_API_KEY = os.getenv("RESEND_API_KEY")
    NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL")
    NOTIFY_FROM = os.getenv(
        "NOTIFY_FROM", "Cuore Coffee Orders <onboarding@resend.dev>"
    )

    CATALOG_PATH = os.path.join(
        os.path.dirname(__file__), "..", "data", "catalog", "menu.json"
    )
