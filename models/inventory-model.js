const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 *  Get vehicle by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getvehiclebyid " + error)
    }
}

/* ***************************
 *  Check for existing classification
 * ************************** */
async function checkExistingClassification(classification_name) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_name = $1"
        const classification = await pool.query(sql, [classification_name])
        return classification.rowCount
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const result = await pool.query(sql, [classification_name])
        return result.rowCount > 0 ? result.rows[0] : null
    } catch (error) {
        console.error("Add Classification error:", error)
        return null
    }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getVehicleById,
    checkExistingClassification,
    addClassification
}