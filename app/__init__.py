from flask import Flask, request
from app.config import Config
from app.db import db
from app.i18n import get_t


def create_app():
    app = Flask(__name__, static_folder="../public/assets", static_url_path="/assets")
    app.config.from_object(Config)

    db.init_app(app)

    from flask_migrate import Migrate
    Migrate(app, db)

    # Import models so Flask-Migrate detects them
    from app import models  # noqa: F401

    # Blueprints
    from app.blueprints.shop import bp as shop_bp
    from app.blueprints.catalog import bp as catalog_bp
    from app.blueprints.checkout import bp as checkout_bp
    from app.blueprints.orders import bp as orders_bp
    from app.blueprints.ecpay import bp as ecpay_bp

    app.register_blueprint(shop_bp)
    app.register_blueprint(catalog_bp)
    app.register_blueprint(checkout_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(ecpay_bp)

    @app.context_processor
    def inject_i18n():
        lang = request.cookies.get("cuore-lang", "zh-TW")
        if lang not in ("zh-TW", "en"):
            lang = "en"
        return {"t": get_t(lang), "lang": lang}

    return app
