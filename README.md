## Prepare MySQL (Database)

- You can use **MySQL Server** or **XAMPP**

- Set your own database in `cftera/backend/database/mysql_config.json`
    ```json
    {
        "host"     : "your_localhost",
        "user"     : "your_user",
        "password" : "your_password",
        "database" : "your_schema",
        "port"     : "your_port",
        "charset"  : "utf8mb4"
    }
    ```

- Create relational database step by step with [database settings](/backend/database/README.md)

## Prepare Backend (FastAPI)

- Set your own FastAPI configuration in `cftera/backend/python/main.py`
    ```py
    if __name__ == "__main__":
        uvicorn.run(
            "main:app",
            host="127.0.0.1",
            port=3003,
            log_level="debug",
            reload=True
        )
    ```

## Prepare Frontend (Javascript)

- Change API on your frontend side, based on your backend config
    ```js
    const api ='http://127.0.0.1:3003';
    ```

## How To Run

- Open Project  
    Open folder `cftera` in VSCode

- Open Command Prompt in Administrator Mode  *(if you use MySQL Server)*  
    - Start MySQL Server *(if you want to start)*
        ```sh
        net start MySQL80
        ```
    - Stop MySQL Server *(if you want to stop)*
        ```sh
        net stop MySQL80
        ```

- Open XAMPP and start MySQL *(if you use XAMPP)*

- Start Backend **FastAPI**
    - Run `main.py` in VSCode Terminal  
    - And URL will be served

