(function() {
    // Import Services module for Observer (startup and shutdown events)
    Components.utils.import("resource://gre/modules/Services.jsm");

    var nodePath;

    switch (Services.appinfo.OS) {
        case "WINNT": // Windows
            nodePath = "REPLACE_WITH_ABS_PATH_TO_WINDOWS_NODE_EXECUTABLE";
            break;
        case "Darwin": // Mac
            nodePath = "REPLACE_WITH_ABS_PATH_TO_MAC_NODE_EXECUTABLE";
            break;
        case "Linux": // Linux
            nodePath = "REPLACE_WITH_ABS_PATH_TO_LINUX_NODE_EXECUTABLE";
            break;
    };

    if (!nodePath) {
        return;
    };

    // Create an nsILocalFile for the Node executable
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);  
    file.initWithPath(nodePath);

    // Check for Node executable
    if (!file.exists()) {
        // Node executable is missing
        return;
    };

    // Create an nsIProcess to manage the Node executable
    var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
    process.init(file);

    var ObserverHandler = {
        // subject refers to the process nsIProcess object
        observe: function(subject, topic, data) {
            switch (topic) {
                // Process has finished running and closed
                case "process-finished":
                    break;
                // Process failed to run
                case "process-failed":
                    break;
                case "quit-application-granted":
                    // Shut down any Node.js processes
                    process.kill();
                    break;
            };
        }
    };

    // Run the Node process and observe for any changes
    var args = ["REPLACE_WITH_ABS_PATH_TO_NODE_SCRIPT"];
    process.runAsync(args, args.length, ObserverHandler);

    Services.obs.addObserver(ObserverHandler, "quit-application-granted", false);
})();