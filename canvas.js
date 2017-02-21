var CanvasForSign = {


    // Variables to keep track of the mouse position and left-button status 
    mouseX: 0,
    mouseY: 0,
    mouseDown: 0,

    // Variables to keep track of the touch position
    touchX: 0,
    touchY: 0,

    // Keep track of the old/last position when drawing a line
    // We set it to -1 at the start to indicate that we don't have a good value for it yet
    lastX: -1,
    lastY: -1,

    // Set-up the canvas and add our event handlers after the page has loaded
    init: function () {
        // Get the specific canvas element from the HTML document
        ctx = document.getElementById('canvas-sign').getContext('2d');


        // React to mouse events on the canvas, and mouseup on the entire document
        document.getElementById('canvas-sign').addEventListener('mousedown', CanvasForSign.sketchpad_mouseDown, false);
        document.getElementById('canvas-sign').addEventListener('mousemove', CanvasForSign.sketchpad_mouseMove, false);
        window.addEventListener('mouseup', CanvasForSign.sketchpad_mouseUp, false);

        // React to touch events on the canvas
        document.getElementById('canvas-sign').addEventListener('touchstart', CanvasForSign.sketchpad_touchStart, false);
        document.getElementById('canvas-sign').addEventListener('touchend', CanvasForSign.sketchpad_touchEnd, false);
        document.getElementById('canvas-sign').addEventListener('touchmove', CanvasForSign.sketchpad_touchMove, false);

        // Reset the canvas on click "Effacer"
        document.getElementById('erase').addEventListener('click', function () {
            ctx.clearRect(0, 0, document.getElementById('canvas-sign').width, document.getElementById('canvas-sign').height);
        });

    },

    // Draws a line between the specified position on the supplied canvas name
    // Parameters are: A canvas context, the x position, the y position, the size of the dot
    drawLine: function (ctx, x, y, size) {

        // If lastX is not set, set lastX and lastY to the current position 
        if (CanvasForSign.lastX == -1) {
            CanvasForSign.lastX = x;
            CanvasForSign.lastY = y;
        }

        // Select a fill style
        ctx.strokeStyle = "#45505b";

        // Set the line "cap" style to round, so lines at different angles can join into each other
        ctx.lineCap = "round";
        //ctx.lineJoin = "round";


        // Draw a filled line
        ctx.beginPath();

        // First, move to the old (previous) position
        ctx.moveTo(CanvasForSign.lastX, CanvasForSign.lastY);

        // Now draw a line to the current touch/pointer position
        ctx.lineTo(x, y);

        // Set the line thickness and draw the line
        ctx.lineWidth = size;
        ctx.stroke();

        ctx.closePath();

        // Update the last position to reference the current position
        CanvasForSign.lastX = x;
        CanvasForSign.lastY = y;
    },

    // Clear the canvas context using the canvas width and height
    clearCanvas: function (canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    // Keep track of the mouse button being pressed and draw a dot at current location
    sketchpad_mouseDown: function () {
        CanvasForSign.mouseDown = 1;
        CanvasForSign.drawLine(ctx, CanvasForSign.mouseX, CanvasForSign.mouseY, 4);
    },

    // Keep track of the mouse button being released
    sketchpad_mouseUp: function () {
        CanvasForSign.mouseDown = 0;

        // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
        CanvasForSign.lastX = -1;
        CanvasForSign.lastY = -1;
    },

    // Keep track of the mouse position and draw a dot if mouse button is currently pressed
    sketchpad_mouseMove: function (e) {
        // Update the mouse co-ordinates when moved
        CanvasForSign.getMousePos(e);

        // Draw a dot if the mouse button is currently being pressed
        if (CanvasForSign.mouseDown == 1) {
            CanvasForSign.drawLine(ctx, CanvasForSign.mouseX, CanvasForSign.mouseY, 4);
        }
    },

    // Get the current mouse position relative to the top-left of the canvas
    getMousePos: function (e) {
        if (!e)
            var e = event;

        if (e.offsetX) {
            CanvasForSign.mouseX = e.offsetX;
            CanvasForSign.mouseY = e.offsetY;
        } else if (e.layerX) {
            CanvasForSign.mouseX = e.layerX;
            CanvasForSign.mouseY = e.layerY;
        }
    },

    // Draw something when a touch start is detected
    sketchpad_touchStart: function (e) {
        // Update the touch co-ordinates
        CanvasForSign.getTouchPos();

        CanvasForSign.drawLine(ctx, CanvasForSign.touchX, CanvasForSign.touchY, 4);

        // Prevents an additional mousedown event being triggered
        event.preventDefault();
    },

    sketchpad_touchEnd: function () {
        // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
        CanvasForSign.lastX = -1;
        CanvasForSign.lastY = -1;
    },

    // Draw something and prevent the default scrolling when touch movement is detected
    sketchpad_touchMove: function (e) {
        // Update the touch co-ordinates
        CanvasForSign.getTouchPos(e);

        // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
        CanvasForSign.drawLine(ctx, CanvasForSign.touchX, CanvasForSign.touchY, 4);

        // Prevent a scrolling action as a result of this touchmove triggering.
        event.preventDefault();
    },

    // Get the touch position relative to the top-left of the canvas
    // When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
    // but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
    // "target.offsetTop" to get the correct values in relation to the top left of the canvas.
    getTouchPos: function (e) {
        if (!e)
            var e = event;

        if (e.touches) {
            if (e.touches.length == 1) { // Only deal with one finger
                var touch = e.touches[0]; // Get the information for finger #1
                CanvasForSign.touchX = touch.pageX - touch.target.offsetLeft;
                CanvasForSign.touchY = touch.pageY - touch.target.offsetTop;
            }
        }
    },
}

$(document).ready(function () {
    CanvasForSign.init();
});