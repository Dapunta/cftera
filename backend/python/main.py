#--> Default
import os, json, uvicorn
from typing import List, Dict
from pathlib import Path
from urllib.parse import quote

#--> All Apps
from app.utils.connect_db import get_db_connection
from app.client.get_menu import get_all_menu

#--> Logging
import logging
logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

#--> FastAPI
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.responses import JSONResponse
from fastapi.responses import ORJSONResponse
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
app = FastAPI()

#--> Public Mount
app.mount("/routes", StaticFiles(directory="routes"), name="routes")
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
app.mount("/static", StaticFiles(directory="static"), name="static")

#--> Error Page
def error():
    text = 'Maaf Terjadi Kesalahan'
    return(text)

#--> [Client] Fetch All Menu
@app.get("/get_menu", response_model=List[Dict])
async def get_menu():
    try: result = get_all_menu()
    except Exception as e: result = []
    return JSONResponse(content=result)

#--> [Client] Order Page
@app.get("/order", response_class=HTMLResponse)
async def get_order_page(meja:str=None) -> HTMLResponse:  
    if not meja or str(meja).strip() == '': return RedirectResponse(url="/")
    else:
        try:
            order_file_path = Path("routes/client/order/index.html")
            if order_file_path.exists(): content = order_file_path.open().read()
            else: content = error()
        except Exception as e: content = error()
        return HTMLResponse(content=content)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=3003,
        log_level="debug",
        reload=True
    )