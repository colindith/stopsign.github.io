function toggleSettingsBox() {
    if(menuOpen === "settings") {
        closeSettingsBox();
    } else  {
        openSettingsBox();
    }
    adjustMenus();
}
function openSettingsBox() {
    menuOpen = "settings";
    adjustMenus();
}
function closeSettingsBox() {
    menuOpen = "";
    adjustMenus();
}
function toggleHelp() {
    if(menuOpen === "help") {
        closeHelpBox()
    } else  {
        openHelpBox()
    }
    adjustMenus();
}
function openHelpBox() {
    menuOpen = "help";
    adjustMenus();
}
function closeHelpBox() {
    menuOpen = "";
    adjustMenus();
}
function toggleBuild() {
    if(menuOpen === "build") {
        closeBuildBox()
    } else  {
        openBuildBox()
    }
    adjustMenus();
}
function openBuildBox() {
    menuOpen = "build";
    adjustMenus();
}
function closeBuildBox() {
    menuOpen = "";
    adjustMenus();
}
function toggleLevelMenu() {
    if(menuOpen === "level") {
        closeLevelBox()
    } else  {
        openLevelBox()
    }
    adjustMenus();
}
function openLevelBox() {
    menuOpen = "level";
    adjustMenus();
}
function closeLevelBox() {
    menuOpen = "";
    adjustMenus();
}

function adjustMenus() {
    closeMenus();
    if(menuOpen === "help") {
        document.getElementById('helpBox').style.display = "block";
        document.getElementById('infoPanel').style.display = "block";
    } else if(menuOpen === "settings") {
        document.getElementById('settingsBox').style.display = "block";
        document.getElementById('infoPanel').style.display = "block";
    } else if(menuOpen === "build") {
        document.getElementById('buildBox').style.display = "block";
        document.getElementById('infoPanel').style.display = "block";
    } else if(menuOpen === "level") {
        document.getElementById('levelBox').style.display = "block";
        document.getElementById('infoPanel').style.display = "block";
    } else if(selected.length > 0) {
        document.getElementById('infoBox').style.display = "block";
        document.getElementById('infoPanel').style.display = "block";
    }
}

function closeMenus() {
    document.getElementById('infoBox').style.display = "none";
    document.getElementById('buildBox').style.display = "none";
    document.getElementById('levelBox').style.display = "none";
    document.getElementById('settingsBox').style.display = "none";
    document.getElementById('helpBox').style.display = "none";
    document.getElementById('infoPanel').style.display = "none";
}

function selectOneOrMultipleSetting(num) {
    settings.selectOneOrMultiple = num;
}
function selectBuyLowestOrAll(num) {
    settings.buyLowestOrAll = num;
}
function selectLastOrLowest(num) {
    settings.showLastOrLowest = num;
}
function selectAllOrLowestBorderColor(num) {
    settings.selectAllOrLowestBorderColor = num;
}
function selectShowNoneOrNanitesOrAmount(num) {
    settings.selectShowNoneOrNanitesOrAmount = num;
    theView.update();
}

function buyAmountOption(num) {
    var highlighted = document.getElementById('buy'+settings.buyPerClick);
    if(highlighted) {
        highlighted.style.backgroundColor = "grey";
    }
    settings.buyPerClick = num;
    document.getElementById('buy'+num).style.backgroundColor = "#ff4400";


    theView.updateInfoBox();

}