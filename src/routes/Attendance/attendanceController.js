const {
  models: { Attendance, User, ListDate },
} = require("../../../lib/models");
const bcrypt = require("bcrypt");
const Swal = require("sweetalert2");
const unix = require("unix-timestamp");
const Joi = require("joi");
var moment = require("moment");

const { schema } = require("./attendanceValidations");
const ListDates = require("../../../lib/models/models/ListDate");
const { findOneAndUpdate } = require("../../../lib/models/models/User");
class AttendanceController {
  // --------------------------------------------------- HOME PAGE-------------------------------------------------------------------------------------------------
  async homePage(req, res, next) {
    if (!req.session.Email) {
      res.redirect("/Auth");
    }

    res.render("attendance/home");
  }

  // ------------------------------------------------------ MAKE ATTENDANCE PAGE-------------------------------------------------------------------------------------
  async makeAttendance(req, res, next) {
    console.log(req.session.Email + "this is req session with Email");
    const _id= await req.session._id;
    console.log(req.session._id + "this is req session with id");
    if (!req.session._id && !req.session.Email) {
      res.redirect("/Auth");
      // return true;
    }

    const users = await User.find();
    const list = await ListDate.findOne();
    let datein;
    if (list.isAdmin == false) {
      let dateinp = new Date();
      dateinp = dateinp.setHours(0, 0, 0, 0);
      console.log(dateinp + "this is a dateinp");
      dateinp = new Date(dateinp);
      // dateinp=dateinp.getTime()+16200000
      console.log(dateinp + "this is a dateinp");
      // dateinp= new Date(dateinp)
      console.log(dateinp + "this is a dateinp");
      if(!req.session._id){
        req.flash("error","session not found please try again")
        res.redirect("/Auth");
      }else{
      console.log(req.session._id + "this is req session");

      const user = await User.findOne({ _id: _id });

      console.log(user);
      const att = await Attendance.findOne({
        date: { $gte: dateinp },
        email: user.email,
        outTime: null,
      });
      console.log(att + "this is attttttttttttttttt");
      if (att) {
        if (att.inTime && att.outTime == null) {
          datein = att.punchin;
          console.log("this is dateIn " + datein);
          res.locals.moment = moment;
          await res.render("attendance/makeAttendance", {
            datein,
            list,
            users,
            name: req.body.name,
            Email: req.body.Email,
            date: req.body.date,
            inTime: att.inTime,
            outTime: req.body.outTime,
          });
        } else {
          res.locals.moment = moment;
          await res.render("attendance/makeAttendance", {
            datein,
            list,
            users,
            name: req.body.name,
            Email: req.body.Email,
            date: req.body.date,
            inTime: att.inTime,
            outTime: req.body.outTime,
          });
        }
      } else {
        res.locals.moment = moment;
        await res.render("attendance/makeAttendance", {
          datein,
          list,
          users,
          name: req.body.name,
          Email: req.body.Email,
          date: req.body.date,
          inTime: req.body.inTime,
          outTime: req.body.outTime,
        });
      }
    } 
  }else {
      res.locals.moment = moment;
      await res.render("attendance/makeAttendance", {
        datein,
        list,
        users,
        name: req.body.name,
        Email: req.body.Email,
        date: req.body.date,
        inTime: req.body.inTime,
        outTime: req.body.outTime,
      });
    }
  

  }

  // ------------------------------------------------------ REGISTER ATTENDANCE POST REQ--------------------------------------------------------------------------------
  async registerAtten(req, res, next) {
    const list = await ListDate.findOne();
    try {
      if (list.isAdmin == false) {
        if (req.body.punchin) {
          const user = await User.findOne({ _id: req.session._id });
          console.log(user);

          let datein = req.body.punchin;
          datein = new Date(datein);
          let dateinp = datein.setHours(0, 0, 0, 0);
          dateinp = datein.getTime() + 16200000;

          dateinp = new Date(datein);
          console.log(dateinp + "this is date inp");

          let query = {};

          query = { date: { $gte: dateinp }, email: user.email, outTime: null };
          const att = await Attendance.findOne(query);
          console.log("djfbsajfbasj" + att);
          if (false) {
            console.log("pehle se maujud attendance k andar hun");
            datein = new Date(datein);
            let intime = new Date(req.body.punchin);
            att.inTime = intime.toLocaleTimeString("en-GB");
            console.log(att.inTime + "this is intime");
            att.isDeleted = false;
            req.flash("success", "Punchin updated!!");
            res.locals.success = req.flash("success");
            att.save();
            let inTime = att.inTime;
            res.locals.moment = moment;
            res.render("attendance/makeAttendance", {
              list,
              datein: req.body.punchin,
              inTime,
            });
          } else {
            const user = await User.findOne({ _id: req.session._id });
            console.log(
              user + req.session._id + "userId and something else with it"
            );
            console.log("jai ho inside first attendance");
            datein = req.body.punchin;
            datein = new Date(datein);
            let intime = datein.toLocaleTimeString("en-GB");
            console.log(
              intime +
                "iiiiiiiinnnnnnnnnnnntttttttttttiiiiiiiiiiiimmmmmmmmmmmmeeeeeeeeeeeee"
            );
            const obj = {
              name: user.name,
              email: user.email,
              date: datein,
              inTime: intime,
              outTime: null,
              punchin: req.body.punchin,
            };
            const result = new Attendance(obj);

            result.save();

            req.flash("success", "Punchin successful!!");
            res.locals.success = req.flash("success");
            let inTime = intime;
            res.locals.moment = moment;
            res.render("attendance/makeAttendance", {
              list,
              datein: req.body.punchin,
              inTime,
            });
          }
        } else {
          let dateout = req.body.punchout;
          console.log(req.body.punchout);
          let punchout = new Date(req.body.punchout);

          console.log(punchout + "this is punchout");
          dateout = new Date().setHours(0, 0, 0, 0);
          const user = await User.findOne({ _id: req.session._id });
          console.log(dateout + "this is datout");
          let query = {
            date: { $gte: dateout },
            email: user.email,
            outTime: null,
          };
          const att = await Attendance.findOne(query);
          console.log(
            att +
              "inside the dateout part and following is the attendance  " +
              att
          );
          console.log(punchout.toLocaleTimeString("en-GB"));
          att.outTime = punchout.toLocaleTimeString("en-GB");
          var startTime = moment(att.inTime, 'HH:mm:ss');
          var endTime = moment( att.outTime, 'HH:mm:ss');
          var duration = moment.duration(endTime.diff(startTime));
          var hours = parseInt(duration.asHours());
          var minutes = parseInt(duration.asMinutes()) % 60;
          let st = hours + " hour and " + minutes + " minutes.";
          att.duration=st;
          att.save();
          req.flash("success", "PunchOut Successful");
          console.log("afsadf");
          res.redirect("/Attendance/makeAttendance");
        }
      } else {
        let users = await User.find();
        if (req.body.name == "") {
          req.flash("error", "PLEASE!! SELECT A USER BEFORE REGISTER");
          res.locals.error = req.flash("error");
          res.render("attendance/makeAttendance", {
            list,
            users,
            name: req.body.name,
            email: req.body.email,
            date: req.body.date,
            inTime: req.body.inTime,
            outTime: req.body.outTime,
          });
        } else {
          const result = await schema.validateAsync(req.body);
          let din = req.body.date;
          din = new Date(din);
          din = din.getTime() - 19800000;
          din = new Date(din);
          console.log(
            din.getTime() +
              "khvjhvkjgvkhvhjvgfxdhzgfdzxdfg99999990000000000000088888888888888666666666666"
          );
          let dnow = new Date();
          console.log(dnow.getTime());
          if (din.getTime() > dnow.getTime()) {
            req.flash("error", "DATE CANNOT BE GREATER THAN THE CURRENT DATE");
            res.locals.error = req.flash("error");
            users.push(await User.findOne({ name: req.body.name }));
            res.render("attendance/makeAttendance", {
              list,
              users,
              name: req.body.name,
              email: req.body.email,
              date: req.body.date,
              inTime: req.body.inTime,
              outTime: req.body.outTime,
            });
          } else {
            const user = await User.findOne({ name: req.body.name });
            console.log(user.email);
            let str1 = result.inTime;
            let str2 = result.outTime;
            str1 = str1.split(":");
            str2 = str2.split(":");

            let totalSeconds1 = parseInt(str1[0] * 3600 + str1[1] * 60);
            let totalSeconds2 = parseInt(str2[0] * 3600 + str2[1] * 60);
            let attdate = req.body.date;

            attdate = new Date(attdate);
            attdate = attdate.getTime() - 19800000;
            attdate = new Date(attdate);
            console.log("attendance date is " + attdate);
            let ltattdate = attdate.getTime() + 86400000;
            ltattdate = new Date(ltattdate);
            console.log(ltattdate);
            if (totalSeconds1 < totalSeconds2) {
              // let found = await Attendance.findOne({
              //   email: user.email,
              //   date: { $gte: attdate, $lt: ltattdate },
              // });

              // if (found) {
              list.save();
              result.date = new Date(result.date);
              
                (result.name = req.body.name),
                (result.date = attdate),
                (result.inTime = req.body.inTime),
                (result.outTime = req.body.outTime),
                (result.email = user.email);
              result.isDeleted = false;
              var startTime = moment(result.inTime, "HH:mm:ss");
              var endTime = moment(result.outTime, "HH:mm:ss");
              let duration = moment.duration(
                endTime.diff(result.startTime)
              );
              var hours = parseInt(duration.asHours());

              var minutes = parseInt(duration.asMinutes()) % 60;

              let st = hours + " hour and " + minutes + " minutes.";
              result.duration = st;
              // result.save();
              // req.flash("success", "ATTENDANCE! UPDATED SUCCESSFULLY");
              // res.redirect("/Attendance/makeAttendance");
              // } else {
              // result.email = user.email;
              // result.date = attdate;
              const modelvar = new Attendance(result);
              modelvar.save();
              req.flash("success", "Attendance Submitted Successfully!");
              console.log("dfsa");
              res.redirect("/Attendance/makeAttendance");
              // }
            } else {
              users.push(await User.findOne({ name: req.body.name }));
              req.flash(
                "error",
                "intime should  be smaller than the leaving time"
              );
              res.locals.error = req.flash("error");

              
              res.render("attendance/makeAttendance", {
                list,
                users,
                name: req.body.name,
                Email: req.body.Email,
                date: req.body.date,
                inTime: req.body.inTime,
                outTime: req.body.outTime,
              });
            }
          }
        }
      }
    } catch (err) {
      if ((Joi.isError = true)) {
        const users = await User.find();
        users.push(await User.findOne({ name: req.body.name }));

        req.flash("error", `${err}`);
        res.locals.error = req.flash("error");
        await res.render("attendance/makeAttendance", {
          list,
          users,
          name: req.body.name,
          Email: req.body.Email,
          date: req.body.date,
          inTime: req.body.inTime,
          outTime: req.body.outTime,
        });
      }

      next(err);
    }
  }
  //--------------------------------------------------------------------------LIST DATE------------------------------------------------------------------------------

  async date(req, res) {
    let Listdate = await ListDate.findOne({ _id: "64883bf9fa9f348fe3f7b65f" });

    if (req.body.month && !req.body.date) {
      let month = req.body.month;
      let newDate = new Date();
      newDate = newDate.toLocaleDateString();
      console.log(newDate + "this is the new date after the locale string ");

      let newDateday = newDate.slice(0, 2);
      console.log(newDateday + "newDateday ");
      let newDateMonth = newDate.slice(3, 5);
      console.log(newDateMonth + "newDateMonth ");
      let newDateYear = newDate.slice(5, 10);
      console.log(newDateYear + "newDatedYear ");
      //  let requiredMonthYear= month.concat(newDateYear);
      let requiredMonthYear = month + "/" + "1/" + newDateYear;
      console.log(requiredMonthYear + "this is the required month year");
      requiredMonthYear = new Date(requiredMonthYear);
      console.log(requiredMonthYear + "requiredMonthYear ");
      Listdate.month = new Date(requiredMonthYear).setHours(0, 0, 0, 0);

      Listdate.save();

      req.flash("success", "Month is  Selected");
      //  res.locals.success= req.flash("success");
      //  res.render('attendance/list',{Listdate});
      res.redirect("/Attendance/listPage");
    } else {
      console.log(
        "jhhcsjhaskjhbkcazhcbjcbvkhfbaslhvlhusb; jblhcxb;zjcvblhzB lzxjcvblzxhvbzlxcjbhxvbzchvxl ."
      );
      if (req.body.date && !req.body.month) {
        if (Listdate) {
          let din = req.body.date;
          console.log(req.body.date + "this is date iside the req body");
          din = new Date(din);
          console.log("this is the inpdate" + din);
          din = din.getTime() - 19800000;
          din = new Date(din);
          console.log(
            din +
              "khvjhvkjgvkhvhjvgfxdhzgfdzxdfg99999990000000000000088888888888888666666666666"
          );
          let dnow = new Date();
          console.log(dnow.getTime());
          if (din.getTime() > dnow.getTime()) {
            req.flash("error", "DATE CANNOT BE GREATER THAN THE CURRENT DATE");
            //  res.locals.error= req.flash("error")
            //   res.render('attendance/list',{date,month})
            res.redirect("/Attendance/listPage");
          } else {
            Listdate.date = din;
            console.log(Listdate.date + "====================");
            Listdate.save();
            let date = Listdate.date;
            let month = Listdate.month;
            console.log(
              date +
                "999999999999999999999999999999999999999999999999999999999999999999999"
            );
            req.flash("success", "Date is Selected");
            //  res.locals.success= req.flash("success");
            //  res.render('attendance/list',{date,month});
            res.redirect("/Attendance/listPage");
          }
        } else {
          const date = {
            date: req.body.date,
          };
          const result = new ListDate(date);

          result.save();

          res.redirect("/Attendance/listPage");
        }
      } else {
        if (req.body.date && req.body.month) {
          if (Listdate) {
            let din = req.body.date;

            din = new Date(din);
            console.log(
              din.getTime() +
                "khvjhvkjgvkhvhjvgfxdhzgfdzxdfg99999990000000000000088888888888888666666666666"
            );
            let dnow = new Date();
            console.log(dnow.getTime());
            if (din.getTime() > dnow.getTime()) {
              req.flash(
                "error",
                "DATE CANNOT BE GREATER THAN THE CURRENT DATE"
              );
              //  res.locals.error= req.flash("error")
              //   res.render('attendance/list',{date,month})
              res.redirect("/Attendance/listPage");
            } else {
              Listdate.date = new Date(req.body.date);
              console.log(Listdate.date + "====================");
              Listdate.month = null;
              Listdate.save();
              let date = Listdate.date;
              let month = Listdate.month;
              console.log(
                date +
                  "999999999999999999999999999999999999999999999999999999999999999999999"
              );
              req.flash("success", "Date is Selected");
              //  res.locals.success= req.flash("success");
              //  res.render('attendance/list',{date,month,Listdate});
              res.redirect("/Attendance/listPage");
            }
          } else {
            const date = {
              date: req.body.date,
            };
            const result = new ListDate(date);

            result.save();

            res.redirect("/Attendance/listPage");
          }
          
        } else {
          req.flash(
            "error",
            "PLEASE!! ENTER A DATE  OR MONTH WHILE SUBMITTING"
          );
          // res.locals.error= req.flash("error");
          res.redirect("/Attendance/listPage");
        }
      }
    }
  }

  //----------------------------------------------------------------DATE DELETE----------------------------------------------------------------------------------------------

  async delete(req, res) {
    const listdate = await ListDate.findOne({
      _id: "64883bf9fa9f348fe3f7b65f",
    });
    listdate.date = null;
    listdate.month = null;
    listdate.save();
    res.redirect("/Attendance/listPage");
  }

  //--------------------------------------------------------------LIST PAGE--------------------------------------------------------------------------------------------------------
  async listPage(req, res, next) {
    if (!req.session._id && !req.session.Email) {
      res.redirect("/Auth");
    }

    const Listdate = await ListDate.findOne();
    let value;
    let date;
    if (Listdate.month) {
      switch (Listdate.month.getMonth() + 1) {
        case 1:
          value = "JANUARY";

          res.render("attendance/list", { Listdate, value, date });
          break;
        case 2:
          value = "FEBRUARY";

          res.render("attendance/list", { Listdate, value, date });
          break;
        case 3:
          value = "MARCH";
          res.render("attendance/list", { Listdate, value, date });
          break;
        case 4:
          value = "APRIL";
          res.render("attendance/list", { Listdate, value, date });
          break;
        case 5:
          value = "MAY";
          res.render("attendance/list", { Listdate, value, date });
          break;
        case 6:
          value = "JUNE";
          res.render("attendance/list", { Listdate, value, date });
          break;

        case 7:
          value = "JULY";
          res.render("attendance/list", { Listdate, value, date });
          break;
        case 8:
          value = "AUGUST";
          res.render("attendance/list", { Listdate, value, date });
          break;
        case 9:
          value = "SEPTEMBER";
          res.render("attendance/list", { Listdate, value, date });
          break;
        case 10:
          value = "OCTOBER";
          res.render("attendance/list", { Listdate, value, date });
          break;
        case 11:
          value = "NOVEMBER";
          res.render("attendance/list", { Listdate, value, date });
          break;
        case 12:
          value = "DECEMBER";
          res.render("attendance/list", { Listdate, value, date });
          break;

        default:
          value = "no month chosen";
          res.render("attendance/list", { Listdate, value, date });
      }
    } else {
      if (Listdate.date) {
        value = "choose a month..";
        date = Listdate.date
          .toLocaleDateString("en-GB")
          .split("/")
          .reverse()
          .join("-");

        res.render("attendance/list", { Listdate, value, date });
      } else {
        res.render("attendance/list", { Listdate, value, date });
      }
    }
  }
  //--------------------------------------------------------------ACCOUNT DELETE-----------------------------------------------------------------------------------
  async accdelete(req, res) {
    const _id = req.params._id;
    const attendie = await Attendance.findOne({ _id: _id });
    attendie.isDeleted = true;
    const del = attendie.isDeleted;

    attendie.save();
    req.flash("success", "attendance deleted successfully");
    res.redirect("/Attendance/listPage");
  }
  //--------------------------------------------------------------DEL-CHECKS----------------------------------------------------------------------------
  async delchecks(req, res) {
    console.log(req.body);
    if (req.body.ss == "") {
      req.flash("error", "please select attendies before deletion");
      res.redirect("/Attendance/listPage");
    } else {
      let arr = [];
      arr = req.body.ss;
      console.log("arr" + arr);
      let arr1 = arr.split(",");
      if (arr1[0] == "on") {
        arr1.shift();
      }
      arr1.forEach(async (item) => {
        const res = await Attendance.findOne({ _id: item });

        res.isDeleted = true;
        res.save();
        console.log(res);
      });
      req.flash("success", "data deleted successfully");
      res.redirect("/Attendance/listPage");
    }
  }

  //---------------------------------------------------------------LIST---------------------------------------------------------------------------------
  async list(req, res) {
    console.log(req.session._id + "session id");
    let reqData = req.query;

    console.log(req.query, "----------------");
    let inpdate = await ListDate.findOne();
    let columnNo = parseInt(reqData.order[0].column);
    console.log(columnNo);
    let sortOrder = reqData.order[0].dir === "desc" ? -1 : 1;

    let query = {};
    let comparedate = new Date(inpdate.month);
    comparedate = comparedate.setMonth(comparedate.getMonth() + 1);
    let ltd;
    const user = await User.findOne({ _id: req.session._id });

    if (inpdate.isAdmin == true) {
      if (inpdate.date !== null) {
        ltd = inpdate.date.getTime() + 86400000;
        ltd = new Date(ltd);
        console.log(ltd + "this is the list input date +1 day");
        console.log(
          inpdate.date + "this is the input date date taken from dates"
        );
        query = {
          name: { $ne: null },
          isDeleted: false,
          date: { $gte: inpdate.date, $lt: ltd },
        };
      } else if (inpdate.month !== null) {
        query = {
          name: { $ne: null },
          date: { $gte: new Date(inpdate.month), $lt: new Date(comparedate) },
          isDeleted: false,
        };
      } else {
        query = {
          name: { $ne: null },
          date: { $ne: null },
          isDeleted: false,
        };
      }
    } else {
      
      if (inpdate.date !== null) {
        ltd = inpdate.date.getTime() + 86400000;
        ltd = new Date(ltd);
        query = {
          name: { $ne: null },
          isDeleted: false,
          email: user.email,
          date: { $gte:inpdate.date, $lt: ltd },
        };
      } else if (inpdate.month !== null) {
        query = {
          name: { $ne: null },
          date: { $gte: new Date(inpdate.month), $lt: new Date(comparedate) },
          isDeleted: false,
          email: user.email,
        };
      } else {
        query = {
          name: { $ne: null },
          date: { $ne: null },
          isDeleted: false,
          email: user.email,
        };
      }
    }

    if (reqData.search.value) {
      const searchValue = new RegExp(
        reqData.search.value
          .split(" ")
          .filter((val) => val)
          .map((value) => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"))
          .join("|"),
        "i"
      );

      query.$or = [{ name: searchValue }, { email: searchValue }];
    }

    let sortCond = { created: sortOrder };
    let response = {};
    switch (columnNo) {
      case 0:
        sortCond = {
          skip: sortOrder,
        };
        break;

      case 1:
        sortCond = {
          name: sortOrder,
        };
        break;
      case 5:
        sortCond = {
          date: sortOrder,
        };
        break;
      default:
        sortCond = { date: sortOrder };
        break;
    }

    const count = await Attendance.countDocuments(query);
    response.draw = 0;
    if (reqData.draw) {
      response.draw = parseInt(reqData.draw) + 1;
    }
    response.recordsTotal = count;
    response.recordsFiltered = count;
    let skip = parseInt(reqData.start);
    let limit = parseInt(reqData.length);
    let attendies = await Attendance.find(query)

      .sort(sortCond)
      .skip(skip)
      .limit(limit)
      .lean();
    console.log("attendies");
    console.log(query);
    if (attendies) {
      attendies = attendies.map((attendie) => {
        let actions = "";

        actions = `${actions} <input id="hi" class="form-check-input" name="checks" type="checkbox" value="${attendie._id}" >`;

        actions = `${actions}<a class="ItemDelete" id="some" confirm_message="Are you sure you want to delete ${attendie.name} attendance" href="/Attendance/accdelete/${attendie._id}" title="Delete"><i class="fa fa-trash-o" style="font-size:24px; margin-left:20px"></i>  </a>`;

        actions = `${actions}<a href="/Attendance/view/${attendie._id}" title="view"><i class="icofont-user"></i></a>`;
        attendie.date = attendie.date.toLocaleDateString();
        // attendie.inTime=attendie.inTime.toLocaleTimeString('en-US')
        // attendie.outTime=attendie.outTime.toLocaleTimeString('en-US')

        return {
          0: (skip += 1),
          1: attendie.name,
          2: attendie.email,
          3: attendie.inTime,
          4: attendie.outTime,
          5: attendie.date,
          6: attendie.duration,
          7: actions,
        };
      });
    }
    response.data = attendies;
    return res.send(response);
  }
}
module.exports = new AttendanceController();
7

