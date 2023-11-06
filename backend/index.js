const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec')
const path = require("path")
const fs = require('fs')

var app = express()

const port = 3001

app.use(bodyParser.json());
app.use(cors({
    exposedHeaders: ['Content-Disposition']
}))

const debugYoutubeURL = "https://www.youtube.com/watch?v=u5lRSOnFlgQ";
let mostRecentDownload = null;


const getThumbnailUrl = (url) => {
    const options = {
        output: "%(title)s.%(ext)s",
        print: "%(.{thumbnail})#j"
    }
    return new Promise((resolve, reject) => {
        youtubedl(url, options)
        .then(output => {
            resolve(output.thumbnail);
        })
        .catch(error => {
            
            reject(new Error(`Cannot find a youtube video with url: ${url}`));
        });
    });
}

app.get('/thumbnail', async (req, res, next) =>{

    getThumbnailUrl(req.query.url)
    .then(url => {
        res.json({url: url});
    }).catch(error => {
        res.status(400).json({error: error.toString()});
    });
    
});
app.post('/convertYoutube', function (req, res, next) {
    const url = req.body.url;
    const format = req.body.format
    console.log(`converting ${url} using format ${format}`);
    mostRecentDownload= null;
    const options = {
        output: "%(title)s.%(ext)s",
        format: format,
        noSimulate:true,
        print: "%(.{filename})#j"

    }

    youtubedl(url, options)
    .then(output => {
        const filename = output.filename;
        mostRecentDownload = filename;
        console.log(filename)
        res.json({
            message: "success"
        })
        
    }).catch(error =>{
        console.log(error);
        res.status(500).json({ error: error.stderr });
    })
  })

  app.get('/download', (req, res) => {
    // Your code to handle the GET request goes here
    // Example response: Send a JSON response
    const link = path.join(__dirname, mostRecentDownload)
    res.download(link);
  });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });