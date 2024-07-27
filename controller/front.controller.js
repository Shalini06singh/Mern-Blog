const blogModel = require("../models/blog.model");
const userModel = require("../models/user.model");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const { transporter } = require("../transporter");
const index = async (req, res) => {
  let isUserAuthenticated = req.session.user ? true : false;

  let blogs = await blogModel.find({ status: 1 });

  res.render("front/index", { isUserAuthenticated, blogs });
};

const detail = async (req, res) => {
  let isUserAuthenticated = req.session.user ? true : false;
  // console.log(req.params.id);
  try {
    let blog = await blogModel.findOne({ _id: req.params.id });
    let isUserAuthenticated = req.session.user ? true : false;
    // console.log(blog);
    res.render("front/detail", { isUserAuthenticated, blog });
  } catch (error) {
    res.redirect("/");
  }
};

const login = (req, res) => {
  let isUserAuthenticated = req.session.user ? true : false;
  // console.log(req.session);

  let error = req.session.error;
  let success = req.session.success;
  let message = req.session.message;
  let errors = req.session.errors;
  delete req.session.error;
  delete req.session.success;
  delete req.session.message;
  delete req.session.errors;
  res.render("front/login", { isUserAuthenticated, success, message, error, errors });
};
const loginUser = async (req, res) => {
  let errors = {};
  for (const key in req.body) {
    if(req.body[key] === ''){
      errors[key] = `${key} is required`
    }
    
  }
  if( 'email' in errors  || 'password' in errors) {
    req.session.errors = errors;
    return res.redirect('/login')
}
  // console.log(res.body);
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    // console.log(user);
    let authenticated = await bcrypt.compare(req.body.password, user.password);
    //   console.log(authenticated);
    if (authenticated) {
      req.session.user = user;
      res.redirect("/admin");
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
};

const register = (req, res) => {
  let isUserAuthenticated = req.session.user ? true : false;
  let errors = req.session.errors;
  delete req.session.errors;
  // console.log(errors);
  res.render("front/register", { isUserAuthenticated , errors});
};

const addUser = async (req, res) => {
  // console.log(req.body);
    let errors = {};
    for (const key in req.body) {
      if(req.body[key] === ''){
        errors[key] = `${key} is required`
      }
      if(req.body.email) {

      let user = await  userModel.findOne({email: req.body.email})
      if(user) {
        errors.email = "user already exist"
      }
      }
      
    }
    // console.log(errors);
    if('name' in errors || 'email' in errors  || 'password' in errors) {
          req.session.errors = errors;
          return res.redirect('/register')
    }
  let hashPassword = await bcrypt.hash(req.body.password, 10);
  // console.log(req.body);
  try {
    await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      status: true,
    });

    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

const forgetPassword = async (req, res) => {
  let isUserAuthenticated = req.session.user ? true : false;

  //  console.log(req.session);
  let error = req.session.error;
  let success = req.session.success;
  let message = req.session.message;
  delete req.session.error;
  delete req.session.success;
  delete req.session.message;
  res.render("front/forgetPassword", {
    isUserAuthenticated,
    success,
    message,
    error,
  });
};

const forgetPasswordPost = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      let token = randomstring.generate();
      await userModel.updateOne(
        { _id: user._id },
        {
          token: token,
        }
      );
      let url = "http://localhost:3000/create-new-password/" + token;
      // console.log(randomstring.generate());

      //for mail sending
      const info = await transporter.sendMail({
        from: "singhshalini6599@gmail.com",
        to:  req.body.email,
        subject: "Create Password",
        html: `<a href="${url}">Create Password</a>`,
      });
      req.session.error = false;
      req.session.success = true;
      req.session.message = "Forget password link is sent to your email!";
      res.redirect("/forget-password");
    } else {
      req.session.error = true;
      req.session.success = false;
      req.session.message = "User does not exist!!";
      res.redirect("/forget-password");
    }
  } catch (error) {}
};

const createNewPassword = async (req, res) => {
  let isUserAuthenticated = req.session.user ? true : false;
  let token = req.params.token;
  // console.log(token);

  let error = req.session.error;
  let success = req.session.success;
  let message = req.session.message;
  delete req.session.error;
  delete req.session.success;
  delete req.session.message;
  // console.log(token);
  res.render("front/createNewPassword", { isUserAuthenticated, token, error,message,success });
};

const createNewPasswordPost = async (req, res) => {
  // console.log(req.body);
  try {
    let user = await userModel.findOne({ token: req.body.token });
    if (user) {
      let hashPassword = await bcrypt.hash(req.body.password, 10);
      await userModel.updateOne(
        { _id: user._id },
        {
          password: hashPassword,
        }
      );
      req.session.error = false;
      req.session.success = true;
      req.session.message = "password changed successfully!";
      res.redirect("/login");
    } else {
      req.session.error = false;
      req.session.success = true;
      req.session.message = "Token expired!";
      res.redirect(`/create-new-password/${req.body.token}`);
    }
  } catch (err) {}
};

module.exports = {
  index,
  detail,
  login,
  register,
  addUser,
  loginUser,
  forgetPassword,
  forgetPasswordPost,
  createNewPassword,
  createNewPasswordPost,
};
