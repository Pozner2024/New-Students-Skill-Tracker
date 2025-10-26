const fetch = require('node-fetch');

async function debugProfileAPI() {
  const baseURL = 'http://localhost:5000';

  console.log('🔍 Debugging Profile API...');

  try {
    // Тест 1: Проверяем, что сервер запущен
    console.log('\n1️⃣ Testing server availability...');
    const healthResponse = await fetch(`${baseURL}/`);
    console.log('Server Status:', healthResponse.status);

    // Тест 2: Регистрация
    console.log('\n2️⃣ Testing registration...');
    const testEmail = `debug${Date.now()}@example.com`;
    const registerResponse = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: '123456',
      }),
    });

    console.log('Register Status:', registerResponse.status);
    const registerData = await registerResponse.json();
    console.log('Register Response:', registerData);

    if (!registerData.access_token) {
      console.log('❌ No token received, stopping tests');
      return;
    }

    // Тест 3: GET profile
    console.log('\n3️⃣ Testing GET /auth/profile...');
    const getProfileResponse = await fetch(`${baseURL}/auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${registerData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('GET Profile Status:', getProfileResponse.status);
    const getProfileData = await getProfileResponse.json();
    console.log('GET Profile Response:', getProfileData);

    // Тест 4: PUT profile (основной тест)
    console.log('\n4️⃣ Testing PUT /auth/profile...');
    console.log('Request URL:', `${baseURL}/auth/profile`);
    console.log('Request Method: PUT');
    console.log('Request Headers:', {
      Authorization: `Bearer ${registerData.access_token}`,
      'Content-Type': 'application/json',
    });
    console.log(
      'Request Body:',
      JSON.stringify({
        fullName: 'Тестовый Пользователь',
        groupNumber: 'ГР-2024-01',
      }),
    );

    const putProfileResponse = await fetch(`${baseURL}/auth/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${registerData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Тестовый Пользователь',
        groupNumber: 'ГР-2024-01',
      }),
    });

    console.log('PUT Profile Status:', putProfileResponse.status);
    console.log(
      'PUT Profile Headers:',
      Object.fromEntries(putProfileResponse.headers.entries()),
    );

    const putProfileData = await putProfileResponse.json();
    console.log('PUT Profile Response:', putProfileData);

    if (putProfileResponse.status === 404) {
      console.log(
        '❌ 404 Error - Route not found. Check if server is restarted and routes are registered.',
      );
    } else if (putProfileResponse.status === 405) {
      console.log(
        '❌ 405 Error - Method not allowed. Check if PUT method is properly configured.',
      );
    } else if (putProfileResponse.status === 500) {
      console.log('❌ 500 Error - Internal server error. Check server logs.');
    }
  } catch (error) {
    console.error('❌ Debug Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Server is not running. Start it with: npm run start:dev');
    }
  }
}

debugProfileAPI();
