// IceTeaContainer
elementScript("IceTeaContainer", (container) => {
    elementScript("IceTeaContainer-navbar-search", (search_input) => {
        if (!elementExists("IceTeaContainer-navbar-searchresults")) {
            return;
        }
        search_input.oninput = function (event) {
            let value = (search_input as HTMLInputElement).value.trim();
            elementScript("IceTeaContainer-navbar-searchresults", (results) => {
                if (value === "") {
                    // close search
                    results.classList.add("hidden");
                } else {
                    results.hidden = false;
                    results.classList.remove("hidden");
                    // perform search
                }
            });
        }
    })
});

function elementExists(elemId: string): boolean {
    return document.getElementById(elemId) !== undefined;
}

function elementScript(elemId: string, callback: (element: HTMLElement) => void): void {
    let element = document.getElementById(elemId);
    if (element) {
        callback(element);
    }
}
