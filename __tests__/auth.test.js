const request = require('supertest');
const { app, server } = require('../server');
const User = require('../models/User');

// Очищаем базу данных перед каждым тестом
beforeEach(async () => {
    await User.deleteMany({});
});

// Закрываем сервер после выполнения всех тестов
afterAll(() => {
    if (server) {
        server.close();
    }
});

describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
        await User.create({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
        });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Пользователь с таким email уже существует');
    });

    it('should login a user', async () => {
        await User.create({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
