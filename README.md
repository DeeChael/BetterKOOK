# Better KOOK 实现思路

因为我不会javascript，所以有些东西我可能讲的不对，讲的仅仅只是个思路，并非完全可行。

## 关于修改元素

KOOK是在添加元素的时候直接为元素添加click的事件，所以元素都没有加id，所以想要给特定元素修改内容只能使用xpath了。

### 添加设置界面

由上述可知，事件是在创建元素时添加的，且KOOK的元素并非是隐藏式而是添加式，就是说，当点击后新显示的元素并非先前存在但是隐藏，而是点击后新添加的，所以想添加元素只能通过click事件。</br>

打开个人设置界面的xpath为

```html
/html/body/div[1]/div/div[2]/div/div[2]/div[2]/div/div
```

侧面栏位的container的xpath为

```html
/html/body/div[1]/div/div[2]/div[2]/div/div[1]/div/div
```

我个人想的实现思路是：

```js
let settingsButton = document.evaluate('/html/body/div[1]/div/div[2]/div/div[2]/div[2]/div/div'， document).iterateNext()
settingsButton.onclick = function() {
    // KOOK调用的时click，我们设置的是onclick，不会冲突，但是需要错一下时间
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
                groups.push(buildGroup("BETTER KOOK", elements))
            }
            let elements = groups[i].getElementsByClassName("ask-nav-group-item")
            for (let j = 0; j < elements.length; j++) {
                clickers.push(elements[j])
            }
            groups.push(groups[i])
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
    }, 1) // 使用timeout是因为加载界面时有一个延迟
    
}

function openSettingsPage() {
    // TODO, 这个地方是打开界面的实现，但是我现在懒得去看kook的实现方法，反正不太麻烦，替换一下界面就可以，但是KOOK应该是有个地方存当前开启的是什么界面了，必须把这个改掉，不然替换后原来的界面会打不开，需要先开一下别的界面才能再打开原来的界面
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
```

