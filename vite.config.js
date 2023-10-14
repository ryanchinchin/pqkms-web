import { defineConfig } from 'vite'
import * as fs from 'fs';

const SSL_PRIVATE_KEY=`${__dirname}/localhost.key`;
const SSL_PUBLIC_KEY=`${__dirname}/localhost.crt`;

console.log(`Using TLS Private key : ${SSL_PRIVATE_KEY}`);
console.log(`Using TLS Public key  : ${SSL_PUBLIC_KEY}`);

const sslOptions = {
    key : fs.readFileSync(SSL_PRIVATE_KEY),
    cert : fs.readFileSync(SSL_PUBLIC_KEY)
};

// https://vitejs.dev/config/
export default defineConfig({
    base: '/pqkms-web/',
    server : {
	port : 8443,
	host : "0.0.0.0",
	https : sslOptions
    }
})
