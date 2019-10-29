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
umax.fixed  --- 全局设置每次调取接口都需要上传的固定参数, [可选] 如果设置该属性,必须设置成一个json
umax.beforeRequest  --- 全局设置每次调取接口前都执行的拦截, [可选] 如果设置该属性, 必须设置成一个function
umax.responsed  --- 全局设置每次调取接口完成后都会执行的函数, [可选] 如果设置该属性, 必须设置成一个function

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

****`1: umax.init()`****

**.init()　　初始化umax对象的基础参数, 设置umax的全局配置(这个方法在执行了一次之后会自动被注销)**

　参数 :<br>
　　**.init**( *json* )<br>
　　`json:　初始化参数　　必须`<br>
　　　　`json: {`<br>
　　　　　　`baseUrl: [string],　　　　　　　设置基础访问地址 <必须>`<br>
　　　　　　`timeout: [number],　　　　　　　设置最长响应时间 [可选]`<br>
　　　　　　`ontimeout: [function],　　　　　设置超过最长响应时间后的回调函数 [可选] (该函数自带固定参数: XMLHttpRequest对象)`<br>
　　　　　　`responseType: [string],　　　　设置返回的数据类型 [可选]`<br>
　　　　　　`headers: [json],　　　　　　　　设置请求头 [可选]`<br>
　　　　　　`onprogress: [function],　　　　设置下载进度执行函数 [可选] (自带固定参数: ProgressEvent对象, 它的.loaded属性代表已经完成发送部分的文件大小[number])`<br>
　　　　　　`user: [string],　　　　　　　　　设置服务器验证账号 [可选]`<br>
　　　　　　`password: [string]　　　　　　　设置服务器验证密码 [可选]`<br>
　　　　`}`<br>

**基础案例 :**
```javascript
umax.init({
  baseUrl:'http://localhost:8080',
  timeout:10000,
  ontimeout:function(xmlObj){
    console.log(xmlObj.statusText)
  },
  responseType:'text',
  headers:{
    connection:'keep-alive',
    Keep-Alive:'timeout=20, max=2',
    ...
  },
  onprogress:function(e){
    console.log(e.loaded/e.total);
  },
  user:'userName',
  password:'userPwd'
});
```

**`2: umax.fixed`**

**.fixed　　全局设置每次调取接口都需要上传的固定参数, 如果设置该属性,必须设置成一个json**

　参数 :<br>
　　**.fixed** = *json*<br>
　　`json:　每次调取接口都需要上传的固定参数　　必须`<br>

**基础案例 :**
```javascript
umax.fixed={
  userId:'8888888888888888',
  token:'CYf3339aea-f92c-4158-91c6-dd741c1fa504',
  ...
}
```

**`3: umax.beforeRequest`**

**.beforeRequest　　全局设置每次调取接口前都执行的拦截, 如果设置该属性,必须设置成一个function**

　参数 :<br>
　　**.beforeRequest** = *function*<br>
　　`function:　每次调取接口前都执行的函数　　必须`<br>
　　　　`该函数自带固定参数config, 它代表umax对象的基础配置`
　　　　`可以根据条件改变config内的值, 该函数最后必须返回这个config`

**基础案例 :**
```javascript
umax.beforeRequest=function(config){
  // todo ...
  console.log(config);  // {baseUrl:'http://localhost:8080',timeout:null,ontimeout:null,responseType:'',headers:null,onprogress:null,user:null,password:null}
  if([some conditions]){
    config.baseUrl='http://localhost:8080'; // 可以对config对象进行配置
  }else{
    config.baseUrl='http://localhost:9090';
  };

  return config;  // 必须返回config
};
```

**`4: umax.responsed`**

**.responsed　　全局设置每次调取接口前都执行的拦截, 如果设置该属性,必须设置成一个function**

　参数 :<br>
　　**.responsed** = *function*<br>
　　`function:　每次调取接口前都执行的函数　　必须`<br>
　　　　`该函数自带固定参数config, 它代表umax对象的基础配置`
　　　　`可以根据条件改变config内的值, 该函数最后必须返回这个config`

**基础案例 :**
```javascript
umax.responsed=function(config){
  // todo ...
  console.log(config);  // {baseUrl:'http://localhost:8080',timeout:null,ontimeout:null,responseType:'',headers:null,onprogress:null,user:null,password:null}
  if([some conditions]){
    config.baseUrl='http://localhost:8080'; // 可以对config对象进行配置
  }else{
    config.baseUrl='http://localhost:9090';
  };

  return config;  // 必须返回config
};
```

**`5: umax.set()`**

**.set()　　设置一次性接口调用的基础参数, 返回umax对象本身**

　参数 :<br>
　　**.set**( *json* )<br>
　　`json:　初始化参数　　必须`<br>
　　　　`json: {`<br>
　　　　　　`baseUrl: [string],　　　　　　　设置基础访问地址 [可选]`<br>
　　　　　　`timeout: [number],　　　　　　　设置最长响应时间 [可选]`<br>
　　　　　　`ontimeout: [function],　　　　　设置超过最长响应时间后的回调函数 [可选] (该函数自带固定参数: XMLHttpRequest对象)`<br>
　　　　　　`responseType: [string],　　　　设置返回的数据类型 [可选]`<br>
　　　　　　`headers: [json],　　　　　　　　设置请求头 [可选]`<br>
　　　　　　`onprogress: [function],　　　　设置下载进度执行函数 [可选] (自带固定参数: ProgressEvent对象, 它的.loaded属性代表已经完成发送部分的文件大小[number])`<br>
　　　　　　`user: [string],　　　　　　　　　设置服务器验证账号 [可选]`<br>
　　　　　　`password: [string]　　　　　　　设置服务器验证密码 [可选]`<br>
　　　　`}`<br>

**基础案例 :**
```javascript
let json={
  baseUrl:'http://localhost:8080',
  timeout:10000,
  ontimeout:function(xmlObj){
    console.log(xmlObj.statusText)
  },
  responseType:'text',
  headers:{
    connection:'keep-alive',
    Keep-Alive:'timeout=20, max=2',
    ...
  },
  onprogress:function(e){
    console.log(e.loaded/e.total);
  },
  user:'userName',
  password:'userPwd'
};

umax.set(json).get('/demo', {id:888888}).then(data=>{ // !!! .set()方法设置的配置只对本次调取接口时有效
  // todo ...
}).catch(err=>{
  // todo ...
});
```
