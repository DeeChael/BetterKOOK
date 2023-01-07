class DivOwner {

    constructor() {

    }

    asElement() {
    }

}

class SettingsElement extends DivOwner {

    constructor() {
        super()
    }

}

class ImageElement extends SettingsElement {

    constructor(url) {
        super()
        this.divElement = document.createElement("div")
        this.divElement.setAttribute("class", "account-contain-box")
        let imageElement = document.createElement("div")
        imageElement.setAttribute("class", "account-user-banner has-banner")
        imageElement.setAttribute("style", 'background-image: url("' + url + '");')
        this.divElement.appendChild(imageElement)
    }

    asElement() {
        return this.divElement
    }

}

class SectionElement extends SettingsElement {

    constructor(title, description = null) {
        super()
        this.divElement = document.createElement("div")
        this.divElement.setAttribute("class", "setting-form-item is-description column")
        let labelElement = document.createElement("div")
        labelElement.setAttribute("class", "setting-form-label")
        let titleElement = document.createElement("div")
        titleElement.setAttribute("class", "title")
        titleElement.innerText = title
        labelElement.appendChild(titleElement)
        if (description !== null) {
            let descriptionElement = document.createElement("div")
            descriptionElement.setAttribute("class", "description")
            descriptionElement.innerText = description
            labelElement.appendChild(descriptionElement)
        }
        this.divElement.appendChild(labelElement)
    }

    asElement() {
        return this.divElement
    }

}

class SettingsPanel extends DivOwner {

    constructor(name) {
        super()
        this.divElement = document.createElement("div")
        this.divElement.setAttribute("class", "setting-page-panel")
        let headerElement = document.createElement("div")
        headerElement.setAttribute("class", "setting-page-panel-header")
        let titleElement = document.createElement("div")
        titleElement.setAttribute("class", "title")
        titleElement.innerText = name
        headerElement.appendChild(titleElement)
        this.divElement.appendChild(headerElement)
    }

    append(element) {
        if (!(element instanceof SettingsElement)) {
            throw new Error("Not a SettingsElement")
        }
        this.divElement.appendChild(element.asElement())
    }

    asElement() {
        return this.divElement
    }

}

class SettingsPage extends DivOwner {
    
    constructor(title, description = null) {
        super()
        this.divElement = document.createElement("div")
        this.divElement.setAttribute("class", "setting-page")
        this.divElement.setAttribute("betterkook", "true")
        let headerElement = document.createElement("div")
        headerElement.setAttribute("class", "setting-page-header")
        let titleElement = document.createElement("div")
        titleElement.setAttribute("class", "title")
        titleElement.innerText = title
        headerElement.appendChild(titleElement)
        if (description !== null) {
            let descriptionElement = document.createElement("div")
            descriptionElement.setAttribute("class", "description")
            descriptionElement.innerText = description
            headerElement.appendChild(descriptionElement)
        }
        this.divElement.appendChild(headerElement)
    }

    append(panel) {
        if (!(panel instanceof SettingsPanel)) {
            throw new Error("Not a SettingsPanel")
        }
        this.divElement.appendChild(panel.asElement())
    }

    asElement() {
        return this.divElement
    }

}

function _clearNodes(element) {
    let nodes = element.childNodes
    for (let i = 0; i < nodes.length; i++) {
        element.removeChild(nodes[i])
    }
}

function _hideNodes(element) {
    let nodes = element.childNodes
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute("style", "display: none;")
    }
}

function _resolveBetterKook() {
    let container = document.evaluate("/html/body/div[1]/div/div[2]/div[2]/div/div[2]/div[1]", document).iterateNext()
    let nodes = container.childNodes
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if (node.hasAttribute("betterkook")) {
            node.setAttribute("style", "display: none;")
        } else if (node.hasAttribute("style") && node.getAttribute("style") === "display: none;") {
            node.removeAttribute("style")
        }
    }
}

function showSettingsPage(settingsPage) {
    if (!(settingsPage instanceof SettingsPage)) {
        throw new Error("Not a SettingsPage")
    }
    let container = document.evaluate("/html/body/div[1]/div/div[2]/div[2]/div/div[2]/div[1]", document).iterateNext() // 这个是设置界面的侧边栏，客户端和网页版的xpath有区别，这个是客户端的xpath
    // _clearNodes(container)
    _hideNodes(container)
    container.appendChild(settingsPage.asElement())
}

function openSettingsPage() {
    // TODO, 这个地方是打开界面的实现，但是我现在懒得去看kook的实现方法，反正不太麻烦，替换一下界面就可以，但是KOOK应该是有个地方存当前开启的是什么界面了，必须把这个改掉，不然替换后原来的界面会打不开，需要先开一下别的界面才能再打开原来的界面
    console.log("opened")
}

function buildTestSettings() {
    let page = new SettingsPage("Better KOOK 设置", "这里是Better KOOK的设置，与KOOK本身无关")
    let panel = new SettingsPanel("测试用Panel")
    panel.append(new ImageElement("https://uploadstatic.mihoyo.com/puzzle/upload/puzzle/2022/11/30/546aa4fc739fc12535d19e47dc89c9ee_3039402973052014666.png"))
    panel.append(new SectionElement("这是title", "这是description"))
    page.append(panel)
    return page
}

function buildGroup(groupName, elements) {
    let groupElement = document.createElement('div')
    groupElement.setAttribute("class", "mask-setting-nav-group")
    let groupNameElement = document.createElement('div')
    groupNameElement.setAttribute("class", "mask-nav-group-name")
    groupNameElement.innerText = groupName
    groupElement.appendChild(groupNameElement)
    for (let i = 0; i < elements.length; i++) {
        if (elements[i])
            groupElement.appendChild(elements[i])
    }
    return groupElement
}

function buildGroupElement(elementName, clickFunction) {
    let elementElement = document.createElement('div')
    elementElement.setAttribute("class", "mask-nav-group-item")
    elementElement.onclick = function () {
        // TODO, 先看上面的TODO，到时候这里需要修改那个变量，并判断是否当前界面已被active，直接return，不重复执行
        elementElement.setAttribute("class", "mask-nav-group-item active")
        clickFunction()
    }
    let elementNameElement = document.createElement('div')
    elementNameElement.setAttribute("class", "nav-text")
    elementNameElement.innerText = elementName
    elementElement.appendChild(elementNameElement)
    return elementElement
}

(async () => {
    // return;
    setTimeout(() => {
        console._log("[Better KOOK] Trying to patch")
        let settingsButton = document.evaluate('/html/body/div[1]/div/div[2]/div/div[2]/div[2]/div/div', document).iterateNext();
        settingsButton.onclick = function () {
            // settingsButton.click() // 先执行原先的代码
            // 下面为添加元素
            setTimeout(function () {
                let settingsTabList = document.evaluate('/html/body/div[1]/div/div[2]/div[2]/div/div[1]/div/div', document).iterateNext()
                // let groups = settingsTabList.getElementsByClassName("mask-setting-nav-group") // 获取所有的组
                let groups = settingsTabList.childNodes // 获取所有的组及分界线
                let clickers = Array()
                let position = 1;
                let newGroups = [];
                let elements = [];
                elements.push(buildGroupElement("Better KOOK 设置", function() {
                    setTimeout(function() {
                        showSettingsPage(buildTestSettings())
                    }, 1)
                }))
                elements.push(buildGroupElement("主题", openSettingsPage))
                elements.push(buildGroupElement("插件", openSettingsPage))
                elements.push(buildGroupElement("资源市场", openSettingsPage))
                for (let j = 0; j < elements.length; j++) {
                    clickers.push(elements[j])
                }
                for (let i = 0; i < groups.length; ++i) {
                    if (i == position) {
                        newGroups.push(buildGroup("BETTER KOOK", elements));
                    }
                    newGroups.push(groups[i]);
                    let elementss = groups[i].getElementsByClassName("mask-nav-group-item")
                    for (let j = 0; j < elementss.length; j++) {
                        clickers.push(elementss[j])
                    }

                }
                for (let i = 0; i < newGroups.length; i++) {
                    settingsTabList.appendChild(newGroups[i]) // 重新添加元素
                }
                for (let i = 0; i < clickers.length; i++) { // 这一部分是让每个按钮点击前会清除其他元素的active状态
                    let elementClicker = clickers[i].onclick
                    clickers[i].onclick = function () {
                        let container = document.evaluate("/html/body/div[1]/div/div[2]/div[2]/div/div[2]/div[1]", document).iterateNext()
                        // _clearNodes(container)
                        _resolveBetterKook(container)
                        for (let j = 0; j < clickers.length; j++) {
                            if (clickers[j])
                                clickers[j].setAttribute("class", "mask-nav-group-item")
                        }
                        elementClicker()
                    }
                }
            }, 1)
        }
        console._log("[Better KOOK] Patched")
        let settingsTabList = document.evaluate('/html/body/div[1]/div/div[2]/div[2]/div/div[1]/div/div', document).iterateNext()
        if (settingsTabList !== null) {
            settingsButton.onclick()
        }
    }, 10000);
})()
