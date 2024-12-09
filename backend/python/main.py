#--> Default
import uvicorn
from typing import List, Dict
from pathlib import Path

#--> All Apps
from app.client.get_menu import get_all_menu
from app.client.validate_order import decrypted_data, add_order
from app.client.get_invoice import get_invoice
from app.admin.edit_menu import edit_menu
from app.admin.fetch_order import get_all_order
from app.admin.edit_order import edit_status_by_id, delete_order_by_id
from app.admin.login import login, reverse_token

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
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

#--> Cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            if order_file_path.exists(): content = order_file_path.open("r", encoding="utf-8").read()
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
            invoice_file_path = Path("routes/client/invoice/index.html")
            if invoice_file_path.exists(): content = invoice_file_path.open("r", encoding="utf-8").read()
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

#--> [Kasir] Display Login Page
@app.get("/login", response_class=HTMLResponse)
async def route_login() -> HTMLResponse:  
    try:
        login_file_path = Path("routes/kasir/login/index.html")
        if login_file_path.exists(): content = login_file_path.open("r", encoding="utf-8").read()
        else: content = error()
    except Exception as e: content = error()
    return HTMLResponse(content=content, media_type="text/html; charset=utf-8")

#-->[Kasir] Verif Login By User Pass
@app.post('/login_verification', response_class=JSONResponse)
async def route_login_verification(request:Request):
    data = await request.json()
    username = data.get('username', None)
    password = data.get('password', None)
    try:
        if username and password: response = login(username, password)
        else: response = {'status':'failed', 'message':'invalid params', 'data':{}}
    except Exception as e: response = {'status':'failed', 'message':str(e), 'data':{}}
    return JSONResponse(content=response, status_code=200)

#--> [Kasir] Verif Login By Token
@app.post('/token_verification', response_class=JSONResponse)
async def routetoken_verification(request:Request):
    data = await request.json()
    token = data.get('token', None)
    try:
        if token: response = reverse_token(token)
        else: response = {'status':'failed', 'message':'invalid params', 'data':{}}
    except Exception as e: response = {'status':'failed', 'message':str(e), 'data':{}}
    return JSONResponse(content=response, status_code=200)

#--> [Kasir] Display Dashboard Page
@app.get("/dashboard", response_class=HTMLResponse)
async def get_dashboard_page(request:Request) -> HTMLResponse:  
    try:
        token = request.cookies.get("token", None)
        status_token = reverse_token(token)
        if token and status_token['status'] == 'success':
            dashboard_file_path = Path("routes/kasir/dashboard/index.html")
            if dashboard_file_path.exists(): content = dashboard_file_path.open("r", encoding="utf-8").read()
            else: content = error()
        else: return RedirectResponse(url="/login")
    except Exception as e: content = error()
    return HTMLResponse(content=content)

#--> [Kasir] Edit Menu
@app.post("/edit_menu", response_class=JSONResponse)
async def route_edit_menu(request:Request):
    data = await request.json()
    try:
        token = request.cookies.get("token", None)
        status_token = reverse_token(token)
        if token and status_token['status'] == 'success':
            response = edit_menu(data)
        else: response = {'status':'failed', 'data':{}}
    except Exception as e: response = {'status':'failed', 'data':{}}
    return JSONResponse(content=response, status_code=200)

#--> [Kasir] Fetch Order
@app.get("/get_order", response_model=List[Dict])
async def get_order(request:Request):
    try:
        token = request.cookies.get("token", None)
        status_token = reverse_token(token)
        if token and status_token['status'] == 'success':
            result = get_all_order()
        else: result = []
    except Exception as e: result = []
    return JSONResponse(content=result)

#--> [Kasir] Edit Status Order
@app.post("/edit_status_order", response_class=JSONResponse)
async def route_edit_order(request:Request):
    data = await request.json()
    try:
        token = request.cookies.get("token", None)
        status_token = reverse_token(token)
        if token and status_token['status'] == 'success':
            response = edit_status_by_id(data['id_pesanan'], data['status'])
        else: response = {'status':'failed', 'data':{}}
    except Exception as e: response = {'status':'failed', 'data':{}}
    return JSONResponse(content=response, status_code=200)

#--> [Kasir] Delete Order
@app.post("/delete_order", response_class=JSONResponse)
async def route_delete_order(request:Request):
    data = await request.json()
    try:
        token = request.cookies.get("token", None)
        status_token = reverse_token(token)
        if token and status_token['status'] == 'success':
            deleted = delete_order_by_id(data['id_pesanan'])
            if deleted: response = {'status':'success'}
            else: response = {'status':'failed'}
        else: response = {'status':'failed'}
    except Exception as e: response = {'status':'failed'}
    return JSONResponse(content=response, status_code=200)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=3003,
        log_level="debug",
        reload=True
    )