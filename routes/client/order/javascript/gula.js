async function generateKey() {
    const key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true, // Kunci dapat diekspor
        ["encrypt", "decrypt"]
    );
    return key;
}

async function decryptData(encryptedString, key) {
    // Decode the Base64-encoded encrypted string
    const decodedData = atob(encryptedString); // Decode from Base64 to string
    const encryptedData = JSON.parse(decodedData); // Parse the decoded string to JSON object

    // Extract the IV and ciphertext
    const iv = new Uint8Array(encryptedData.iv); // Convert IV to a Uint8Array
    const ciphertext = new Uint8Array(encryptedData.ciphertext); // Convert ciphertext to a Uint8Array

    // Decrypt the ciphertext using AES-GCM
    try {
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            ciphertext
        );

        // Decode the decrypted buffer back to a string
        const decoder = new TextDecoder();
        const decryptedText = decoder.decode(decryptedBuffer);

        // Split the decrypted string into the original components (payload, timestamp, ipAddress, key)
        const [payloadStr, timestamp, ipAddress, keyStr] = decryptedText.split("|");

        const payload = JSON.parse(payloadStr); // Parse the JSON payload
        const keyParsed = JSON.parse(keyStr); // This is the key (not needed for normal decryption, but part of original string)

        return {
            payload: payload,
            timestamp: timestamp,
            ipAddress: ipAddress,
            key: keyParsed, // This is the key used for encryption (just for completeness)
        };

    } catch (err) {
        console.error("Decryption failed:", err);
        throw new Error("Decryption failed");
    }
}

// Example of calling the decryption function
async function testDecryption() {
    const encryptedString = "eyJpdiI6WzUwLDIwNyw2LDEzOSw0MiwyMDMsMTQsNDcsMTcwLDIwNiwxNzAsMTYwXSwiY2lwaGVydGV4dCI6WzIwOSw2NCwxNzIsMzksMTkyLDgxLDEwMCwxMzUsMjI5LDM4LDE3NSwxNzYsMTUzLDE1OSwxNjUsMTQxLDIzOSwxMDMsNjUsMTE0LDIyNCw4OCwzMywxNTYsMTYyLDE5NiwxNjcsOTYsMjI4LDk0LDIwNCwyMzAsMjI0LDIwNSwxNDksMTEyLDEwNywxMzcsMTQ2LDE5NSwyNDksNDMsMTQ3LDk1LDU5LDkwLDE1Nyw4LDIsNDcsNDksMTQ3LDgyLDE2MSwzMywyMTcsMTQwLDY2LDk3LDIzMyw3NSw1Niw0MSw2LDkxLDE1NiwxMTAsMjMwLDE0Nyw3NiwyMjUsMjksMTU4LDQ3LDE0Myw1NCwzNiwyNDIsMTE5LDQyLDEwNywxOSwyMjAsNjYsMTEsNTAsMTQxLDIsMTUyLDM0LDE2Miw1NywxMTUsMTU5LDE1MywxNzgsMTM0LDE3OSw1MywxMzcsMTA3LDk4LDYyLDEwNiwxNjYsOCwyMCw4NCw5MCwxNjQsMTQyLDE0NCwxNjEsMTYxLDE1NCwyMDAsMTA2LDQ1LDU2LDEwNSwzMSwxMzAsMTksOTUsMjE3LDEzMSwyOSwyMjMsMzMsMTAzLDE4NSwyMTQsMjAyLDg4LDYwLDE3NiwyNTAsMTgzLDE4NSwyMTUsMTg1LDE2MSwxOSwyMzIsMjEsMjUxLDIzMywyMDksMjU1LDIyMSw3LDUyLDExMCwyMDksMSw3NSwyMSwxODEsMiw5NCw1MiwyMCwzOCwxNCwxNjQsMTQsMTQzLDE1NCwyMDEsOTcsMTk2LDE0Miw2Myw1NSwxNTMsMTA4LDEzNiwyMjIsNTMsMCwyMDYsMjA3LDEzNSwxNjgsMjIxLDIyNiwyMzYsMTE3LDQ5LDQ5LDE3LDI4LDExNiwyMzQsMjUxLDExNSwxMTMsNzMsNzAsMzcsMTc4LDE1NSwxMDQsNTQsMjAsNDcsMTQ5LDExNCwyMTYsMTc3LDMsMzUsMTkwLDIzMCwyNTMsMjE0LDY4XX0"; // Replace with the actual Base64 encoded string
    const key = await generateKey(); // This is just for testing, replace with the actual key used during encryption

    try {
        const decryptedData = await decryptData(encryptedString, key);
        console.log("Decrypted Data:", decryptedData);
    } catch (err) {
        console.log("Error:", err);
    }
}

// Test the decryption with your encrypted data
testDecryption();
