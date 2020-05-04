

# DEMO
Live demo of this project is available [here](https://go-paperless.herokuapp.com/)
# Configuration
Rename pubic.env file to .env and modify it according to your needs (Quotes are not necessary)
>EXAMPLE:  GP_GMAIL_SMTP_EMAIL=abc@gmail.domain

# Installation
Run below command in the project directory
>npm install
# Deployment on Heroku?
I assume that you already have configured heroku CLI and git,
Let's create our project dyno on heroku. < dyno name > is your project domain name which is accessible by anyone, for ex. < dyno name>.herokuapp.com, my-dyno.herokuapp.com
>heroku create < dyno name >

Now deploy the project by executing
> git add .
> git commit -m "init"
> git push heroku master

If you are having some problems with .env variables on heroku then you can manually add .env variables in your dyno. Refer to [this article](https://devcenter.heroku.com/articles/config-vars) for more information.

Once you've added variables then, head back to command line and execute 
>heroku restart

in your project directory
##### CONGRATS ! YOU HAVE NOW DEPLOYED THE APP ON SERVER

To check server logs, you can execute
>heroku logs --tail