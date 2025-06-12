const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.invId
  const data = await invModel.getVehicleById(vehicle_id)
  const grid = await utilities.buildVehicleDetailView(data[0])
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data[0].inv_year + " " +data[0].inv_make + " " + data[0].inv_model,
    nav,
    grid,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const regResult = await invModel.addClassification(classification_name)

  if (regResult) {
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont