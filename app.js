const express = require('express')
const path = require('path')
const app = express()
const port = 8080
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database('database/database.db');
database.run("CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY, title TEXT, video TEXT)");
app.set('view engine', 'pug')
app.use('/static',express.static('static'))

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/list',(req,res)=>{
    database.all("SELECT * FROM videos",(err,rows)=>{
        res.send(rows);
    }
    )
})

app.put('/upload',upload.single('video'),(req,res)=>{
    console.log(req.file)
    database.run("INSERT INTO videos (title, video) VALUES (?,?)",[req.body.title,req.file.filename],(err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send({'valid':true,'message':'uploaded'})
        }
    });
})

app.get('/download',(req,res)=>{
    res.sendFile(path.join(__dirname, 'uploads', req.query.video));
})

app.get('/downloadprocessed',(req,res)=>{
    res.sendFile(path.join(__dirname, 'processed', req.query.video));
})

app.delete('/delete',(req,res)=>{
    //TODO delete video file
    database.run("DELETE FROM videos WHERE id=?",[req.query.id],(err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send({'valid':true,'message':'deleted'})
        }
    }
    )
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})