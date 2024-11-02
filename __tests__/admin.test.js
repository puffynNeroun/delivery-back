const request = require('supertest');
const { app, server } = require('../server');
const User = require('../models/User');
const Cart = require('../models/Cart');

// Очищаем базу данных перед каждым тестом
beforeEach(async () => {
    await User.deleteMany({});
    // Создаем администратора перед выполнением тестов
    await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpassword',
        isAdmin: true,
    });
    await Cart.deleteMany({});
});

// Закрываем сервер после выполнения всех тестов
afterAll(() => {
    if (server) {
        server.close();
    }
});

describe('Admin API', () => {
    let adminToken;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@example.com', password: 'adminpassword' });
        adminToken = res.body.token;

    });

    it('should get all users (admin only)', async () => {
        const usersRes = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(usersRes.statusCode).toEqual(200);
    });

    it('should delete a user (admin only)', async () => {
        const userToDelete = await User.create({
            name: 'User to Delete',
            email: 'delete@example.com',
            password: 'password123',
        });

        const deleteRes = await request(app)
            .delete(`/api/admin/users/${userToDelete._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(deleteRes.statusCode).toEqual(200);
    });
});
