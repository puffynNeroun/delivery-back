const request = require('supertest');
const app = require('../server');

describe('Cart API', () => {
    let userToken;

    beforeAll(async () => {
        // Логинимся как обычный пользователь для получения токена
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
                productId: 'productIdToAdd', // Укажите ID товара для добавления
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
                productId: 'productIdToRemove', // Укажите ID товара для удаления
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('items');
    });
});
