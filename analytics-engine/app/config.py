from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables.

    Using Pydantic Settings gives us:
    - Automatic env-var reading (no scattered os.getenv calls)
    - Type coercion and validation at startup
    - A single source of truth for all config

    Defaults are development-safe values.
    """

    APP_NAME: str = "SalesIntel Analytics Engine"
    APP_VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    # Trusted base directory for CSV files.
    # The Express server sends absolute paths; we verify the path
    # starts with this prefix to prevent path-traversal attacks.
    UPLOADS_BASE_DIR: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


# Module-level singleton — import this everywhere instead of re-instantiating
settings = Settings()
