const app = require('./app') 
const dbcon = require('./DB/dbcon')

const PORT = process.env.PORT || 9000

dbcon.then(res=>{
    console.log('DB connected')
    app.listen(PORT,()=>{
        console.log('Server Running...')
    })
}).catch(err=>{
    console.log(err)
    console.log('DB Could not connected')
})

