*这是一个npm模块的源码, 该模块是基于ES6的Promise封装的的ajax, 特别是能非常简单地操作文件上传, 模块还提供了文件压缩、文件转换等方法.*
　<br><br><br>
*This is a NPM module source code, the module is based on ES6 Promise package ajax, especially can be very simple operation file upload, the module also provides file compression, file conversion and other methods.*
**The English API is at the back of the page!**<br><br><br>
**下载:**

```javascript
npm install umax
```

**引入:**

```javascript
import umax from 'umax'
```

**以下是本模块所有可使用的属性和方法:**

```javascript
umax.fixed  --- 每次调取接口都需要上传的固定参数, [可选] 如果设置该属性,必须设置成一个json
umax.beforeRequest  --- 每次调取接口前都执行的拦截, [可选] 如果设置该属性, 必须设置成一个function
umax.responsed  --- 每次调取接口完成后都会执行的函数, [可选] 如果设置该属性, 必须设置成一个function

umax.init(json)  --- 初始化umax对象的基础参数, <必须> *这个方法只能执行一次, 执行完之后会被自动注销

umax.set(json)  --- 可以设置一次性接口调用的基础参数, 返回umax对象本身

umax.get(url, [json|string])  --- 发送一个get请求, 返回promise
umax.post(url, [json|string])  --- 发送一个post请求, 返回promise
umax.form(url, [json])  --- *该方法可以非常简单地进行文件传输, 返回promise
umax.put(url, [json|string])  --- 发送一个put请求, 返回promise
umax.patch(url, [json|string])  --- 发送一个patch请求, 返回promise
umax.delete(url, [json|string])  --- 发送一个delete请求, 返回promise
umax.head(url)  --- 发送一个head请求, 返回promise
umax.options(url)  --- 发送一个options请求, 返回promise

umax._isJson(anything)  --- 判断一个元素是否为josn
umax._isBase64(string)  --- 判断一个字符串是否为base64字符串
umax._toBase64([file|blob])  --- 将file或者blob转成base64
umax._base64ToBlob(base64)  --- 将base64转成blob
umax._base64ToFile(base64)  --- 将base64转成file
umax._compress(json)  --- 压缩file
```

**使用:**

***api***

```javascript

```

**1:　.select()方法**

**.select()　　同步执行指定的mysql 查询语句 ( SELECT语句 )**

　参数 :<br>
　　**.select**( *sql*,　*arr* )<br>
　　`sql:　要执行的mysql语句　　　　　　　　必须`<br>
　　`arr:　防注入操作存放数据的数组　　　　可选`<br>

**基础案例 :**
```javascript

```

