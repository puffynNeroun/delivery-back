const request = require('supertest');
const { app, server } = require('../server'); // Импортируем app и server

// Закрываем сервер после выполнения всех тестов
afterAll(() => {
    if (server) {
        server.close();
    }
});

describe('Cart API', () => {
    let userToken;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        userToken = res.body.token;
    });

    it('should add a product to the cart', async () => {
        const res = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                productId: 'productIdToAdd',
                quantity: 1,
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('items');
    });

    it('should get the cart', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('items');
    });

    it('should remove a product from the cart', async () => {
        const res = await request(app)
            .post('/api/cart/remove')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                productId: 'productIdToRemove',
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('items');
    });
});
