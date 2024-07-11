function createPopupWindow() {
    chrome.windows.getCurrent({populate: false}, (currentWindow) => {
        const width = Math.min(800, Math.round(currentWindow.width * 0.9));
        const height = Math.min(400, Math.round(currentWindow.height * 0.9));
        const left = Math.round((currentWindow.width - width) / 2 + currentWindow.left);
        const top = Math.round((currentWindow.height - height) / 2 + currentWindow.top);

        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            width: width,
            height: height,
            left: left,
            top: top
        });
    });
}

chrome.commands.onCommand.addListener((command) => {
    if (command === "_execute_action") {
        createPopupWindow();
    }
});

chrome.action.onClicked.addListener((tab) => {
    createPopupWindow();
});