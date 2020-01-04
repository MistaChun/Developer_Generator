const htmlFile = require("./newHTML");
const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const puppeteer = require("puppeteer");

const writeFileAsync = util.promisify(fs.writeFile);
  
function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      message: "What is your GitHub username?",
      name: "username",
    },
    {
      type: "input",
      message: "What is your favorite color?",
      name: "color",
    },
  ])
    .then(function ({ username, color }) {
    const config = { headers: { accept: "application/json" } };
    const queryUrl = `https://api.github.com/users/${username}`;
    return axios.get(queryUrl, config).then(userData => {
        const userURL = `https://api.github.com/users/${username}/starred`;

        axios.get(userURL, config).then(starredRepos => {
          data = {
            picture: userData.data.avatar_url,
            location: userData.data.location,
            gitProfile: userData.data.html_url,
            blog: userData.data.blog,
            userBio: userData.data.bio,
            repositories: userData.data.public_repos,
            followers: userData.data.followers,
            following: userData.data.following,
            stars: starredRepos.data.length,
            username: username,
            color: color
          };
          console.log(data);
          htmlFile(data);
          newHTML(htmlFile(data));
          makePdf(username);
        });
      });
      
  });
}

function newHTML(answers) {
  console.log(answers);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Hi! My name is ${answers.username}</h1>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${answers.gitProfile}</li>
      <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
    </ul>
  </div>
</div>
</body>
</html>`;

}

promptUser()
  .then(function(answers) {
    console.log(answers);
    const html = newHTML(answers);

    return writeFileAsync("index.html", html);
  })
  .then(function() {
    console.log("Successfully wrote to index.html");
  })
  .catch(function(err) {
    console.log(err);
  });
async function makePdf(username){
    try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("C:\Users\chack\BCS-Developer-Generator");
    await page.emulateMedia("screen");
    await page.pdf({
        path: `${username}.pdf`,
        format: "A4",
        printBackground:true,
        landscape:true
    });
    console.log("A new PDF has been created.");
    await browser.exit();
    } catch (error) {
        console.log("Error: Something went wrong.");
    }
}