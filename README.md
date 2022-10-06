# NATOURS APP

![alt text](./Images/logo-green.png)

<h2>Table of Contents</h2>
<ul>
  <li><a href="#deployed-website--">Deployed Website</a></li>
  <li><a href="#built-with--">Built With</a></li>
  <li><a href="#getting-started">Getting Started</a></li>
  <li><a href="#Description">Description</a></li>
  <li><a href="#Documentation">Documentation</a></li>
  <li><a href="#Screenshots">Screenshots</a></li>
</ul>

<h2 href="#DeployedWebsite">Deployed Website : </h2>
<blockquote>
  <p>NOTE: Heroku is planning to prevent free servers soon, so maybe when you see this, the website will not be there anymore.
 </p>
</blockquote>
 <ul>
  <li><a href="https://natours-moaz.herokuapp.com/">You can see the deployed website on Heroku here
  </a></li>
 </ul>

<h2 href="#BuiltWith">Built With : </h2>
 <ul>
  <li><a href="https://www.w3schools.com/nodejs/">Node js</a></li>
  <li><a href="https://www.javatpoint.com/expressjs-tutorial">Express js</a></li>
  <li><a href="https://www.w3schools.in/mongodb/tutorials/">MongoDB</a></li>
  <li><a href="https://mongoosejs.com/">Mongoose js</a></li>
  <li><a href="http://www.w3schools.me/aspnetcore/implement-jwt">JSON Web Token</a></li>
  <li><a href="https://www.sitepoint.com/a-beginners-guide-to-pug/">Pug HTML Templates</a></li>
  <li><a href="https://nodemailer.com/about/">Nodemailer</a></li>
  <li><a href="https://stripe.com/en-gb-us">Stripe</a></li>
  <li><a href="https://www.mapbox.com/">Mapbox</a></li>

 </ul>

<h2 href="#GettingStarted">Getting Started</h2>
<blockquote>
  <p>This is a list of needed instructions to set up your project locally, to get a local copy up and running follow these instructions.
 </p>
</blockquote>
<ol>
<li>
  <h4>Clone the repository.</h4>
 </li>
 <li>
  <h4>cd into backend folder and create a file named "config.env" and fill it with this fields with your information. <h4>  <br> <blockquote> <p> NODE_ENV=development <br>
PORT=[PORT YOU WANT] <br>
DATABASE=[CONNECTION STRING OF YOUR DATABASE] <br>
USER=[DATABASE USER NAME] <br>
DATABASE_PASSWORD=[YOUR DATABASE PASSWORD] <br>
JWT_SECRET=[YOUR JWT SECRET STRING] <br>
JWT_EXPIRES_IN=[DATE example: 1d "for one day"] <br>
JWT_COOKIE_EXPIRES_IN=[Date example: 1 "for one day"] <br></p> </blockquote>
 </li>
 <li>
  <h4>Follow this article to install node js and npm <a href="https://phoenixnap.com/kb/install-node-js-npm-on-windows">Install Node js and npm</a></h4>.
 </li>
 <li>
  <h4>npm i && npm start</h4>
 </li>
 </ol>

<h2 href="#Description">Description</h2>
<blockquote>
  <p>
  This website was implemented for studying the Complete Node Bootcamp by Jonas Shmedtmann <a href="https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/?utm_source=adwords&utm_medium=udemyads&utm_campaign=LongTail_la.EN_cc.ROW&utm_content=deal4584&utm_term=_._ag_77879424134_._ad_535397245863_._kw__._de_c_._dm__._pl__._ti_dsa-1007766171312_._li_1005394_._pd__._&matchtype=&gclid=Cj0KCQjwj7CZBhDHARIsAPPWv3eIDgakxVmBXRF82kcnFnDo4XZvbb8CzvO8T8LuP7If9EGJ3jfU9sgaAsslEALw_wcB">Complete Node Bootcamp</a>.
  <br>
  It is a tours website for showing the information about all the tours of this company and making the clients able to book them.
  <br>
  Each user has information like name, email, role(admin, lead guide, guide, or user), password and maybe a photo. He can update his information at any time, log in, and log out.
  <br> 
  Each tour has name, duration, maximum group size, difficulty(hard, medium or easy), reviews, price, summary, description, cover image, images, start dates, start location, locations and guides.
  <br> 
  This website is developed in Node js for the backend using MongoDB for the database & in Pug templates for the frontend (Server has an API and also renders the views, but the project target is the server API).

 </p>
</blockquote>

<h2 href="#Documentation">Documentation</h2>
<blockquote>
  <p>
  You can look on the API documentation at <a href="https://documenter.getpostman.com/view/22736405/VVkCdbKe">API Documentation</a>
  </p>
</blockquote>

<h2 href="#Screenshots">Screenshots</h2>
<ol>
<li>
  <h4>Log In with email and password.</h4>
  <img src="./Images/Log In.PNG">
</li>
<li>
  <h4>All Tours.</h4>
  <img src="./Images/All Tours.PNG">
</li>
<li>
  <h4>A client can update his information, look at his bookings, and log out.</h4>
  <img src="./Images/Update information.PNG">
</li>
<li>
  <h4>Update password.</h4>
  <img src="./Images/Update password.PNG">
</li>
<li>
  <h4>Update password with incorrect password.</h4>
  <img src="./Images/Update password with incorrect password.PNG">
</li>
<li>
  <h4>Tour Page 1.</h4>
  <img src="./Images/Tour Page 1.PNG">
</li>
<li>
  <h4>Tour Page 2.</h4>
  <img src="./Images/Tour Page 2.PNG">
</li>
<li>
  <h4>Tour Page 3.</h4>
  <img src="./Images/Tour Page 3.PNG">
</li>
<li>
  <h4>Tour Page 4.</h4>
  <img src="./Images/Tour Page 4.PNG">
</li>
<li>
  <h4>Tour Page 5.</h4>
  <img src="./Images/Tour Page 5.PNG">
</li>
<li>
  <h4>Tour Page 6.</h4>
  <img src="./Images/Tour Page 6.PNG">
</li>
<li>
  <h4>Booking a tour with Stripe.</h4>
  <img src="./Images/Booking a tour with Stripe.PNG">
</li>
<li>
  <h4>My Tours after booking.</h4>
  <img src="./Images/My Tours after booking.PNG">
</li>
</ol>
