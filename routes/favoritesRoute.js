// Needed Resources
const express = require("express")
const router = require("express").Router()
const favoritesController = require("../controllers/favoritesController")
const utilities = require("../utilities")

// Route to build favorites view
router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.buildFavorites)
)

// Route to add favorites
router.post("/add",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.addFavorite)
)

// Route to remove favorites
router.post("/delete",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.removeFavorite)
)

module.exports = router