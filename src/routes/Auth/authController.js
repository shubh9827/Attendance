const { schema } = require("./authValidations");
const {
  models: { Attendance, User, ListDate },
} = require("../../../lib/models");
const bcrypt = require("bcrypt");

class AuthController {
  async loginPage(req, res) {
    if (req.session.Email) {
      res.redirect("/Attendance/makeAttendance");
    }
    let isAdmin = undefined;
    const Email = req.body.Email;
    res.render("Auth/loginPage", { Email, isAdmin });
  }

  async logOut(req, res) {
    console.log("session is destroyed successfully");
    await req.session.destroy();
    res.redirect('/Auth');
  }

  async login(req, res, next) {
    let isAdmin = req.body.isAdmin;
    try {
      const result = await schema.validateAsync(req.body);
      const Email = result.Email;
      console.log("hello this is admin" + req.body.isAdmin);

      if (req.body.isAdmin == "on") {
        if (result.Email == "user@gmail.com" && result.Password == "user") {
          req.session.Email = result.Email;
          await req.flash(
            "success",
            "Welcome !! you have successfully logged in"
          );

          res.redirect("/Attendance/makeAttendance");
        } else {
          console.log(
            isAdmin + "OOOOOOOOOOOOOOOOOOOOOOOOOOONNNNNNNNNNNNNNNNNN"
          );
          await req.flash("error", "wrong!! credentials");

          res.locals.error = req.flash("error");
          res.render("Auth/loginPage", { Email, isAdmin });
        }
      } else {
        const user = await User.findOne({ email: result.Email });
        if (user) {
          const match = await bcrypt.compare(result.Password, user.password);
          if (match) {
            req.session._id = user._id;
            console.log(req.session._id + "req session id");

            res.redirect("/Attendance/makeAttendance");
          } else {
            req.flash("error", "password does not match");
            res.locals.error = req.flash("error");
            res.render("Auth/loginPage", { Email, isAdmin });
          }
        } else {
          req.flash("error", "Email did not match please check or register");
          res.locals.error = req.flash("error");
          res.render("Auth/loginPage", { Email, isAdmin });
        }
      }
    } catch (err) {
      const Email = req.body.Email;

      if (err.isJoi === true) {
        await req.flash("error", `${err}`);
        res.locals.error = req.flash("error");
        res.render("Auth/loginPage", { Email, isAdmin });
      }
      next(err);
    }
  }
}
module.exports = new AuthController();
