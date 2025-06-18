const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities")

/* ***************************
* Build favorites list view
* ************************** */
async function buildFavorites(req, res, next) {
    try {
        let nav = await utilities.getNav()
        const account_id = res.locals.accountData.account_id
        const data = await favoritesModel.getFavoritesByAccountId(account_id)
        const favoritesList = await utilities.buildFavoritesList(data)

        res.render("account/favorites", {
            title: "My Favorites",
            nav,
            favoritesList,
            errors: null,
        })
    } catch (error) {
        console.error("buildFavorites error: " + error)
        req.flash("notice", "Sorry, there was an error processing your favorites.")
        res.status(500).render("account/favorites", {
            title: "My Favorites",
            nav,
            favoritesList: "",
            errors: null,
        })
    }
}

/* ***************************
* Process add to favorites
* ************************** */
async function addFavorite(req, res) {
    let nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id
    const inv_id = parseInt(req.body.inv_id)

    try {
        const exists = await favoritesModel.checkExistingFavorite(account_id, inv_id)
        
        if (exists) {
            req.flash("notice", "Vehicle is already in favorites.")
            return res.redirect("/account/favorites")
        }

        const addResult = await favoritesModel.addFavorite(account_id, inv_id)

        if (addResult) {
            req.flash("notice", "Vehicle has been added to favorites.")
            return res.redirect("/account/favorites")
        } else {
            req.flash("notice", "Sorry, failed to add to favorites.")
            return res.redirect("/account/favorites")
        }
    } catch (error) {
        console.error("addFavorite error: " + error)
        req.flash("notice", "Sorry, there was an error processing your request.")
        return res.redirect("/account/favorites")
    }
}

/* ***************************
* Process remove from favorites
* ************************** */
async function removeFavorite(req, res) {
    let nav = await utilities.getNav()
    const favorite_id = parseInt(req.body.favorite_id)

    const deleteResult = await favoritesModel.deleteFavorite(favorite_id)

    if (deleteResult) {
        req.flash("notice", "Vehicle has been removed from favorites.")
        res.redirect("/account/favorites")
    } else {
        req.flash("notice", "Sorry, failed to remove from favorites.")
        res.status(501).render("account/favorites", {
            title: "My Favorites",
            nav,
            errors: null,
        })
    }
}

module.exports = {
    buildFavorites,
    addFavorite,
    removeFavorite
}