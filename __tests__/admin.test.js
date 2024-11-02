const request = require('supertest');
const app = require('../server');

describe('Admin API', () => {
    let adminToken;

    beforeAll(async () => {
        // Логинимся как админ для получения токена
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com', // Предварительно создайте администратора в базе данных
                password: 'adminpassword',
            });

        adminToken = res.body.token;
    });

    it('should get all users (admin only)', async () => {
        const res = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should delete a user (admin only)', async () => {
        const userToDelete = 'userIdToDelete'; // Укажите ID пользователя для удаления
        const res = await request(app)
            .delete(`/api/admin/users/${userToDelete}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User removed');
    });
});
