let assert = require("assert");
const fruits = require('../fruitBasket_FF')
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/my_fruit_basket';

const pool = new Pool({
    connectionString
});

const theFruitBasket = fruits(pool);


describe('The Fruit Basket function', function () {

    beforeEach(async function () {
        await pool.query("delete from fruit_basket");
    });



    it('should insert a apple fruit and the amount it costs', async function () {
        await theFruitBasket.insertFruit("Apple", 1, '1.50')

        let fruitsName = await theFruitBasket.allFruits()

        assert.deepEqual(fruitsName, [{
            fruit_name: 'Apple',
            price: '1.50',
            quantity: 1
        }
        ]);

    });
    it('should insert a orange fruit and the amount it costs', async function () {

        await theFruitBasket.insertFruit('Orange', 1, '1.25')

        let fruitsName = await theFruitBasket.allFruits()

        assert.deepEqual(fruitsName, [{
            fruit_name: 'Orange',
            price: '1.25',
            quantity: 1
        }]);

    });
    it('should insert a grape fruit and the amount it costs', async function () {

        await theFruitBasket.insertFruit('Grape', 1, '1.00')

        let fruitsName = await theFruitBasket.allFruits()

        assert.deepEqual(fruitsName, [{
            fruit_name: 'Grape',
            price: '1.00',
            quantity: 1
        }]);

    });
    it('should return the total amount for all fruits in basket', async function () {


        await theFruitBasket.insertFruit('Grape', 1, '10.00');
        await theFruitBasket.insertFruit('Pineapple', 1, '15.50');
        await theFruitBasket.insertFruit('Banana', 1, '7.50');
        await theFruitBasket.insertFruit('Kiwi', 1, '2.00')

        await theFruitBasket.allFruitsTotal();

        assert.deepEqual({ total_price: '35.00' }, await theFruitBasket.allFruitsTotal());
    });
    it('should return the total amount for all fruits in basket when a new fruit is added', async function () {


        await theFruitBasket.insertFruit('Grape', 2, '10.00');
        await theFruitBasket.insertFruit('Pineapple', 2, '15.50');
        await theFruitBasket.insertFruit('Banana', 1, '7.50');
        await theFruitBasket.insertFruit('Kiwi', 1, '2.00')
        await theFruitBasket.insertFruit('Pear', 1, '5.00')

        await theFruitBasket.allFruitsTotal();

        assert.deepEqual({ total_price: '65.50' }, await theFruitBasket.allFruitsTotal());
    });

    it('should return the total updated quantity value in fruit basket when there was no fruit added', async function () {


        await theFruitBasket.insertFruit('Pawpaw', 0, '25.00');

        await theFruitBasket.updateFruits('Pawpaw', 5);

        let updated = await theFruitBasket.allFruits();

        assert.deepEqual(updated, [{
            fruit_name: 'Pawpaw',
            price:'25.00',
            quantity: 5
        }]);
    });
    it('should return the total updated quantity value in fruit basket when there was 2 fruits already and more fruits was added', async function () {


        await theFruitBasket.insertFruit('Berries', 2, '15.00');

        await theFruitBasket.updateFruits('Berries', 4);

        let updated = await theFruitBasket.allFruits();

        assert.deepEqual(updated, [{
            fruit_name: 'Berries',
            price:'15.00',
            quantity: 6
        }]);
    });
    it('should return the specific total for all the Grapes in the basket once updated with one more Grape', async function () {

        await theFruitBasket.insertFruit('Grape', 1, '10.00');

        await theFruitBasket.updateFruits('Grape', 3);


        assert.deepEqual({ fruit_name: 'Grape', total_fruit_price: '40.00' }, await theFruitBasket.specificFruitTotal());
    });
    it('should return the total for Paw-Paw fruit in the basket once updated with additional quantity of Paw-Paws', async function () {


        await theFruitBasket.insertFruit('Pawpaw', 1, '25.00');

        await theFruitBasket.updateFruits('Pawpaw', 4);

        assert.deepEqual({ fruit_name: 'Pawpaw', total_fruit_price: '125.00' }, await theFruitBasket.specificFruitTotal());
    });
});
