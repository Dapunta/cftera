const api ='http://127.0.0.1:3003';
let data_kasir = {'id_kasir':0, 'name':null, 'status':null, 'token':null};

// Listen Input

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

usernameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        readInput();
    }
});

// Loading Spinner

function loading(element_id, active) {
    const loadingBox = document.getElementById(element_id);
    if (active)  {
        loadingBox.innerHTML = `<div id="loading-spinner" class="spinner-container"><div class="spinner"></div></div>`;
        loadingBox.style.pointerEvents = 'none';
    }
    else {
        loadingBox.innerHTML = `Login`;
        loadingBox.style.pointerEvents = 'all';
    }
}

// Ganti Visibilitas Kolom Input Password

function changeEyePassword(stat) {
    const password_input = document.getElementById('password');
    if (password_input.type == 'password') {
        password_input.type = 'text';
        stat.className = 'fa-solid fa-eye-slash';
    }
    else {
        password_input.type = 'password';
        stat.className = 'fa-solid fa-eye';
    }
}

// Baca Input

async function readInput() {
    const username = document.getElementById('username').value.replace(/\s/g, '');
    const password = document.getElementById('password').value.replace(/\s/g, '');
    if (username != '' && password != '') {
        const login_success = await fetchLogin(username, password);
        if (login_success) {
            window.location.href = `${api}/dashboard`;
        }
    }
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Fetch Username Password

async function fetchLogin(username, password) {
    let is_success = false;
    loading('submit-login-button', true);

    try {
        const fetch_login_url = `${api}/login_verification`;
        const headers = {'Content-Type':'application/json'};
        const data = {
            'method'  : 'POST',
            'mode'    : 'cors',
            'headers' : headers,
            'body'    : JSON.stringify({"username":username, "password":password})
        };
        const req = await fetch(fetch_login_url, data);
        const response = await req.json();

        if (response.status == 'success') {
            await saveSession(response.data);
            is_success = true;
        }
        else {
            displayErrorLog(response.message);
        }
    }
    catch (e) {
        console.log(e);
        displayErrorLog(e);
    }

    loading('submit-login-button', false);
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    return(is_success);
}

// Show Error Log

function displayErrorLog(message) {
    const response_login_box = document.getElementById('response-login');
    response_login_box.innerHTML = `<span>${message}</span>`;
}

// Session

let session_var = 'session';

async function saveSession(data) {

    // LocalStorage
    localStorage.removeItem(session_var);
    localStorage.setItem(session_var, JSON.stringify(data));

    // Cookie
    const cok = document.cookie.split(";");
    for (let cookie of cok) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; path=/; SameSite=Strict`;
    }
    document.cookie = `token=${data.token}; path=/; SameSite=Strict`;
}

async function loadSession() {
    const session_data = localStorage.getItem(session_var);
    return session_data ? JSON.parse(session_data) : {'id_kasir':0, 'name':null, 'status':null, 'token':null};
}

// Cek Token

async function checkToken() {
    const session_data = await loadSession();
    if (session_data.id_kasir != 0) {
        const is_token_active = await fetchToken(session_data.token);
        if (is_token_active) {
            window.location.href = `${api}/dashboard`;
        }
        else {
            localStorage.removeItem(session_var);
        }
    }
}

// Fetch Token

async function fetchToken(token) {
    let is_token_active = false;

    try {
        const fetch_token_url = `${api}/token_verification`;
        const headers = {'Content-Type':'application/json'};
        const data = {
            'method'  : 'POST',
            'mode'    : 'cors',
            'headers' : headers,
            'body'    : JSON.stringify({"token":token})
        };
        const req = await fetch(fetch_token_url, data);
        const response = await req.json();

        if (response.status == 'success') {
            await saveSession(response.data);
            is_token_active = true;
        }
    }
    catch (e) {
        console.log(e);
    }
    return(is_token_active);
}

// Initiator

async function main() {
    await checkToken();
}

main();