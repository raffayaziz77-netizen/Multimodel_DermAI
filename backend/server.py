import os

import uvicorn

try:
    from .app import app
except ImportError:  # pragma: no cover
    from app import app


def _env_bool(name: str, default: str = "0") -> bool:
    return os.environ.get(name, default).strip().lower() in {"1", "true", "yes", "y"}


if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0").strip() or "0.0.0.0"
    port = int(os.environ.get("PORT", "8000"))
    reload = _env_bool("RELOAD", "0")
    log_level = os.environ.get("LOG_LEVEL", "info").strip() or "info"

    uvicorn.run(app, host=host, port=port, reload=reload, log_level=log_level)
