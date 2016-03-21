var Gadget = function(configIdx) {
    this.load(configIdx);


}

Gadget.prototype.load = function(configIdx) {
    var camelCase = function(input) { 
        return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    }
    
    var gadgetConfig = configService.getFromIndex(configIdx);

    // Load controllers (gadget and gadget-settings)
    $.getScript("gadgets/"+gadgetConfig.name+"/gadget.js");
    $.getScript("gadgets/"+gadgetConfig.name+"/settings.js");

    // Delete DOM element if exists
    $(".gadget[data-gadget-id="+gadgetConfig.id+"]").parent().remove();

    // Create DOM element
    $("body #container").append("<div class=\"gadget-container\"><div class=\"gadget gadget-"+gadgetConfig.name+"\" data-gadget-id=\""+gadgetConfig.id+"\" id=\"gadget-"+gadgetConfig.id+"\"><div class=\"content\"></div><div class=\"settings\"></div><div class=\"actions\"><button class=\"btn-settings\">Settings</button><button class=\"btn-reload\">Reload</button><button class=\"btn-close\">Close</button></div></div></div>");
    
    // Set coordinates
    $(".gadget[data-gadget-id="+gadgetConfig.id+"]").parent().css({left: gadgetConfig.left, top: gadgetConfig.top});

    // Set dimensions
    $(".gadget[data-gadget-id="+gadgetConfig.id+"]").parent().css("width", unit * gadgetConfig.width);
    $(".gadget[data-gadget-id="+gadgetConfig.id+"]").parent().css("height", unit * gadgetConfig.height);
    
    // Load gadget content, initialize controller
    $(".gadget[data-gadget-id="+gadgetConfig.id+"] .content").load("gadgets/"+gadgetConfig.name+"/gadget.html", function(response, status, xhr) {
        var pluginName = camelCase("gadget-" + gadgetConfig.name);
        if (typeof $(this)[pluginName] != "undefined") {
            // Load gadget with he related config
            $(this).parent()[pluginName]();
        }
        else {
            console.log(pluginName+" jQuery plugin not exists");
        }

    });

    // Load settings page, initialize settings controller
    $(".gadget[data-gadget-id="+gadgetConfig.id+"] .settings").load("gadgets/"+gadgetConfig.name+"/settings.html", function(response, status, xhr) {
        //var pluginName = "gadget" + gadgetConfig.name.charAt(0).toUpperCase() + gadgetConfig.name.slice(1) + "Settings";
        var pluginName = camelCase("gadget-" + gadgetConfig.name + "-settings");
        if (typeof $(this)[pluginName] != "undefined") {
            $(this).parent()[pluginName]();
        }
        else {
            console.log(pluginName+" jQuery plugin not exists");
        }
    });

    // Define gadget buttons: Move, Settings, Close
    $(".gadget[data-gadget-id="+gadgetConfig.id+"] .actions .btn-settings").click( function() {
        var $gadget = $(this).parent().parent();
        $($gadget).toggleClass("settings-visible");
    });
    $(".gadget[data-gadget-id="+gadgetConfig.id+"] .actions .btn-reload").click( function() {
        configService.save();
        gadgetLoad(configService.getIndexFromId(gadgetConfig.id));
    });
    $(".gadget[data-gadget-id="+gadgetConfig.id+"] .actions .btn-close").click( function() {
        $(".gadget[data-gadget-id="+gadgetConfig.id+"]").parent().remove();
        configService.removeGadget(gadgetConfig.id);
        configService.save();
    });

    $(".gadget[data-gadget-id="+gadgetConfig.id+"]").parent().draggable({
        snap: true,
        containment: "#container",
        scroll: false,
        stop: function(event, ui) {
            configService.save();
        }
    });
}
