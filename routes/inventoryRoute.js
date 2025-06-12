// Needed Resources
const addValidate = require("../utilities/inventory-validation")
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to add classification
router.post("/add-classification",
    addValidate.classificationRules(),
    addValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId));

module.exports = router;