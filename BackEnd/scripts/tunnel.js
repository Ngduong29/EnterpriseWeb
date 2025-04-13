const ngrok = require('ngrok');
require('dotenv').config();


(async function () {
    try {
        const url = await ngrok.connect({
            addr: 5000,
            authtoken: process.env.NGROK_AUTH_TOKEN,
            hostname: 'doe-trusted-basically.ngrok-free.app',
        });

        console.log(`✅ Ngrok tunnel opened at: ${url}`);
    } catch (err) {
        console.error('❌ Failed to start ngrok:', err.message);
        process.exit(1);
    }
})();
