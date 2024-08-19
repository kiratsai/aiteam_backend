# aiteam_backend

Ubuntu Node.js + MySQL + Vue Development Guide
(從開機到放棄)
# Readme

## Development Environment Setup:
This guide will help you set up a development environment on a Linux operating system. We will cover the installation and configuration of MySQL, Node.js, and Vue.js for both backend and frontend development.

# Ubuntu Node.js + MySQL + Vue Development Guide

## Development Environment Setup:
This guide will help you set up a development environment on a Linux operating system. We will cover the installation and configuration of MySQL, Node.js, and Vue.js for both backend and frontend development.


#### The Environment


1. **Database: MySQL**
   - Developers need to download the MySQL Community Server.


   1.2 **Download MySQL Community Server Commands:**
   ```
   sudo apt update
   sudo apt install mysql-server
   sudo mysql_secure_installation
   ```

   1.3 **Server Setting References:**  
   To add a new user, follow this guide: [How to Create MySQL User and Grant Privileges](https://www.hostinger.com/tutorials/mysql/how-create-mysql-user-and-grant-permissions-command-line)
Username: aiteam
password: Aiteam£123456

   1.4 **Download MySQL Workbench Command:**  
   `sudo snap install mysql-workbench-community`   

   1.5 ` mysql -V` @version mysql  Ver 8.0.37-0ubuntu0.20.04.3 for Linux on x86_64 ((Ubuntu))


2. **Set Up Node.js**
   2.1 **Download and Install Node.js Commands:**

    ```
    sudo apt  install curl
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    source ~/.bashrc
    command -v nvm
    nvm install 22.4.0
    nvm use 22
    ```

    reference: https://github.com/nvm-sh/nvm
    @Versionv:22.4.0




3. **Create Backend Server:**
   ```
   # Generate a new folder and pre-built file structure (scaffold) using Express
   npx express-generator --view=ejs --git aiteam_backend  
   # The following command fetches and installs all the necessary Node.js packages and modules listed in the `package.json` file:  
   cd aiteam_backend  
   npm install  
   # During the installation, you might come across a critical severity vulnerability. To address this, you can run the following command:  
   npm audit fix --force 
   # install the mysql2 for connect the mysql model
   npm install express mysql2 sequelize
   # Start the server command:
   npm start
   ```


   
4. **Create Frontend Vue Server:**
   4.1 Use the following command to set up a Vue server. When prompted, choose No for all options except Vue Router (#3) and ESLint (#7). Adding Vue Router enables client-side routing in the app for navigating between different components. ESLint is a static analysis tool commonly used in JavaScript development to enforce code quality and maintain consistent coding practices:  
   `npx create-vue aiteam_frontend`  
   4.2 If you haven't selected ESLint during project creation, you may use the following command and follow the suggested settings:  
   ```
   cd aiteam_frontend
   npm init @eslint/config
   ```
   Choose: 
   1. syntax and find problem
   2. Javascripts
   3. Vue.js
   4. No typescript
   5. Brower
   6. Yes
   7. npm
   4.3 **Start the server command:**  
   ```
   cd aiteam_frontend
   npm install
   npm run dev
   ```


5. **RESTful API and Ajax:**

   5.1 RESTful API will be used for the creation, retrieval, update, and deletion (CRUD) operations on resources.  
   5.2 To make a RESTful API, please open the app.js file in your backend and the following lines is an example:
`var bookingsRouter = require('./routes/bookings'); // around line 9`
`app.use('/api/bookings', bookingsRouter); // around line 25`



   5.2 Ajax will be used to update specific parts of a web page without reloading the entire page.


6. **Vue development**
6.1 To view the Vue file, you need to configure the router. Inside the /router/index.js file, the following code is an example:
{
  path: '/booking/create',
  name: 'booking-create',
  // route level code-splitting
  // this generates a separate chunk (About.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import('../views/BookingView.vue') //the vue that include the html code
}

6.2 Proxy Server
In order to enable the Vue app to consume the Express endpoints, we need to set up a proxy configuration that will route the requests to the appropriate endpoints.

To achieve this, open the vite.config.js file and add the following code inside the server object of the defineConfig() function:
`server: {
    proxy: {
      '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
},`


6.3 Bootstarp:
install Bootstarp:
`npm install bootstrap --save`

In the main.js file of your project, add the following line to import the Bootstrap CSS and JS files:
`import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap"`



7. **Node.js development**



8. **Install and activate the wifi driver ASUS UNC PRO : Model@NUC13ANH**
8.1. Download latest driver: https://www.intel.com/content/www/us/en/support/articles/000005511/wireless.html
Device: Intel® Wi-Fi 6 AX210 160MHz, Kernels: 5.10+, 
Firmware (First Version):iwlwifi-ty-59.601f3a66.0.tgz

tar -xvf iwlwifi*.tar.gz
cd (location/)iwlwifi-*
sudo cp -r * /lib/firmware/  **copy your downloaded data to /lib/firmware**
sudo update-initramfs -u
sudo reboot

8.2. sudo add-apt-repository ppa:cappelikan/ppa
sudo apt update
sudo apt install mainline
sudo mainline install-latest
sudo reboot

If after reboot shows the bad signature messages, enter BIOS and set security boot to disabled.


9. **Install redis**
link: https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/
sudo apt-get update
sudo apt-get install redis


 

