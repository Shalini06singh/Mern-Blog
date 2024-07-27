const express = require('express');
const { blogs, createBlog, editBlog, storeBlog, updateBlog, deleteBlog, deleteUser, logout, index, users, createUser, storeUser, editUser, updateUser } = require('../controller/backend.controller');
const { upload } = require('../middleware/fileUploadMiddleware');
//creating ui
const router = express.Router();
router.use((req,res,next) =>{
    // console.log(req.session.user);
    if(!req.session.user){
        res.redirect('/login');
    }
    next();
})
//dashboard
router.get("/",index )
//blogs
router.get("/blogs",blogs)
router.get("/blog/create", createBlog)
router.get("/blog/edit/:id",editBlog)
router.post("/blog/store", upload.single('image')  , storeBlog)
router.post("/blog/update/:id",upload.single('image') , updateBlog)
router.post("/blog/delete/:id",deleteBlog)


//user
router.get("/user",users)
router.get("/user/create", createUser)
router.get("/user/edit/:id",editUser)
router.post("/user/store", upload.single('image') , storeUser)
router.post("/user/update/:id", upload.single('image') ,updateUser)
router.post("/user/delete/:id",deleteUser)



//logout
router.post("/logout",logout)




module.exports = router;

