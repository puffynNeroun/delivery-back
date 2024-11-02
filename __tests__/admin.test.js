const request = require('supertest');
const { app, server } = require('../server'); // Импортируем app и server

// Закрываем сервер после выполнения всех тестов
afterAll(() => {
    if (server) {
        server.close();
    }
});

describe('Admin API', () => {
    it('should get all users (admin only)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com', // Убедитесь, что админ существует в базе данных
                password: 'adminpassword',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');

        const token = res.body.token;
        const usersRes = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${token}`);
        expect(usersRes.statusCode).toEqual(200);
    });

    it('should delete a user (admin only)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'adminpassword',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');

        const token = res.body.token;
        const deleteRes = await request(app)
            .delete('/api/admin/users/12345') // Замените 12345 на действительный userId
            .set('Authorization', `Bearer ${token}`);
        expect(deleteRes.statusCode).toEqual(200);
    });
});
