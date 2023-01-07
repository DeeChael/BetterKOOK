# Better KOOK 实现思路

因为我不会javascript，所以有些东西我可能讲的不对，讲的仅仅只是个思路，并非完全可行。

## 试用我制作的测试用JS

先把测试用的betterkook.js下载下来，然后找到你的KOOK安装目录，其结构应该像这样：

```shell
app-版本号 // 如果符合该格式的文件夹有多个，选择版本号最新的那个
packages
app.ico
KOOK.exe
Update.exe
...
```

然后进入这个位置：

```shell
app-版本号/resources/app/webapp/build
```

然后使用Visual Studio Code打开index.htm并格式化一下代码，然后在head中所有script下面添加一行：

```html
<script defer="defer" src="/app/static/js/betterkook.js"></script>
```

整个head应该会是这个样子：

```html
<head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" id="favicon" href="/app/favicon.ico" />
    <meta name="theme-color" content="#000000" />
    <meta name="keywords" content="/* 省略 */" />
    <meta name="description" content="/* 省略 */" />
    <meta property="og:site_name" content="KOOK" />
    <meta property="og:image" content="https://www.kookapp.cn/favicon.ico" />
    <meta property="og:image:type" content="image/ico" />
    <meta name="theme-color" content="#46a5f7" />
    <title>KOOK</title>
    <script>/* 省略 */</script>
    <script src="https://g.alicdn.com/AWSC/AWSC/awsc.js"></script>
    <script src="/app/assets/lib/aes.js"></script>
    <script src="/app/assets/lib/twemoji.12.1.5.min.js"></script>
    <script src="/app/assets/lib/libamr-min.js"></script>
    <script src="/app/assets/lib/pcmdata-2.0.0.min.js"></script>
    <script src="/app/assets/lib/markdown-parse.0.0.10.js"></script>
    <script src="/app/assets/lib/pinyin-pro.js"></script>
    <script>/* 省略 */</script>
    <script defer="defer" src="/app/static/js/511.ca200e06.js"></script>
    <script defer="defer" src="/app/static/js/746.fa49afd1.js"></script>
    <script defer="defer" src="/app/static/js/922.2712323c.js"></script>
    <script defer="defer" src="/app/static/js/208.c13c6f42.js"></script>
    <script defer="defer" src="/app/static/js/828.586b4610.js"></script>
    <script defer="defer" src="/app/static/js/339.11e75af2.js"></script>
    <script defer="defer" src="/app/static/js/index.86b523b4.js"></script>
    <script defer="defer" src="/app/static/js/betterkook.js"></script> <!-- 你添加的应该在这个位置 -->
    <link href="/app/static/css/511.df0aac1c.chunk.css" rel="stylesheet">
    <link href="/app/static/css/299.6e986aa8.chunk.css" rel="stylesheet">
    <link href="/app/static/css/208.7c80b43f.chunk.css" rel="stylesheet">
    <link href="/app/static/css/339.54c4ba9b.chunk.css" rel="stylesheet">
    <link href="/app/static/css/88.b015417e.chunk.css" rel="stylesheet">
    <link href="/app/static/css/index.48223a00.chunk.css" rel="stylesheet">
</head>
```

然后将下载好的betterkook.js放到这个位置：

```shell
app-版本号/resources/app/webapp/build/static/js/betterkook.js
```

然后重启你的KOOK客户端，等待几秒等BetterKOOK加载完成，打开设置应该能看到测试用的栏位。

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
## 一些接口的设想

```js
function getFriends() {
    ... // 返回一个数组，里面是所有好友的id
}
    
function getGuilds() {
    ... // 返回一个数组，里面是所有加入服务器的id，如果有分组，则会再套一个数组，例如：[111, [222, 333], 444]
}
    
function getFriendRequests() {
    ... // 返回一个数组，里面是所有好友请求的请求id
}

// 事件
function registerListener(eventName, listenerFunc) { // 第一个参数为事件名称，第二个参数为监听器
    ...
}
// 事件监听器举例
function onMessage(event) {
    ... // 使用 registerListener("message", onMessage) 注册，event参数为一个MessageEvent对象，MessageEvent的内容会在以后设计
}
```

