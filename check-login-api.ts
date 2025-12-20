
async function main() {
    console.log('Testing login API...');
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'juan@ejemplo.com',
                password: 'password123'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response body:', data);

        const cookies = response.headers.get('set-cookie');
        console.log('Set-Cookie header:', cookies ? 'Present' : 'Missing');
        if (cookies) console.log('Cookie content:', cookies);

    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

main();
