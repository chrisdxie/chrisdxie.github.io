$(document).ready(function(){
  
  create_colorSwatch();
  mouse_over();
  load_all_images_then(table_row_height_adjust);

});

// - - - - - - - - - - - - - - - - - - - - - - - - -
// for each li.color, grab the hex color value in the item and set is at the background-color 

function create_colorSwatch() {

  $( "li.color" ).each(function() {
    
    var color = $( this ).text();
    $( this ).css( "background-color" , color );
    
    //if the single swatch color is too dark, use a lighter font color to display the hex color value
    
    var c = color.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 85) {
      $( this ).css( "color" , "#f0f0f0" );
    }
    
  });

}

// - - - - - - - - - - - - - - - - - - - - - - - - -

/*
  Gif Switch Code
  ---------------
  Easily switch an image from a static img to animated gif,
  including a delay for css fade-out of original image.
  Markup looks like such:
  <img src="analyze.png" class="gif-switch-img" data-gif-src="analyze.gif" data-orig-src="analyze.png">
*/
function mouse_over() {

  $(".gif-switch").mouseenter(function(e){
    var target = $(e.currentTarget);
    var gifSrc = target.find('.gif-switch-img').attr('data-gif-src');
    timer = setTimeout(function(){
        target.find('.gif-switch-img').attr('src', gifSrc);
    },500);
  }).mouseleave(function(e){
    var target = $(e.currentTarget);
    clearTimeout(timer);
    var origSrc = target.find('.gif-switch-img').attr('data-orig-src');
    target.find('.gif-switch-img').attr('src', origSrc);
  });

}

// - - - - - - - - - - - - - - - - - - - - - - - - -
/*
A function that will clone each image and re-load it. After running
this function, we can safely assume all images have been loaded.

The argument is a function that will be called once all images are loaded.
*/
function load_all_images_then(func) {
  // Images loaded is zero because we're going to process a new set of images.
  var imagesLoaded = 0
  // Total images is still the total number of <img> elements on the page.
  var totalImages = $("img").length

  // Step through each image in the DOM, clone it, attach an onload event
  // listener, then set its source to the source of the original image. When
  // that new image has loaded, fire the imageLoaded() callback.
  $("img").each(function (idx, img) {
    $("<img>").on("load", imageLoaded).attr("src", $(img).attr("src"))
  })

  function imageLoaded() {
    imagesLoaded++
    if (imagesLoaded == totalImages) {
      allImagesLoaded();
    }
  }

  function allImagesLoaded() {
    console.log("ALL IMAGES LOADED");
    func();  // Do whatever you want now that images are loaded.
  }

}

// - - - - - - - - - - - - - - - - - - - - - - - - -
/*
Adapatively set the div height if the GiF is too tall.
Only do this on Chrome, I verified this works on Chrome.
It doesn't work on Safari, and I haven't tried this on any other browser.
*/
function table_row_height_adjust() {

  console.log("Is chrome: " + is_chrome())

  if (is_chrome()) {

    $(".gif-switch").each(function(){
      var gif_height = this.getElementsByClassName("hidden")[0].height;
      var gif_width = this.getElementsByClassName("hidden")[0].width;
      var gif_aspect_ratio = gif_height / gif_width;
      var gif_render_height = this.clientWidth * gif_aspect_ratio;

      var new_div_height = Math.ceil(Math.max(gif_render_height, this.clientHeight) / 10) * 10;
      this.style.minHeight = new_div_height + "px";
      this.style.display = "flex";  // This is for vertical alignment of image in div
      console.log("Editing new height to: " + new_div_height + "px")
    });

  }

}

// - - - - - - - - - - - - - - - - - - - - - - - - -
/*
A function to check whether the browser is Chrome. Adapted from:
https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome/13348618#13348618
*/
function is_chrome() {

  // please note, 
  // that IE11 now returns undefined again for window.chrome
  // and new Opera 30 outputs true for window.chrome
  // but needs to check if window.opr is not undefined
  // and new IE Edge outputs to true now for window.chrome
  // and if not iOS Chrome check
  // so use the below updated condition
  var isChromium = window.chrome;
  var winNav = window.navigator;
  var vendorName = winNav.vendor;
  var isOpera = typeof window.opr !== "undefined";
  var isIEedge = winNav.userAgent.indexOf("Edge") > -1;

  if (
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendorName === "Google Inc." &&
    isOpera === false &&
    isIEedge === false
  ) {
     return true;
  } else { 
     return false;
  }

}

