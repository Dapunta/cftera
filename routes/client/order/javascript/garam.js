const key = 'fppweb2024dapunta';

async function getIpAddress() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}

function getIncrement() {
    let increment = 0;
    for (let i = 0; i < key.length; i++) increment += key.charCodeAt(i);
    return increment;
}

function encrypt(string) {
    const increment = getIncrement();
    let raw = '';
    for (let i = 0; i < string.length; i++) raw += String.fromCharCode(string.charCodeAt(i) + increment);
    const result = btoa(encodeURIComponent(raw));
    return result;
}

function decrypt(string) {
    const increment = getIncrement();
    const raw = decodeURIComponent(atob(string));
    let result = '';
    for (let i = 0; i < raw.length; i++) result += String.fromCharCode(raw.charCodeAt(i) - increment);
    return result;
}

async function yoNdakTau(payload) {
    let ip;
    try {ip = await getIpAddress();}
    catch {ip = 'unknown';}
    const data = JSON.stringify(payload);
    const timestamp = Math.floor(Date.now() / 1000);
    const str_format = `${encrypt(data.toString())}|${encrypt(ip.toString())}|${encrypt(timestamp.toString())}`;
    const encrypted_string = btoa(encodeURIComponent(str_format));
    console.log(encrypted_string);
}

function decryptorPayload(string) {
    const raw = decodeURIComponent(atob(string)).split('|');
    const rew = raw.map(decrypt);
    const payload = JSON.parse(rew[0]);
    const ip = rew[1];
    const timestamp = parseInt(rew[2]);
    console.log(payload);
    console.log(ip);
    console.log(timestamp);
}

const payload = {
    "pesanan": {
        "GUL0000004": {
            "count": 1,
            "price": 24000
        },
        "RDG0000001": {
            "count": 2,
            "price": 28000
        },
        "RWN0000002": {
            "count": 1,
            "price": 32000
        },
        "STK0000003": {
            "count": 1,
            "price": 36000
        }
    },
    "meja": "A4",
    "payment": "BYR01"
}

const enc_string = 'SlVSQkpVSTBKVVE1SlRsQ0pVUkJKVUU1SlVSQkpUbEZKVVJCSlVGREpVUkJKVGxCSlVSQkpVRTNKVVJCSlRsQkpVUkJKVUUzSlVRNUpUbENKVVE1SlVJekpVUkJKVUkwSlVRNUpUbENKVVJCSlRnd0pVUkJKVGhGSlVSQkpUZzFKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGRUpVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQkpVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZDSlVRNUpVRkVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUTVKVUUxSlVRNUpUbENKVVJCSlRoQ0pVUTVKVUpFSlVSQkpUZ3dKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGQkpVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQ0pVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZDSlVRNUpVSXhKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUTVKVUUxSlVRNUpUbENKVVJCSlRoQ0pVUkJKVGt3SlVSQkpUZzNKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGQ0pVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQkpVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZESlVRNUpVRkNKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUTVKVUUxSlVRNUpUbENKVVJCSlRoREpVUkJKVGhFSlVSQkpUZzBKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGREpVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQkpVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZESlVRNUpVRkdKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUkJKVUkySlVRNUpVRTFKVVE1SlRsQ0pVUkJKVUUySlVSQkpUbEZKVVJCSlVFekpVUkJKVGxCSlVRNUpUbENKVVE1SlVJekpVUTVKVGxDSlVRNUpVSkJKVVE1SlVGRUpVUTVKVGxDSlVRNUpVRTFKVVE1SlRsQ0pVUkJKVUU1SlVSQkpUbEJKVVJCSlVJeUpVUkJKVUUySlVSQkpUbEZKVVJCSlVFM0pVUkJKVUZFSlVRNUpUbENKVVE1SlVJekpVUTVKVGxDSlVRNUpVSkNKVVJCSlRreUpVUkJKVGhDSlVRNUpVRTVKVVE1SlVGQkpVUTVKVGxDSlVSQkpVSTIlN0NKVVE1SlVGQkpVUTVKVUl4SlVRNUpVRkNKVVE1SlVFM0pVUTVKVUZCSlVRNUpVRTNKVVE1SlVJeUpVUTVKVUl4SlVRNUpVRTNKVVE1SlVGQ0pVUTVKVUZESlVRNUpVRkIlN0NKVVE1SlVGQkpVUTVKVUl3SlVRNUpVRkRKVVE1SlVGQ0pVUTVKVUl5SlVRNUpVSXhKVVE1SlVGR0pVUTVKVUZESlVRNUpVSXlKVVE1SlVGRQ=='

async function test() {
    // await yoNdakTau(payload);
    decryptorPayload(enc_string);
}

test();