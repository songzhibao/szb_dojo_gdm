define({
    menuBarContainer: null,
    toolBarContainer: null,
    stackController: null,
    stackContainer: null,
    getCurrentPane: function () {
        if (this.stackContainer != null) {
            return this.stackContainer.selectedChildWidget;
        }
        return null;
    },

    getRootPane: function () {
        if (this.stackContainer != null) {
            return this.stackContainer;
        }
        return null;
    },

    publishMainPane: function (eventId, param,msgType) {
        var mainList = null;
        if (document.getElementById("mainFrame"))
        {
            mainList = document.getElementById("mainFrame").children;
        }
        if (mainList && mainList.length > 0) {
            for (var num = 0; num < mainList.length; num++) {

                var mainFrameDocumnet = mainList[num].document;
                var mainFrame = mainList[num];
                if (mainFrameDocumnet == null) {
                    mainFrameDocumnet = mainList[num].contentDocument;
                    mainFrame = mainList[num].contentWindow;
                }
                if (msgType == "MSG") {
                    if (!mainFrame.IsAccessMsg) {
                        return;
                    }
                }
                else if (msgType == "GPS") {
                    if (!mainFrame.IsAccessGPS) {
                        return;
                    }
                }
                if (mainFrame && mainFrame.dojo && mainFrame.dojo.publish) {
                    mainFrame.dojo.publish(eventId, param);
                }
            }
        }
        else {
            var mainFrame = window;
            if (mainFrame && mainFrame.dojo && mainFrame.dojo.publish) {
                mainFrame.dojo.publish(eventId, param);
            }
        }
    },


    appLoader: null,
    appConfig: null,
    mapConfig: null,
    menuConfig: null
});