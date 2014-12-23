Sudoku Game
===

This is just a simple sudoku game.

Right now, the board is hard coded, no board generator just yet.

External libraries used
---
* jQuery -> awesome JS wrapper
* FastClick -> to remove click delay on iOS devices
* Font Awesome -> for beautiful icons
* Modernizr -> to detect local storage and touch functionality

What can this game do?
---
* Generate table based on hard-coded data table (just pick at random index).
* Save state into local storage. To load, just refresh the page or close your tab and open again. 
It will open up a modal asking whether you'd like to load from saved state.
Safari private browsing does not support local storage, hence you could see that the save button is not there.
As the modal closes, it will remove the state from local storage.
* Timer.
* Setting to enable validation as you type.
* Pass in `mode=god` as url param to view `Cheat Fill` button.

What needs to be added / improved?
---
* Seems like `validate` method can be improved to run faster.
* Make the validation check for individual check faster so that the "as you type validation" method will work faster.
* Board generator method.
* Solver method.
* Use SCSS.
* Minified CSS / JS.
* Use templating engine.
* Unit testing! Since most of my JS is in module format, it's not going to be that hard to add unit tests.
Each module should have its own unit test.

Directory?
---
* Everything is in `static` directory
* Any external CSS is put into `css/lib`
* Any external JS is put into `js/lib`
* Any JS module is put into `js/modules`
* Any CSS module is put into `css/modules`
* There's only 1 page, i.e. `index.html`

CSS styles?
---
Using Roboto font. Tried to use a bit of material design :P

Modules?
---
I'm following Twitter Bootstrap module pattern. There are 4 modules that I implemented (ub-lazy-src, ub-modal, ub-timer, ub-sudoku).

All the modules are documented pretty well (I hope) inside the file itself.
* ub-sudoku

Simple sudoku module to start the sudoku game.

* ub-timer

Simple timer module just to see how many seconds / minutes / hours the game has been running.

* ub-modal

Module to open modal / dialog. I've implemented this before, so mostly this code is just a copy paste from my previous work.
I like to re-use code.

* ub-lazy-src

This one is too simple, basically just moving `data-ub-lazy-src` into `src` attribute. Could actually remove this, but will leave this here for now.

Extras
---
I'm using ImageOptim app for MacOS to reduce the success gif file. This app is amazing in general to reduce image size.