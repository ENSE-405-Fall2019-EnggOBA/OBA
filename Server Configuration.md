# Server Configuration

The purpose of this document is to document the steps taken to configure the server to its current configuration. If software is unstalled, updated, or uninstalled, the process of doing so should be documented in this document.

## Notes

Server is running Amazon Linux 2 which is based on CentOS (no source for this), so CentOS tutorials work here.

php & html files served from `/var/www/html/`

apache configuration file at `/etc/httpd/conf/httpd.conf`

## Installing NodeJS and NPM

This is all done in superuser mode.

`sudo su` to enter superuser

`curl -sL https://rpm.nodesource.com/setup_11x | bash -` to add version 11 as a repository source for yum

`yum --showduplicates list nodejs` (optional; just lists the new sources of nodejs)

`yum install nodejs` (you can use -y or enter y repeatedly) to actually install node

`exit` to exit superuser

## Adding a node server

Prerequisites: a Node application listening on port 3000 (this process can be used for an arbitrary port number)

`sudo emacs /etc/httpd/conf/httpd.conf` (or use any other editor of choice)

Then add `ProxyPass /api http://localhost:3000` ('api' can be replaced with 'wiki' for the wiki, for example) to a new line at the end of the file. Save and exit.

`sudo systemctl restart httpd.service` to restart apache for the above to take effect

## Running node server as a daemon

Followed [this](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-centos-7#install-pm2) tutorial

`sudo npm install pm2@latest -g` to install pm2

`sudo pm2 startup systemd` to launch pm2 on server launch

(in directory of application) `pm2 start index.js` to start the application (TODO: figure out how to name things within pm2 other than 'index')

to stop: `pm2 stop index.js`

## Deploying New Backend Code

1. `pm2 delete app` to stop the existing application in pm2
1. `sudo rm -rf {location of existing install}` to delete the old installation, even if there are permission problems
1. winscp or other ftp application copy the new files into `/var/www/node`
1. in location of package.json: `npm install` to install npm packages
1. in location of new server entry point: `pm2 start app.js` to start it

Note: you may have to use sudo to find the pid on port 3000 and kill it if the re-deploy doesn't take effect or if the server still works after running delete. This usually only happens if you delete the old install before stopping it.
