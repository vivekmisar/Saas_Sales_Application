# FastAPI & Express.js Integration: Interview Guide

This guide is designed to help you confidently explain your project's architecture, specifically how your **Express.js** backend interacts with your **FastAPI** analytics engine. Review this before your interview to ensure you can clearly articulate your design decisions and the core concepts of both technologies.

---

## 1. High-Level Architecture (The "Why")

**Question you might get:** *"Why did you use both Express.js and FastAPI? Why not just do everything in Node.js or Python?"*

**Your Answer:**
Our project uses a **microservices-oriented** approach to play to the strengths of both ecosystems:
*   **Express.js (Node.js):** Acts as the primary backend server. It handles client requests, authentication, database operations (MongoDB), file uploads (via Multer), and overall business orchestration. Node.js is excellent for I/O bound tasks and handling many concurrent requests.
*   **FastAPI (Python):** Acts as an internal, specialized **Data Analytics Engine**. Python has a vastly superior ecosystem for data manipulation (Pandas, NumPy). We offloaded the heavy, CPU-bound data processing to this separate service so it wouldn't block the Node.js event loop.

---

## 2. How Express & FastAPI Communicate (The Flow)

**Question you might get:** *"Walk me through how the Express server talks to the FastAPI server."*

**Your Answer:**
The communication happens synchronously via standard **HTTP requests (REST)** over the local network (or internal VPC in production).

**Step-by-step Flow:**
1.  **Client Upload:** The client uploads a CSV file to the Express server.
2.  **Express Handles I/O:** Express uses `multer` to save the file to the local disk and creates a "pending" report document in MongoDB.
3.  **Express Calls FastAPI:** The `report.controller.js` uses `axios` to make a synchronous `POST` request to the FastAPI endpoint (`http://localhost:8000/api/v1/analyze`).
    *   *Crucial detail:* Express does **not** send the actual file contents over the network. It only sends a JSON body containing the `file_path` on the disk.
4.  **FastAPI Processes Data:** The FastAPI server receives the path, reads the CSV directly from the disk using `pandas`, runs complex analytics computations, and returns the computed KPIs as a pure JSON payload.
5.  **Express Finalizes:** Express receives the JSON response, updates the report status to "completed" in MongoDB, saves the analytics data, and returns the final result to the client.

*Design Decision Justification:* We chose synchronous HTTP processing for simplicity. Because the CSV files are relatively small (under 10MB), keeping the request open is acceptable. For massive files, we would have implemented an asynchronous event-driven approach (e.g., RabbitMQ or Redis queues with polling or WebSockets).

---

## 3. Key FastAPI Terms You MUST Know

If the interviewer zeroes in on your Python/FastAPI knowledge, you should comfortably drop these terms and explain how you used them:

### A. FastAPI
A modern, fast (high-performance) web framework for building APIs with Python based on standard Python type hints. It's built on top of **Starlette** (for the web parts) and **Pydantic** (for the data parts).

### B. Pydantic & Data Validation
*   **What it is:** A data validation and parsing library that uses Python type hinting.
*   **How you used it:**
    *   **Request/Response Schemas:** In your `schemas/request.py` and `schemas/response.py`, you define classes (like `AnalyzeRequest` and `AnalyticsResult`). FastAPI automatically validates incoming JSON against these schemas and throws a clear 422 Unprocessable Entity error if the data is wrong.
    *   **Configuration (`config.py`):** You used `pydantic_settings.BaseSettings` to load environment variables safely, ensuring types are correct at startup.

### C. Type Hinting
*   **What it is:** Specifying the expected data types of variables, arguments, and return values (e.g., `def create_app() -> FastAPI:`).
*   **Why it matters:** FastAPI relies on these heavily. It uses them to generate automatic API documentation and perform validation without requiring extra validation code.

### D. Uvicorn & ASGI
*   **What it is:** Uvicorn is an **ASGI** (Asynchronous Server Gateway Interface) web server implementation for Python.
*   **Why it matters:** While WSGI (like Gunicorn) is synchronous and traditional in Python, ASGI allows for asynchronous, non-blocking code. FastAPI requires an ASGI server like Uvicorn to run efficiently.

### E. APIRouter
*   **What it is:** A tool to split your application into multiple files and group related endpoints.
*   **How you used it:** Instead of putting all routes in `main.py`, you used `APIRouter()` in `api/v1/routes.py`. `main.py` just imports this router and mounts it using `app.include_router(v1_router, prefix="/api/v1")`.

### F. Swagger UI & ReDoc (Auto-Documentation)
*   **What it is:** Out of the box, FastAPI automatically generates interactive API documentation based on your routes and Pydantic schemas.
*   **How to access it:** If asked, mention you can go to `http://localhost:8000/docs` to see Swagger UI, which allows you to test endpoints right from the browser.

### G. Separation of Concerns (Service Layer Pattern)
*   **How you structured it:** In `api/v1/routes.py`, the route handler (`def analyze`) owns **zero business logic**. It simply calls `csv_reader.load_and_validate()` and `analytics.compute()`. This makes your code highly testable and modular.

### H. CORS (Cross-Origin Resource Sharing)
*   **What it is:** A security feature.
*   **How you used it:** In `main.py`, you added `CORSMiddleware` to explicitly allow requests coming from `http://localhost:5000` (Express) and your frontend dev server, ensuring the browser/client doesn't block the requests.

---

## 4. Potential "Gotcha" Questions to Prepare For

1.  **"What happens if the FastAPI server goes down?"**
    *   *Answer:* The Express `axios` call will fail. We wrap it in a `try/catch` block. If it fails, Express catches the error, updates the report status to "failed" in MongoDB, and safely returns an error response to the client without crashing the Node.js server.
2.  **"Why pass the file path instead of the file itself over HTTP?"**
    *   *Answer:* Since both services are running on the same server/filesystem, sending a string (the file path) over localhost is vastly faster and consumes less memory than streaming the entire binary file contents over an HTTP connection.
3.  **"How do you handle security with the file path?"**
    *   *Answer:* In our `config.py`, we have a `UPLOADS_BASE_DIR` setting. Before FastAPI reads a file, it should theoretically verify that the incoming path starts with this trusted directory to prevent **Path Traversal** attacks (e.g., someone passing `../../etc/passwd`).

Good luck! You've built a solid, professional-grade microservice architecture. Just speak confidently about why you separated the concerns and how the data flows between the two servers.
