function openSettingsPage() {
    // TODO, 这个地方是打开界面的实现，但是我现在懒得去看kook的实现方法，反正不太麻烦，替换一下界面就可以，但是KOOK应该是有个地方存当前开启的是什么界面了，必须把这个改掉，不然替换后原来的界面会打不开，需要先开一下别的界面才能再打开原来的界面
    console.log("opened")
}

function buildGroup(groupName, elements) {
    let groupElement = document.createElement('div')
    groupElement.setAttribute("class", "mask-setting-nav-group")
    let groupNameElement = document.createElement('div')
    groupNameElement.setAttribute("class", "mask-nav-group-name")
    groupNameElement.innerText = groupName
    groupElement.appendChild(groupNameElement)
    for (let i = 0; i < elements.length; i++) {
        groupElement.appendChild(elements[i])
    }
    return groupElement
}

function buildGroupElement(elementName, clickFunction) {
    let elementElement = document.createElement('div')
    elementElement.setAttribute("class", "mask-nav-group-item")
    elementElement.click = function() {
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

let initializer = document.createElement("button")
initializer.onclick = function() {
    console.log("[Better KOOK] Trying to patch")
let settingsButton = document.evaluate('/html/body/div[1]/div/div[2]/div/div[2]/div[2]/div/div', document).iterateNext()
settingsButton.onclick = function() {
    // settingsButton.click() // 先执行原先的代码
    // 下面为添加元素
    setTimeout(function() {
        let settingsTabList = document.evaluate('/html/body/div[1]/div/div[2]/div[2]/div/div[1]/div/div', document).iterateNext()
        let groups = settingsTabList.getElementsByClassName("mask-setting-nav-group") // 获取所有的组
        let newGroups = Array()
        let clickers = Array()
        for (let i = 0; i < groups.length; i++) {
            if (i == 1) { // 你要添加分组的位置
                let elements = Array()
                elements.push(buildGroupElement("Better KOOK 设置", openSettingsPage))
                elements.push(buildGroupElement("主题", openSettingsPage))
                elements.push(buildGroupElement("插件", openSettingsPage))
                elements.push(buildGroupElement("资源市场", openSettingsPage))
                for (let j = 0; j < elements.length; j++) {
                    clickers.push(elements[j])
                }
                newGroups.push(buildGroup("BETTER KOOK", elements))
            }
            let elements = groups[i].getElementsByClassName("ask-nav-group-item")
            for (let j = 0; j < elements.length; j++) {
                clickers.push(elements[j])
            }
            newGroups.push(groups[i])
            settingsTabList.removeChild(groups[i]) // 移除旧元素
        }
        for (let i = 0; i < newGroups.length; i++) {
            settingsTabList.appendChild(newGroups[i]) // 重新添加元素
        }
        for (let i = 0; i < clickers.length; i++) { // 这一部分是让每个按钮点击前会清除其他元素的active状态
            let elementClicker = clickers[i].click
            clickers[i].click = function() {
                for (let j = 0; j < clickers.length; j++) {
                    clickers[j].setAttribute("class", "mask-nav-group-item")
                    elementClicker()
                }
            }
        }
    }, 1)
}
}
initializer.innerText = "Initialize"
document.body.appendChild(initializer) // 在console手动调一下这个button的onclick