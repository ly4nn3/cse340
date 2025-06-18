const pool = require("../database/")

/* ***************************
* Get all favorites by account_id
* ************************** */
async function getFavoritesByAccountId(account_id) {
    try {
        const sql = `SELECT f.*, i.*
            FROM favorites f
            JOIN inventory i
            ON f.inv_id = i.inv_id
            WHERE f.account_id = $1
            ORDER BY f.date_added DESC`
        const result = await pool.query(sql, [account_id])
        return result.rows
    } catch (error) {
        console.error("getFavoritesByAccountId error " + error)
        return null
    }
}

/* ***************************
* Add new favorites
* ************************** */
async function addFavorite(account_id, inv_id) {
    try {
        const sql = "INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *"
        const result = await pool.query(sql, [account_id, inv_id])
        return result.rows[0]
    } catch (error) {
        console.error("addFavorite error " + error)
        return null
    }
}

/* ***************************
* Delete favorite
* ************************** */
async function deleteFavorite(favorite_id) {
    try {
        const sql = "DELETE FROM favorites WHERE favorite_id = $1"
        const result = await pool.query(sql, [favorite_id])
        return result.rowCount
    } catch (error) {
        console.error("deleteFavorite error " + error)
        return null
    }
}

/* ***************************
* Check for existing favorites
* ************************** */
async function checkExistingFavorite(account_id, inv_id) {
    try {
        const sql= "SELECT * FROM favorites WHERE account_id = $1 AND inv_id = $2"
        const result = await pool.query(sql, [account_id, inv_id])
        return result.rowCount
    } catch (error) {
        console.error("checkExistingFavorite error " + error)
        return null
    }
}

module.exports = {
    getFavoritesByAccountId,
    addFavorite,
    deleteFavorite,
    checkExistingFavorite
}