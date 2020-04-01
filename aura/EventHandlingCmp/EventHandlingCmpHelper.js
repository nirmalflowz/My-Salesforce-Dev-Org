({
    redipsInit : function() {
        // reference to the REDIPS.drag library
        var	rd = REDIPS.drag;
        // initialization
        rd.init();
        // set mode option to "shift"
        rd.dropMode = 'shift';
        // set animation loop pause
        rd.animation.pause = 20;
        // enable shift.animation
        rd.shift.animation = true;
        // set TD for overflow elements (initially)
        rd.shift.overflow = document.getElementById('overflow');
        // add counter to cloned element name
        // (after cloned DIV element is dropped to the table)
        rd.event.clonedDropped = function () {
            // increase counter
            counter++;
            // append to the DIV element name
            rd.obj.innerHTML += counter;
        };
    }
})