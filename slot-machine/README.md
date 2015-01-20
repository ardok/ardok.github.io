Slot Machine Game
===

This is just a simple slot machine game. If you'd like to run this locally, just drag and drop (or open) `index.html` into your browser, and it should run.

Right now, there are only 3 simple prizes. There are 3 wheels:
* The first reel has a coffee maker, a teapot, and an espresso machine.
* The second reel has a coffee filter, a tea strainer, and an espresso tamper.
* The third reel has coffee grounds, loose tea, and ground espresso beans.

How to win?

For example, if the reels show coffee maker, coffee filter, and coffee grounds, the user wins a cup of coffee.

External libraries used
---
* jQuery -> awesome JS wrapper

What can this game do?
---
* Just play some really simple slot machine game
* Pass in `mode=god` as url param to view `Cheat` button.

Known bugs?
---
* Just not a smooth transition between the first and last images on the sprite. Why does this happen?
Because the sprite only contains 3 images and every time the backgrond position goes past the lowest value, it will reset to 0.
That reset to 0 position could be smoother, somehow.

Wishlist (what needs to be added / improved?)
---
* Use SCSS.
* Minified CSS / JS.
* Use templating engine.
* Unit testing
* Testing on IE (I don't have any IE).

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
* Using Roboto font. Tried to use a bit of material design :P

Modules?
---
I'm following Twitter Bootstrap module pattern.

All the modules are documented pretty well (I hope) inside the file itself.
* ks-modal

My modal module to just show modal.

* slot-machine

This is the module to initialize the slot machine game.

Testing
---
No unit testing, as stated in "Wishlist" section.

I've only tested on:
* iOS 8 simulator (iPhone + iPad).
* Physical (Android) Nexus 5 device (5.0.1) using Chrome Beta and Chrome.
* Latest Safari, Firefox, and Chrome on MacOS (10.10.1).
