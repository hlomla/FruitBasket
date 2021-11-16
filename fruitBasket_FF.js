const { Pool } = require("pg");

module.exports = function FruitBasket(pool) {

    async function insertFruit(fruit,quantity,price) {
            var fruitExits = await pool.query('select fruit_name from fruit_basket where fruit_name=$1', [fruit]);
            if(fruitExits.rowCount === 0){
                await pool.query('INSERT INTO fruit_basket(fruit_name, quantity, price) values($1, $2, $3)', [fruit, quantity, price]);
            }     
    }

    async function updateFruits(fruit,qty){
        await pool.query(`Update fruit_basket SET quantity = quantity + ${qty} where fruit_name=$1`,[fruit]);
        var quantity = await pool.query('select fruit_name from fruit_basket where fruit_name = $1', [fruit])
        return quantity.rows[0]
    }

    async function allFruits() {
      var fruitsEntered = await pool.query('select fruit_name,quantity,price from fruit_basket');
      return fruitsEntered.rows
  
    }
    
    async function allFruitsTotal() {
        var totalBasket = await pool.query('select sum(price*quantity) AS total_price from fruit_basket');
        return totalBasket.rows[0];   
    }

    async function specificFruitTotal(){
        var specificBasketTotal = await pool.query('select fruit_name, sum(price*quantity) AS total_fruit_price from fruit_basket group by fruit_name');
        return specificBasketTotal.rows[0];  
    }

    return {
        insertFruit,
        updateFruits,
        allFruits,
        allFruitsTotal,
        specificFruitTotal
    }
}
