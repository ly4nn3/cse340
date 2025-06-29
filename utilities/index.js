const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data && data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/' + vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
            + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else { 
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetailView = async function(data) {
    let detail
    if(data) {
        detail = '<div class="vehicle-detail">'
        detail += '<img src="' + data.inv_image + '" alt="' + data.inv_make + ' ' + data.inv_model + ' car">'
        detail += '<div class="vehicle-info">'
        detail += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details</h2>'
        detail += '<h3 class="vehicle-price">Price: $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</h3>'
        detail += '<p class="vehicle-description"><span class="label">Description:</span> ' + data.inv_description + '</p>'
        detail += '<p class="vehicle-miles"><span class="label">Miles:</span> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
        detail += '<p class="vehicle-color"><span class="label">Color:</span> ' + data.inv_color + '</p>'
        detail += `<form action="/account/favorites/add" method="POST" class="add-favorite-form">
            <input type="hidden" name="inv_id" value="${data.inv_id}">
            <button type="submit" class="add-favorite">Add to Favorites</button>
        </form>`
        detail += '</div>'
        detail += '</div>'
    } else {
        detail = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return detail
}

/* **************************************
* Password Toggle Function
* ************************************ */
Util.togglePassword = function() {
    const password = document.getElementById("account_password");
    const showPasswordButton = document.getElementById("showPassword");

    if (showPasswordButton) {
        showPasswordButton.addEventListener("click", function() {
            if (password.type === "password") {
                password.type = "text";
                showPasswordButton.textContent = "Hide";
            } else {
                password.type = "password";
                showPasswordButton.textContent = "Show";
            }
        });
    }
}

/* **************************************
* Build classification list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* **************************************
* Build favorites list
* ************************************ */
Util.buildFavoritesList = async function(data) {
    let favoritesList = ""
    if (data.length > 0) {
        favoritesList = '<ul id="favorites-display">'
        data.forEach(vehicle => {
            favoritesList += '<li>'
            favoritesList += '<div class="favorite-vehicle">'
            // Vehicle image and link
            favoritesList += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}"></a>`
            
            // Vehicle details
            favoritesList += '<div class="favorite-details">'
            favoritesList += `<h2><a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}</a></h2>`
            favoritesList += `<p class="favorite-price">Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
            favoritesList += `<p>Color: ${vehicle.inv_color}</p>`
            
            // Remove from favorites form
            favoritesList += `<form action="/account/favorites/delete" method="POST">
                <input type="hidden" name="favorite_id" value="${vehicle.favorite_id}">
                <button type="submit" class="remove-favorite">Remove from Favorites</button>
            </form>`
            
            favoritesList += '</div>'
            favoritesList += '</div>'
            favoritesList += '</li>'
        })
        favoritesList += '</ul>'
    } else {
        favoritesList = '<p class="notice">You have no favorite vehicles.</p>'
    }
    return favoritesList
}

/* **************************************
* Middleware to check token validity
* ************************************ */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            }
        )
    } else {
        next()
    }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* **************************************
* Middleware to check account type
* ************************************ */
Util.checkAdminEmployee = (req, res, next) => {
    if (res.locals.loggedin) {
        const account_type = res.locals.accountData.account_type
        if (account_type === "Employee" || account_type === "Admin") {
            next()
        } else {
            req.flash("notice", "Please log in with appropriate account privileges.")
            return res.redirect("/account/login")
        }
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

module.exports = Util