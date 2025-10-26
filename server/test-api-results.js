const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...');

    // Тестируем endpoint получения результатов тестов
    const baseURL = 'http://localhost:3000';

    // Сначала нужно получить токен авторизации
    console.log('🔐 Testing login...');
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com', // Замените на реальный email
        password: 'password123', // Замените на реальный пароль
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed, trying to register...');

      const registerResponse = await fetch(`${baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        console.log('❌ Registration failed:', errorData);
        return;
      }

      console.log('✅ Registration successful');
    } else {
      console.log('✅ Login successful');
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;

    if (!token) {
      console.log('❌ No token received');
      return;
    }

    console.log('🔑 Token received:', token.substring(0, 20) + '...');

    // Тестируем получение профиля
    console.log('👤 Testing profile endpoint...');
    const profileResponse = await fetch(`${baseURL}/auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Profile data:', profileData);
    } else {
      console.log('❌ Profile request failed:', profileResponse.status);
    }

    // Тестируем получение результатов тестов
    console.log('📊 Testing test results endpoint...');
    const resultsResponse = await fetch(`${baseURL}/auth/test-results`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (resultsResponse.ok) {
      const resultsData = await resultsResponse.json();
      console.log('✅ Test results:', resultsData);
    } else {
      console.log('❌ Test results request failed:', resultsResponse.status);
      const errorData = await resultsResponse.json();
      console.log('Error details:', errorData);
    }
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testAPI();
