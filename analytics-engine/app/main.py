from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.routes import router as v1_router

# ── Create __init__.py files so Python treats directories as packages ───────
# (Created as empty files below — see the companion write calls)


def create_app() -> FastAPI:
    """
    FastAPI application factory.

    Using a factory function (rather than a bare module-level instance)
    makes the app easy to re-instantiate in tests with different configs.
    """
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Allow requests from the Express server and local dev client
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5000", "http://localhost:5173"],
        allow_methods=["POST", "GET"],
        allow_headers=["*"],
    )

    # Mount versioned routes
    app.include_router(v1_router, prefix="/api/v1")

    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"status": "ok", "service": settings.APP_NAME, "version": settings.APP_VERSION}

    return app


app = create_app()
