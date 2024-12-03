#--> Default
import os, json, uvicorn
from typing import List, Dict
from pathlib import Path
from urllib.parse import quote

#--> All Apps
from app.utils.connect_db import get_db_connection
from app.client.get_menu import get_all_menu
from app.client.validate_order import decrypted_data, add_order
from app.client.get_invoice import get_invoice

#--> Debugger
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
# logger = logging.getLogger('uvicorn.error')
# logger.setLevel(logging.DEBUG)

#--> FastAPI
from fastapi import FastAPI, Request
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

#--> [Client] Display Order Page
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

#--> [Client] Fetch All Menu
@app.get("/get_menu", response_model=List[Dict])
async def get_menu():
    try: result = get_all_menu()
    except Exception as e: result = []
    return JSONResponse(content=result)

#--> [Client] Create Order
@app.post("/create_order", response_class=JSONResponse)
async def create_order(request:Request):
    payload = {}
    body = await request.json()
    token = body.get('token',None)

    if token:

        #--> Decrypt Token
        try: payload = decrypted_data(token)
        except Exception as e: return(JSONResponse(content={"status":"failed", "message":f"Bad Token : {str(e)}", "data":{}}, status_code=400))

        #--> Buat Pesanan
        try:
            buat_pesanan = add_order(payload)
            if buat_pesanan['status'] == 'success':
                return(JSONResponse(content={"status":"success", "message":"Token received", "data":{"id_pesanan":buat_pesanan['id_pesanan']}}, status_code=200))
            else:
                return(JSONResponse(content={"status":"failed", "message":"Spam", "data":{}}, status_code=400))
        except Exception as e: return(JSONResponse(content={"status":"failed", "message":f"Bad Proccess : {str(e)}", "data":{}}, status_code=400))

    else:
        return(JSONResponse(content={"status":"failed", "message":"Token not provided", "data":{}}, status_code=400))

#--> [Client] Display Invoice Page
@app.get("/invoice", response_class=HTMLResponse)
async def get_invoice_page(id:str=None) -> HTMLResponse:
    if not id or str(id).strip() == '': return RedirectResponse(url="/")
    else:
        try:
            order_file_path = Path("routes/client/invoice/index.html")
            if order_file_path.exists(): content = order_file_path.open().read()
            else: content = error()
        except Exception as e: content = error()
        return HTMLResponse(content=content)

#--> [Client] Fetch Invoice Data
@app.get("/get_invoice")
async def fetch_invoice(id:str=None):
    if not id or str(id).strip() == '':
        return(JSONResponse(content={"status":"failed", "message":"Invoice not provided", "data":{}}, status_code=400))
    else:
        try:
            response = get_invoice(id)
            return(JSONResponse(content=response, status_code=200))
        except Exception as e: return(JSONResponse(content={"status":"failed", "message":f"Bad Proccess : {str(e)}", "data":{}}, status_code=400))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=3003,
        log_level="debug",
        reload=True
    )