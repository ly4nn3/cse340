const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Add Clasification Data Validation Rules
  * ********************************* */
 validate.classificationRules = () => {
    return [
        // classfification_name is reuqired, must be string
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please provide a classification name.") // message sent on error
        .matches(/^[A-Za-z]+$/)
        .withMessage("Classification name can only contain alphabetical characters.") // message sent on error
        .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClassification(classification_name)
            if (classExists) {
                throw new Error("Classification name already exists.")
            }
        })
    ]
 }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
                errors,
                title: "Add New Classification",
                nav,
                classification_name,
            })
            return
        }
    next()
}

module.exports = validate