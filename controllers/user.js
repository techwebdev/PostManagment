const validator = require("validator");
const User = require("../models/User");
const passport = require("passport");

exports.getLogin = (req, res, next) => {
  try {
    if (req.user) {
      return res.redirect("/");
    }
    res.render("Auth/Login", {
      title: "Login",
    });
  } catch (error) {
    console.log({ error });
    return next(error);
  }
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("Auth/Signup", { title: "Signup" });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  let { email, password } = req.body;
  if (!validator.isEmail(email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  email = validator.normalizeEmail(email, { gmail_remove_dots: false });
  passport.authenticate("local", (err, user, info) => {
    console.log({ user, info });
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/auth/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", [{ msg: "Success! You are logged in." }]);
      res.redirect(req.session.returnTo || "/");
    });
  })(req, res, next);
};

exports.postSignUp = async (req, res, next) => {
  try {
    const validationErrors = [];
    console.log({ body: req.body.first_name });
    let { first_name, last_name, email, password } = req.body;
    if (validator.isEmpty(first_name))
      validationErrors.push({
        msg: "Please Enter First Name",
      });

    if (validator.isEmpty(last_name))
      validationErrors.push({
        msg: "Please Enter Last Name",
      });

    if (!validator.isEmail(email))
      validationErrors.push({ msg: "Please enter a valid email address." });

    if (!validator.isLength(password, { min: 8 }))
      validationErrors.push({
        msg: "Password must be at least 8 characters long",
      });

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      validationErrors.push({
        msg: `Email ${email} is already exist. Enter another Email`,
      });
    }
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/auth/signup");
    }
    email = validator.normalizeEmail(email, { gmail_remove_dots: false });
    email = email.toLowerCase();

    await User.create({
      first_name,
      last_name,
      email,
      password,
    });
    req.flash("success", [{ msg: "User registered successfully" }]);

    return res.redirect("/auth/login");
  } catch (error) {
    console.log({ error });
    return next(error);
  }
};

exports.logout = (req, res) => {
  req.logout();

  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;

    res.redirect("/");
  });
};
