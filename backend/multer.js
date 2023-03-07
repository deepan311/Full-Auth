const multer = require('multer')
const path= require('path')

// ===========================MULTER============================

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
      cb(null,'./UserImage')
    },
    filename:(req,file,cb)=>{

        console.log(file)
      cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
    }
  })
  const upload = multer({storage:storage,limits:{fileSize:2*1000*1000}})


  
module.exports= upload  