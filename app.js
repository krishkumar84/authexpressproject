// jshint esversion: 
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); 

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [ 
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/3bb91749f2";

    const options = {
        method: "POST",
        auth: "krish1:8185ce6aaa4a842e43f0624d1b776ee2-us12"
    }
    
      const request = https.request(url, options, function(response) {
        let responseData = "";
    
        response.on("data", function(chunk) {
          responseData += chunk;
        });
    
        response.on("end", function() {
          const responseObject = JSON.parse(responseData);
    
          if (responseObject.errors.length == 0) {
            res.writeHead(302, { Location: "https://krishfirstreactproject.netlify.app" });
            res.end();
          } else {
            res.sendFile(__dirname + "/404.html");
          }
        });
        response.on("data", function(data){
                  console.log(JSON.parse(data));
               })
      });
    
      request.write(jsonData);
      request.end();
    });


 app.post("/failure", function(req, res) {
       res.redirect("/");
    });
app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});
