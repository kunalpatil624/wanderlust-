const { model } = require("mongoose");
const User = require("../models/user");

module.exports.renderSignupForm = (req, res) =>
{
    res.render("./users/signup.ejs");
};

module.exports.userSignup = async(req, res, next) =>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let registerdUser = await User.register(newUser, password);
        console.log(registerdUser);

        req.login(registerdUser, (err) => {
            if(err){
               return next(err);
            };
            req.flash("success", "Wellcome to wanderlust!");
            res.redirect("/listings");
        });
    
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.userLogin = async(req, res) =>{
    req.flash("success", "wellcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.userlogout = (req, res, next) =>{
    req.logout((err) => {
        if(err){
            next(err);
        };

        req.flash("success", "you are logout success!");
        res.redirect("/listings");
    })
};