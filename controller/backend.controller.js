const blogModel = require("../models/blog.model")
const userModel = require("../models/user.model")
//for hashing of pasword
const bcrypt = require('bcrypt');
//dashboard ui
const index = (req,res) =>{
   let currentUser = req.session.user;
   let isUserAuthenticated = req.session.user ? true : false;
    res.render("backend/dashboad/index",{currentUser, isUserAuthenticated})
}
//blog
const blogs = async(req,res) =>{
    let isUserAuthenticated = req.session.user ? true : false;
    let blogs=  await blogModel.find()
    res.render("backend/blog/index" ,{blogs , isUserAuthenticated})
}


const createBlog = (req,res) =>{
    let isUserAuthenticated = req.session.user ? true : false;
    res.render("backend/blog/create" ,{isUserAuthenticated})
}

const editBlog = async(req,res) =>{
    let isUserAuthenticated = req.session.user ? true : false;
  let blog = await blogModel.findById(req.params.id)
  if(blog) {
    return  res.render("backend/blog/edit",{blog , isUserAuthenticated})
  }
  return  res.redirect("admin/blogs")
   
}

const storeBlog = async (req,res) =>{
    // console.log(req.file, req.body);
    try {
        await blogModel.create({
            title: req.body.title,
            slug: req.body.slug,
            image: req.file ? req.file.path.replace('public' , '') : '',
            description: req.body.description,
            status: req.body.status === '1' ? true : false
        })
        res.redirect('/admin/blogs')
    } catch (error) {
        console.log(error.message);
    }
}

const updateBlog = async (req,res) =>{
    //console.log(req.body, req.file )
try {
    if(req.file){
        await blogModel.updateOne({_id : req.params.id},{
            title: req.body.title,
            slug: req.body.slug,
            image: req.file ? req.file.path.replace('public' , '') : '',
            description: req.body.description,
            status: req.body.status === '1' ? true : false
        })

       
    }
        else{
            await blogModel.updateOne({_id : req.params.id},{
                title: req.body.title,
                slug: req.body.slug,
              
                description: req.body.description,
                status: req.body.status === '1' ? true : false
            })
        } 
        res.redirect('/admin/blogs')
    } catch (error) {
        console.log(error.message);
}
    
}

const deleteBlog = async(req,res) =>{
  if(req.params.id){
    await blogModel.deleteOne({_id : req.params.id})
    res.redirect('/admin/blogs')
  }else{
    res.redirect('/admin/blogs')
  }
}
//users
const users = async(req,res) =>{
    let isUserAuthenticated = req.session.user ? true : false;
    let users=  await userModel.find()
    res.render("backend/user/index",{users, isUserAuthenticated})
}


const createUser = (req,res) =>{
    let isUserAuthenticated = req.session.user ? true : false;
    res.render("backend/user/create" , {isUserAuthenticated})
}

const editUser = async(req,res) =>{
    let isUserAuthenticated = req.session.user ? true : false;
    let user = await userModel.findById(req.params.id)
  if(user) {
    return  res.render("backend/user/edit",{user, isUserAuthenticated})
  }
  return  res.redirect("admin/user")
    
}

const storeUser =async (req,res) =>{
   let hashPassword = await bcrypt.hash(req.body.password, 10);
        
    // console.log(req.body);
    // console.log(req.file);
    try {
        await userModel.create({
            name: req.body.name,
            email: req.body.email,
            password : hashPassword,
            image: req.file ? req.file.path.replace('public' , '') : '',   
            contact: req.body.contact,
            status: req.body.status === '1' ? true : false
        })
        res.redirect('/admin/user')
    } catch (error) {
        console.log(error.message);
    }
}

const updateUser =async (req,res) =>{
    try {
        if(req.file){
            await userModel.updateOne({_id : req.params.id},{
                name: req.body.name,
                email: req.body.email,
                
                image: req.file ? req.file.path.replace('public' , '') : '',   
                contact: req.body.contact,
                status: req.body.status === '1' ? true : false
            })
    
           
        }
            else{
                await userModel.updateOne({_id : req.params.id},{
                    name: req.body.name,
            email: req.body.email,
            
            contact: req.body.contact,
            status: req.body.status === '1' ? true : false
                })
            } 
            res.redirect('/admin/user')
        } catch (error) {
            console.log(error.message);
    }
}
const deleteUser= async(req,res) =>{
    if(req.params.id){
        await userModel.deleteOne({_id : req.params.id})
        res.redirect('/admin/user')
      }else{
        res.redirect('/admin/user')
      }
}


//logout
const logout = (req,res) =>{
//  console.log(req.session.user);   
req.session.destroy();
res.redirect('/login')
}

module.exports = {
index,
blogs,
createBlog,
editBlog,
updateBlog,
storeBlog,
deleteBlog,
users,
createUser,
storeUser,
editUser,
updateUser,
deleteUser,
logout
}

