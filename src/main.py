"""
PixelOffice AI Software House - FastAPI & WebSocket Server
Serves 2D Virtual Office UI and orchestrates AutoGen Multi-Agent Pipeline.
"""

import os
import sys
from pathlib import Path

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add project root and local virtualenv site-packages to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

venv_site_packages = PROJECT_ROOT / ".venv" / "Lib" / "site-packages"
if venv_site_packages.exists():
    sys.path.insert(0, str(venv_site_packages))

try:
    from fastapi import FastAPI, WebSocket, WebSocketDisconnect
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse, JSONResponse
    import uvicorn
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False

app = FastAPI(title="PixelOffice AI Software House", version="2.5.0") if HAS_FASTAPI else None

if app:
    # Mount Static Directories (css, js, config)
    css_dir = PROJECT_ROOT / "css"
    js_dir = PROJECT_ROOT / "js"
    config_dir = PROJECT_ROOT / "config"
    
    if css_dir.exists():
        app.mount("/css", StaticFiles(directory=str(css_dir)), name="css")
    if js_dir.exists():
        app.mount("/js", StaticFiles(directory=str(js_dir)), name="js")
    if config_dir.exists():
        app.mount("/config", StaticFiles(directory=str(config_dir)), name="config")

    @app.get("/")
    async def serve_index():
        index_file = PROJECT_ROOT / "index.html"
        return FileResponse(str(index_file))

    @app.get("/health")
    async def health_check():
        return {"status": "ok", "app": "PixelOffice AI Software House", "version": "2.5.0"}

    @app.websocket("/ws/telemetry")
    async def websocket_telemetry(websocket: WebSocket):
        await websocket.accept()
        try:
            while True:
                data = await websocket.receive_text()
                await websocket.send_text(f"[Telemetry Echo] {data}")
        except WebSocketDisconnect:
            pass


def _run_builtin_server(port: int = 8000):
    """Zero-dependency HTTP server fallback using standard library."""
    import http.server
    import socketserver
    
    os.chdir(str(PROJECT_ROOT))
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("127.0.0.1", port), handler) as httpd:
        print(f"🌐 Built-in Web Server running on http://127.0.0.1:{port} ...")
        httpd.serve_forever()


def main():
    print("=" * 60)
    print("🏢 PixelOffice AI Software House (Google Campus Vibe)")
    print(f"📁 Project Root: {PROJECT_ROOT}")
    print("=" * 60)
    
    if HAS_FASTAPI:
        print("🚀 Starting FastAPI Server on http://localhost:8000 ...")
        uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)
    else:
        print("🚀 Starting Built-in Web Server on http://localhost:8000 ...")
        _run_builtin_server(port=8000)


if __name__ == "__main__":
    main()
