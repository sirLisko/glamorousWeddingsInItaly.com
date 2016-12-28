# REPO Website Sandra

The Website is built using [NodeJs](https://nodejs.org/) and [Gulp](http://gulpjs.com/).

In order to have the Website up and running NodeJs is mandatory, it can be installed using [n](https://github.com/tj/n), a handy NodeJs binary manager, or using the official installer present in the NodeJs website ([https://nodejs.org/download/](https://nodejs.org/download/)).

### Build steps
Now the build consists of 2 steps:
- Install all the FE dependencies for the build (i.e. gulp, uglify, etc.)
- Build our javascript (controllers, templates, etc.)

### Install the dependencies
Once NodeJs is installed, its package manager NPM will be available, all you need to do is run in the main directory of the project the following command.
```
$ npm install --production
```
This will install all the software needed in order to build and run the Website.

In addition of that NPM allows us to run base commands that could be plugged to gulp functions or utilities.

### Install Gulp (optional)
In order to make everything way easier it is suggested, but not mandatory, install Gulp globally in the machine.
```
$ npm install gulp -g
```
This will allow running `gulp` directly, without referencing every time to the local binary `node_modules/.bin/gulp`.

It is possible to add Gulp auto completition by adding a [custom script](https://github.com/gulpjs/gulp/tree/master/completion) to the shell.

### Build the Front-End
```
$ npm run build
```
It runs the following tasks:
* check the syntax of the JS, according to [StandardJS](http://standardjs.com/) (via [ESLint](http://eslint.org/))
* transpile (via [Babel](https://babeljs.io/)) the javascript from ES2015 to normal JS
* compile the SASS files to get a generic stylesheet
* concatenate the files
* compress javascript (via [Uglify](https://github.com/mishoo/UglifyJS)) and CSS (via [CSSO](https://github.com/css/csso))
* concatenating and compressing the HTML
* generating an icon file for the SVGs
* optimisation of the images
* localising the website
* [optional] creating responsive version of the images
* [optional] generating a sitemep


### Work with the Front-End (Develop)
Gulp gives us the ability to run several tasks contained in the main gulp file `gulpfile.babel.js`.

The easier way to build the Front-End in Develop mode is with:
```
$ npm run watch

// or

$ gulp watch
```

In addition to the build, this command is also **watching the file system** looking for files change. Once one of the resources is edit gulp is rebuilding the related task and it makes the change immediately available to be handled by Rails.
