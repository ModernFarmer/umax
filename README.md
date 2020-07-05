*该模块是基于ES6的Promise封装的的ajax, 特别是能非常简单地操作文件上传, 模块还提供了文件压缩、文件转换等方法.*
<br><br><br>
*This module is based on ES6 Promise package ajax, especially can be very simple operation file upload, the module also provides file compression, file conversion and other methods.*
**The English API is at the back of the page!**<br><br><br>
**下载:**

```javascript
npm install umax
```

**引入:**

```javascript
import umax from 'umax'
```
*\*该模块未进行任何编译, 在某些情况下需要自行处理编译*
------
***比如在`vue-cli3.x`中使用时, 由于`vue-cli3`默认不编译`node_modules`中的文件, 导致项目在IE环境下会报错,  所以这个时候就需要在`vue.config.js`中做如下配置:***
```javascript
module.exports = {
  transpileDependencies: [/(?:[/\\]node_modules[/\\].?umax@.*[/\\])|(?:[/\\]node_modules[/\\]umax[/\\])/]
}
```
**以下是本模块所有可使用的属性和方法:**

```javascript
umax.fixed  --- 全局设置每次调取接口都需要上传的固定参数, [可选] 如果设置该属性,必须设置成一个json
umax.beforeRequest  --- 全局设置每次调取接口前都执行的拦截, [可选] 如果设置该属性, 必须设置成一个function
umax.responsed  --- 全局设置每次服务器成功返回后都会执行的函数, [可选] 如果设置该属性, 必须设置成一个function

umax.init(json)  --- 初始化umax对象的基础参数, <必须> *这个方法只能执行一次, 执行完之后会被自动注销, 无返回

umax.set(json)  --- 可以设置一次性接口调用的基础参数, 返回umax对象本身

umax.get(url, [json|string])  --- 发送一个get请求, 返回promise
umax.post(url, [json|string])  --- 发送一个post请求, 返回promise
umax.form(url, [json])  --- *该方法可以非常简单地进行文件传输, 返回promise
umax.put(url, [json|string])  --- 发送一个put请求, 返回promise
umax.patch(url, [json|string])  --- 发送一个patch请求, 返回promise
umax.delete(url, [json|string])  --- 发送一个delete请求, 返回promise
umax.head(url)  --- 发送一个head请求, 返回promise
umax.options(url)  --- 发送一个options请求, 返回promise

umax._isJson(anything)  --- 判断一个元素是否为json, 返回boolean
umax._isBase64(string)  --- 判断一个字符串是否为base64字符串, 返回boolean
umax._toBase64([file|blob])  --- 将file或者blob转成base64, 返回promise
umax._base64ToBlob(base64)  --- 将base64转成blob, 返回blob
umax._base64ToFile(base64)  --- 将base64转成file, 返回file
umax._compress(json)  --- 压缩file, 返回promise
```

**使用:**

1:  `umax.init()`
------

**.init()　　初始化umax对象的基础参数, 设置umax的全局配置(这个方法在执行了一次之后会自动被注销)**

　参数 :<br>
　　**.init**( *json* )<br>
　　　　*在调用umax对象其它方法之前必须先执行该方法来初始化对象的基础配置<br>
　　`json:　初始化参数　[json]　可选`<br>
　　　　`json: {`<br>
　　　　　　`baseUrl: [string],　　　　　　　设置基础访问地址 [可选] 默认为''`<br>
　　　　　　`timeout: [number],　　　　　　　设置最长响应时间 [可选]`<br>
　　　　　　`ontimeout: [function],　　　设置超过最长响应时间后的回调函数 [可选]`<br>
　　　　　　　　　　　　　　`(该函数自带固定参数: XMLHttpRequest对象)`<br>
　　　　　　`responseType: [string],　　　　设置返回的数据类型 [可选]`<br>
　　　　　　`headers: [json],　　　　　　　　设置请求头 [可选]`<br>
　　　　　　`onprogress: [function],　　　　设置下载进度执行函数 [可选]`<br>
　　　　　　　　　　　　　　`(自带固定参数: ProgressEvent对象,`<br>
　　　　　　　　`它的.loaded属性代表已经完成发送部分的文件大小[number])`<br>
　　　　　　`user: [string],　　　　　　　　　设置服务器验证账号 [可选]`<br>
　　　　　　`password: [string],　　　　　　　设置服务器验证密码 [可选]`<br>
　　　　　　`withCredentials: [boolean],　　设置是否可跨域携带cookie [可选] 默认为false   *IE10+`<br>
　　　　`}`<br>

**基础案例 :**
```javascript
umax.init({ // .init()方法能接收的json有效字段有:baseUrl、timeout、ontimeout、responseType、headers、onprogress、user、password、withCredentials
  baseUrl:'http://localhost:8080',  // 基础地址  默认''
  timeout:10000,  // 最长响应时间(单位:ms)  默认0(无限)
  ontimeout:function(xmlObj){  // 超过最长响应时间后执行的响应事件  默认null
    console.log(xmlObj.statusText)
  },
  responseType:'text',  // 设置接收类型  默认''
  headers:{  // 设置headers  默认null
    connection:'keep-alive',
    Keep-Alive:'timeout=20, max=2',
    ...
  },
  onprogress:function(e){  // 设置上传进度响应事件  默认null
    console.log(e.loaded/e.total);  // e.loaded:当前已上传文件大小(单位:b), e.total:当前上传文件的总大小(单位:b)
  },
  user:'userName',  // 设置服务器验证的user  默认null
  password:'userPwd'  // 设置服务器验证的password  默认null
});


也可以:

umax.init();   // 默认配置, 等同于umax({baseUrl:''});
```

2:  `umax.fixed`
------

**.fixed　　全局设置每次调取接口都需要上传的固定参数, 如果设置该属性,必须设置成一个json**

　参数 :<br>
　　**.fixed** = *json*  [可选]<br>
　　`json:　每次调取接口都需要上传的固定参数　　必须`<br>

**基础案例 :**
```javascript
umax.fixed={
  userId:'8888888888888888',
  token:'CYf3339aea-f92c-4158-91c6-dd741c1fa504',
  ...
}
```

3:  `umax.beforeRequest`
------

**.beforeRequest　　全局设置每次调取接口前都执行的拦截, 如果设置该属性,必须设置成一个function**

　参数 :<br>
　　**.beforeRequest** = *function*  [可选]<br>
　　`function:　每次调取接口前都执行的函数　　必须`<br>
　　　　`该函数自带固定参数*config*, 它代表umax对象的基础配置`<br>
　　　　`可以根据条件改变*config*内的值, 该函数最后必须返回这个*config*`</br>

**基础案例 :**
```javascript
umax.beforeRequest=function(config){
  // todo ...
  console.log(config);  // {baseUrl:'',timeout:null,ontimeout:null,responseType:'',headers:null,onprogress:null,user:null,password:null,withCredentials:false}
  if([some conditions]){
    config.baseUrl='http://localhost:8080'; // 可以对config对象进行配置
  }else{
    config.baseUrl='http://localhost:9090';
  };

  return config;  // 必须返回config
};
```

4:  `umax.responsed`
------

**.responsed　　全局设置每次调取接口后都执行的拦截, 如果设置该属性,必须设置成一个function**

　参数 :<br>
　　**.responsed** = *function*  [可选]<br>
　　`function:　每次服务器成功返回后都会执行的函数　　必须`<br>
　　　　`该函数自带固定参数*data*和*XMLObj*, 它们分别代表服务器返回的数据和XMLHttpRequest对象`<br>
　　　　`**这里对data进行的处理*不会*影响umax对象最终返回的数据!!!`<br>

**基础案例 :**
```javascript
umax.responsed=function(data, xmlObj){
  // todo ...
};
```

5:  `umax.set()`
------

**.set()　　设置一次性接口调用的基础参数, 返回umax对象本身**

　参数 :<br>
　　**.set**( *json* )<br>
　　　　.set()方法设置只对`单次`调取接口时有效, `不会`影响全局基础配置config<br>
　　`json:　初始化参数　[json]　必须 (json配置同.init()方法)`<br>

**基础案例 :**
```javascript
let json={
  baseUrl:'http://localhost:8081',
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

6:  `umax.get()`
------

**.get()　　通过get方式调取接口, 返回Promise**

　参数 :<br>
　　**.get**( *url,* *arg* )<br>
　　`url:　接口地址　[string]　必须`<br>
　　`arg:　接口所需参数　[json|string]　可选`<br>

**基础案例 :**
```javascript
umax.get('/demo', {id:666, value:'value'}).then(data=>{
	// todo ...
}).catch(err=>{
	// todo ...
});

也可以:

let data=await umax.get('/demo', 'id=666&value=value').catch(err=>{});  // 在async函数中使用

也可以:

let data=await umax.get('/demo?id=666&value=value').catch(err=>{});

**注: url参数头上的'/'可以写也可以不写, 所以你可以这样调用接口:

umax.get('demo/list').then(data=>{});  // 等同于umax.get('/demo/list').then(data=>{});
```

7:  `umax.post()`
------

**.post()　　通过post方式调取接口, 返回Promise**

　参数 :<br>
　　**.post**( *url,* *arg* )<br>
　　`url:　接口地址　[string]　必须`<br>
　　`arg:　接口所需参数　[json|string]　可选`<br>
　　　　**.post()方法的第二个参数可接收 `json字符串` 或者 `array字符串`,**<br>
　　　　**方法内部会自动将contentType设置成'aplication/json', 而不用手动去设置**<br>

**基础案例 :**
```javascript
let json={id:666, value:'value'};

umax.post('/demo', json).then(data=>{
	// todo ...
}).catch(err=>{
	// todo ...
});

也可以:

umax.post('/demo', JSON.stringify(json)).then(data=>{
	// todo ...
}).catch(err=>{
	// todo ...
});

*注: 如果发送的是'json字符串 或者 array字符串'且在调用umax的post()方法之前设置过固定参数, 如:调用post()之前这样设置: umax.fixed({id:'myId', token:'myToken'}), 那么.fixed()方法设置的参数会以key=name&key=name的方式拼接到url地址后面, 然后再将'json字符串 或者 array字符串'以contentType='aplication/json'的方式发送

也可以:

let data=await umax.post('/demo', 'id=666&value=value').catch(err=>{});  // 在async函数中使用

**注: url参数头上的'/'可以写也可以不写, 所以你可以这样调用接口:

umax.post('demo/list').then(data=>{});  // 等同于umax.post('/demo/list').then(data=>{});
```

8:  `umax.form()`
------

**.form()　　简单地通过FormData向服务器发送文件, 返回Promise**

　参数 :<br>
　　**.form**( *url,* *arg* )<br>
　　`url:　接口地址　[string]　必须`<br>
　　`arg:　接口所需参数　[json]　必须`<br>
　　　　`arg: {`<br>
　　　　　　`fieldName: [string], <必须>  传给后台的文件数据字段名`<br>
　　　　　　`files: [file|blob|array|json|HTMLInputElement],　<必须>　要发送的文件, 参考基础案例`<br>
　　　　　　`data: [json]   [可选]　　要发送的普通数据`<br>
　　　　`}`<br>

**基础案例 :**
```javascript
<html>
<input type="file" id="fileElement_1"/>
<input type="file" id="fileElement_2"/>
</html>

<script>
fileElement_1.onchange=async function(){
	let files=fileElement_1.files;
	// 下面虚拟两条blob数据...
	let blob1=这里是虚拟的Blob数据;
	let blob2=这里是虚拟的Blob数据;

	umax.form('/demo', {
		fieldName:'file',
		// files可接收参数: ↓↓↓↓↓↓

		files:files[0],  // 接收File
		files:umax._base64ToBlob(await umax._toBase64(files[0])),  // 接收Blob
		files:fileElement_1,  // 接收h5的input[type=file]元素, 将会把fileElement_1元素上所有的文件都发送
		files:{name:'name_1', file:files[0]}, // 接收{name:'name', file:file}数据, 如果files参数是一个json, umax对象会先判断name in json和file in json, 如果有, 则会像这样给后台发送文件:new FormData(fieldName, json.file, json.name), *这样只能发送一个文件*
		files:{'name_1.jpg':files[0], 'name_2.jpg':files[1]}, // 接收{name:file}数据, 如果files参数是一个json, 且没有'name'键名和'file'键名, 那么会像这样给后台发送文件:new FormData(fieldName, json[keyOfjson], keyOfjson), *这样可以发送多个文件*
		files:[blob1, blob2],  // 接收[Blob, Blob, ...]
		files:[fileElement_1, fileElement_2],  // 接收[HTMLInputElement, HTMLInputElement, ...], 将会把数组内所有元素上所有input[type=file]的文件都发送
		files:[...files],  // 接收[File, File, ...], 这里要特别注意, files不是array, 要先将其转换成array才能被方法接收
		files:[{name:'name_1', file:files[0]}, {name:'name_2', file:files[1]}], // 接收[Json, Json, ...]
			// ***特别注意: 如果files接收的是一个数组, 那么该数组内的值的类型必须保持一致, 不能混搭. 不能像这样传值 -> files:[{name:'a', file:File}, File]

		// files可接收参数: ↑↑↑↑↑↑
		data:{
			key1:'value1',
			key2:'value2',
			...
		}
	}).then(data=>{
		// todo ...
	}).catch(err=>{
		// todo ...
	});
};
</script>

**注: url参数头上的'/'可以写也可以不写, 所以你可以这样调用接口:

umax.form('demo/list', {...}).then(data=>{...});  // 等同于umax.form('/demo/list', {...}).then(data=>{...});
```

9:  `umax.put()`
------

**.put()　　通过put方式调取接口, 返回Promise**

　参数 :<br>
　　**.put**( *url,* *arg* )<br>
　　`url:　接口地址　[string]　必须`<br>
　　`arg:　接口所需参数　[json|string]　可选`<br>
　　　　**.put()方法的第二个参数可接收 `json字符串` 或者 `array字符串`,**<br>
　　　　**方法内部会自动将contentType设置成'aplication/json', 而不用手动去设置**<br>

**基础案例 :**
```javascript
**用法与umax.post()方法相同
```

10:  `umax.patch()`
------

**.patch()　　通过patch方式调取接口, 返回Promise**

　参数 :<br>
　　**.patch**( *url,* *arg* )<br>
　　`url:　接口地址　[string]　必须`<br>
　　`arg:　接口所需参数　[json|string]　可选`<br>
　　　　**.patch()方法的第二个参数可接收 `json字符串` 或者 `array字符串`,**<br>
　　　　**方法内部会自动将contentType设置成'aplication/json', 而不用手动去设置**<br>

**基础案例 :**
```javascript
**用法与umax.post()方法相同
```

11:  `umax.delete()`
------

**.delete()　　通过delete方式调取接口, 返回Promise**

　参数 :<br>
　　**.delete**( *url,* *arg* )<br>
　　`url:　接口地址　[string]　必须`<br>
　　`arg:　接口所需参数　[json|string]　可选`<br>
　　　　**.delete()方法的第二个参数可接收 `json字符串` 或者 `array字符串`,**<br>
　　　　**方法内部会自动将contentType设置成'aplication/json', 而不用手动去设置**<br>

**基础案例 :**
```javascript
**用法与umax.post()方法相同
```

12:  `umax.options()`
------

**.options()　　通过options方式调取接口, 返回Promise**

　参数 :<br>
　　**.options**( *url* )<br>
　　`url:　接口地址　[string]　必须`<br>

**基础案例 :**
```javascript
umax.options('/demo').then(data=>{
	console.log(data);
	/*
	***注: .options()方法返回将返回固定格式的数据: ↓↓↓↓↓↓
	{
		"headers":"content-type: text/plain; charset=utf-8\r\n",
		"statusText":"OK",
		"status":200,
		"responseURL":"http://localhost:8888/demo"
	}
	*/
}).catch(err=>{
	// todo ...
});

**注: url参数头上的'/'可以写也可以不写, 所以你可以这样调用接口:

umax.options('demo/list').then(data=>{});  // 等同于umax.options('/demo/list').then(data=>{});
```

13:  `umax.head()`
------

**.head()　　通过head方式调取接口, 返回Promise**

　参数 :<br>
　　**.head**( *url* )<br>
　　`url:　接口地址　[string]　必须`<br>

**基础案例 :**
```javascript
umax.head('/demo').then(data=>{
	console.log(data);
	/*
	***注: .head()方法返回将返回固定格式的数据: ↓↓↓↓↓↓
	{
		"headers":"content-type: text/plain; charset=utf-8\r\n",
		"statusText":"OK",
		"status":200,
		"responseURL":"http://localhost:8888/demo"
	}
	*/
}).catch(err=>{
	// todo ...
});

**注: url参数头上的'/'可以写也可以不写, 所以你可以这样调用接口:

umax.head('demo/list').then(data=>{});  // 等同于umax.head('/demo/list').then(data=>{});
```

14:  `umax._isJson()`
------

**._isJson()　　判断一个元素是否是json, 返回boolean**

　参数 :<br>
　　**._isJson**( *anything* )<br>
　　`anything:　要判断的元素　[any]　必须`<br>

**基础案例 :**
```javascript
console.log(umax._isJson({a:'a', b:'b'}));  // true
console.log(umax._isJson(['a', 'b'])); // false
```

15:  `umax._isBase64()`
------

**._isBase64()　　判断一个字符串是否是base64字符串, 返回boolean**

　参数 :<br>
　　**._isBase64**( *str* )<br>
　　`str:　要判断的字符串　[string]　必须`<br>

**基础案例 :**
```javascript
let str='abcdefg';

console.log(umax._isBase64(str));  // false
```

16:  `umax._toBase64()`
------

**._toBase64()　　将file或者blob转换成base64字符串, 返回Promise**

　参数 :<br>
　　**._toBase64**( *arg* )<br>
　　`arg:　要转换的file或者blob　[file|blob]　必须`<br>

**基础案例 :**
```javascript
<html>
<input type="file" id="fileElement"/>
</html>

<script>
fileElement.onchange=async function(){
	let base64='';
	if(fileElement.files.length>0){
		base64=await umax._toBase64(fileElement.files[0]);
	}

	if(umax._isBase64(base64)){
		console.log(typeof base64); // string
		alert('Oh, Yes!');
	}else{
		alert('Oh, No!');
	}
};
</script>
```

17:  `umax._base64ToBlob()`
------

**._base64ToBlob()　　将base64字符串转换成blob, 返回blob**

　参数 :<br>
　　**._base64ToBlob**( *str* )<br>
　　`str:　要转换的base64字符串　[string]　必须`<br>

**基础案例 :**
```javascript
<html>
<input type="file" id="fileElement"/>
</html>

<script>
fileElement.onchange=async function(){
	let base64='';
	if(fileElement.files.length>0){
		base64=await umax._toBase64(fileElement.files[0]);
	}

	if(umax._isBase64(base64)){
		let blob=umax._base64ToBlob(base64);
		
		umax.form('/demo/form', {fieldName:'blob', files:blob}).catch(()=>{
			alert('Oh, No!');
		});
	}else{
		alert('Oh, No!');
	}
};
</script>
```

18:  `umax._base64ToFile()`
------

**._base64ToFile()　　将base64字符串转换成file, 返回file**

　参数 :<br>
　　**._base64ToFile**( *str* )<br>
　　`str:　要转换的base64字符串　[string]　必须`<br>

**基础案例 :**
```javascript
<html>
<input type="file" id="fileElement"/>
</html>

<script>
fileElement.onchange=async function(){
	let base64='';
	if(fileElement.files.length>0){
		base64=await umax._toBase64(fileElement.files[0]);
	}

	if(umax._isBase64(base64)){
		let file=umax._base64ToFile(base64);
		
		umax.form('/demo/form', {fieldName:'file', files:file}).catch(()=>{  // 这只是做个试验, 请不要当真... 如果要发送文件, 直接发送fileElement.files[0]即可
			alert('Oh, No!');
		});
	}else{
		alert('Oh, No!');
	}
};
</script>
```

19:  `umax._compress()`
------

**._compress()　　压缩一个或者多个图片文件, 返回Promise**

　参数 :<br>
　　**._compress**( *json* )<br>
　　`json:　压缩的相关数据　[json]　必须`<br>
　　　　`json: {`<br>
　　　　　　`file: [file|array],　　要压缩的文件或者文件数组 <必须> 默认为''`<br>
　　　　　　`maxWidth: [number],　　设置压缩后的最大宽度 [可选] 默认为null`<br>
　　　　　　`maxHeight: [number],　　设置压缩后的最大高度 [可选] 默认为null`<br>
　　　　　　`quality: [number],　　设置压缩后的图片质量 [可选] 默认为1 (不压缩)`<br>
　　　　　　`type: [string],　　设置压缩后的图片格式 [可选] 默认为'image/jpeg'`<br>
　　　　`}`<br>
　　　　**file参数可以接收单个File文件或者一个File文件数组**<br>
　　　　**如果file参数是一个File文件, ._compress()方法将会返回一个resolve结果为Blob的Promise**<br>
　　　　**如果file参数是一个File文件数组, ._compress()方法将会返回一个resolve结果为按照File文件数组的顺序来排序的Blob数组的Promise**<br>
　　　　**一般情况下maxWidth和maxHeight只要设置一个就好, 设置了一个之后, 另一个会根据原图比例自动调整**<br>
　　　　**如果同时设置了maxWidth和maxHeight, maxWidth的优先级要高于maxHeight**<br>
　　　　**quality的有效值为0-1(不包括0, 但包括1)**<br>
　　　　**如果设置了有效quality, type参数将会失效, 返回的实际type固定为'image/jpeg'**<br>
**基础案例 :**
```javascript
<html>
<input type="file" multiple id="fileElement"/>
</html>

<script>
fileElement.onchange=async function(){
	let files=[...fileElement.files];
	if(files.length==1){
		let json={
			file:files[0],
			maxWidth:200,
			quality:.1
		};

		let blob=await umax._compress(json);

		umax.form('/demo/form', {fieldName:'blob', files:blob}).catch(()=>{
			alert('Oh, No!');
		});
	}else if(files.length>1){
		let json={
			file:files,
			maxWidth:200,
			quality:.1
		};

		let blobArr=await umax._compress(json);

		umax.form('/demo/form', {fieldName:'blob', files:blobArr}).catch(()=>{
			alert('Oh, No!');
		});
	}else{
		alert('Oh, No!');
	};
};
</script>
```
<br>

`English API  \>\>\>`
------

<br>

**Download:**

```javascript
npm install umax
```

**Import:**

```javascript
import umax from 'umax'
```

**Here are all the properties and methods available for this module:**

```javascript
umax.fixed  --- Global sets a fixed parameter that needs to be uploaded every time the fetch interface is accessed. [optional] if this property is set, it must be set as a json
umax.beforeRequest  --- Global sets the interception to be executed each time the interface is called. [optional] if this property is set, it must be set to a function
umax.responsed  --- Global sets the function to execute each time the server returns successfully. [optional] if this property is set, it must be a function

umax.init(json)  --- Initializes the base parameters of the umax object, <must> *This method can only be executed once and is automatically logged off with no return

umax.set(json)  --- You can set the underlying parameters of a one-time interface call, return the umax object itself

umax.get(url, [json|string])  --- Send a get request, return Promise
umax.post(url, [json|string])  --- Send a post request, return Promise
umax.form(url, [json])  --- *This method makes file transfer very simple, return Promise
umax.put(url, [json|string])  --- Send a put request, return Promise
umax.patch(url, [json|string])  --- Send a patch request, return Promise
umax.delete(url, [json|string])  --- Send a delete request, return Promise
umax.head(url)  --- Send a head request, return Promise
umax.options(url)  --- Send a options request, return Promise

umax._isJson(anything)  --- Determine if an element is json, return Boolean
umax._isBase64(string)  --- Determines whether a string is a base64 string, return Boolean
umax._toBase64([file|blob])  --- Convert file or blob to base64, return Promise
umax._base64ToBlob(base64)  --- Convert base64 to blob, return Blob
umax._base64ToFile(base64)  --- Convert base64 to file, return File
umax._compress(json)  --- To compressed file, return Promise
```

**Use:**

1:  `umax.init()`
------

**.init()　　Initializes the base parameters of the umax object, set the global configuration of umax(This method is automatically logged off after one execution)**

　parameter :<br>
　　**.init**( *json* )<br>
　　　　*This method must be executed to initialize the underlying configuration of the umax object before other methods are invoked<br>
　　`json:　Initialization parameter　[json]　optional`<br>
　　　　`json: {`<br>
　　　　　　`baseUrl: [string],　　　　　　　Set the base access address [optional] default ''`<br>
　　　　　　`timeout: [number],　　　　　　　Set the maximum response time [optional]`<br>
　　　　　　`ontimeout: [function],　　　Sets the callback function after the maximum response time [optional]`<br>
　　　　　　　　　　　　　　`(Built-in fixed parameters: XMLHttpRequest object)`<br>
　　　　　　`responseType: [string],　　　　Sets the data type returned [optional]`<br>
　　　　　　`headers: [json],　　　　　　　　Set request header [optional]`<br>
　　　　　　`onprogress: [function],　　　　Set the download progress execution function [optional]`<br>
　　　　　　　　　　　　　　`(Built-in fixed parameters: ProgressEvent object,`<br>
　　　　　　　　`Its.loaded property represents the size of the file that has completed sending the portion[number])`<br>
　　　　　　`user: [string],　　　　　　　　　Set the server authentication account [optional]`<br>
　　　　　　`password: [string]　　　　　　　Set the server authentication password [optional]`<br>
　　　　　　`withCredentials: [boolean],　　Sets whether cookies can be carried across domains [optional] default false    *IE10+`<br>
　　　　`}`<br>

**Based case :**
```javascript
umax.init({ // The json valid fields that the .init() method can receive are:baseUrl、timeout、ontimeout、responseType、headers、onprogress、user、password、withCredentials
  baseUrl:'http://localhost:8080',  // Base url  default ''
  timeout:10000,  // Maximum response time(unit:ms)  default 0(infinite)
  ontimeout:function(xmlObj){  // A response event executed after the maximum response time has been exceeded  default null
    console.log(xmlObj.statusText)
  },
  responseType:'text',  // Set receive type  default ''
  headers:{  // Set headers  default null
    connection:'keep-alive',
    Keep-Alive:'timeout=20, max=2',
    ...
  },
  onprogress:function(e){  // Set the upload progress response event  default null
    console.log(e.loaded/e.total);  // e.loaded:Currently uploaded file size(unit:b), e.total:The total size of the currently uploaded file(unit:b)
  },
  user:'userName',  // Set 'user' for server validation  default null
  password:'userPwd'  // Set 'password' for server authentication  default null
});


也可以:

umax.init();   // Default configuration, is equivalent to umax({baseUrl:''});
```

2:  `umax.fixed`
------

**.fixed　　Global sets the fixed parameters that need to be uploaded for each retrieval interface, If this property is set, it must be set to a json**

　Parameter :<br>
　　**.fixed** = *json*  [optional]<br>
　　`json:　Each call interface needs to upload fixed parameters　　<must>`<br>

**Based case :**
```javascript
umax.fixed={
  userId:'8888888888888888',
  token:'CYf3339aea-f92c-4158-91c6-dd741c1fa504',
  ...
}
```

3:  `umax.beforeRequest`
------

**.beforeRequest　　Global sets the interception to be performed each time an interface is invoked, If this property is set, it must be set to a function**

　Parameter :<br>
　　**.beforeRequest** = *function*  [optional]<br>
　　`function:　The function that executes each time the interface is called　　<must>`<br>
　　　　`This function comes with fixed parameters *config*, It represents the underlying configuration of the umax object`<br>
　　　　`You can change the value in *config* depending on the condition, The function must finally return this *config*`</br>

**Based case :**
```javascript
umax.beforeRequest=function(config){
  // todo ...
  console.log(config);  // {baseUrl:'',timeout:null,ontimeout:null,responseType:'',headers:null,onprogress:null,user:null,password:null,withCredentials:fasle}
  if([some conditions]){
    config.baseUrl='http://localhost:8080'; // 'onfig' can be configured
  }else{
    config.baseUrl='http://localhost:9090';
  };

  return config;  // Must return config
};
```

4:  `umax.responsed`
------

**.responsed　　Global sets the interception to be performed after each call to the interface, If this property is set, it must be set to a function**

　Parameter :<br>
　　**.responsed** = *function*  [optional]<br>
　　`function:　The function that executes each time after the server returns　　<must>`<br>
　　　　`This function comes with fixed arguments *data* and *XMLObj*, They represent the data returned by the server, and the XMLHttpRequest object, respectively`<br>
　　　　`**The processing of data here * does not * affect the data ultimately returned by the umax object!!!`<br>

**Based case :**
```javascript
umax.responsed=function(data, xmlObj){
  // todo ...
};
```

5:  `umax.set()`
------

**.set()　　Sets the underlying parameters of a one-time interface call, returning the umax object itself**

　Parameter :<br>
　　**.set**( *json* )<br>
　　　　Set () method Settings are only valid for `single` access to the interface, and `does not` affect the global underlying configuration config<br>
　　`json:　Initialization parameter　[json]　<must> (configuration of json is the same of .init() method)`<br>

**Based case :**
```javascript
let json={
  baseUrl:'http://localhost:8081',
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

umax.set(json).get('/demo', {id:888888}).then(data=>{ // !!! The configuration .set() method is only valid for this fetch of the interface
  // todo ...
}).catch(err=>{
  // todo ...
});
```

6:  `umax.get()`
------

**.get()　　Send a get request, return Promise**

　Parameter :<br>
　　**.get**( *url,* *arg* )<br>
　　`url:　Interface url　[string]　<must>`<br>
　　`arg:　Interface required parameters　[json|string]　[optional]`<br>

**Based case :**
```javascript
umax.get('/demo', {id:666, value:'value'}).then(data=>{
	// todo ...
}).catch(err=>{
	// todo ...
});

Can also be:

let data=await umax.get('/demo', 'id=666&value=value').catch(err=>{});  // Used in the async function

Can also be:

let data=await umax.get('/demo?id=666&value=value').catch(err=>{});

**Note: url parameter header '/' can be written or not written, so you can call the interface like this:

umax.get('demo/list').then(data=>{});  // Is equivalent to umax.get('/demo/list').then(data=>{});
```

7:  `umax.post()`
------

**.post()　　Send a post request, return Promise**

　Parameter :<br>
　　**.post**( *url,* *arg* )<br>
　　`url:　Interface url　[string]　<must>`<br>
　　`arg:　Interface required parameters　[json|string]　[optional]`<br>
　　　　**The second argument to the .post() method accepts either `json string` or `array string`,**<br>
　　　　**The contentType inside the method is automatically set to 'aplication/json' instead of manually**<br>

**Based case :**
```javascript
let json={id:666, value:'value'};

umax.post('/demo', json).then(data=>{
	// todo ...
}).catch(err=>{
	// todo ...
});

Can also be:

umax.post('/demo', JSON.stringify(json)).then(data=>{
	// todo ...
}).catch(err=>{
	// todo ...
});

**Note: If you're sending a 'json string or an array string 'and you've set the fixed parameters before calling umax's post() method, like: Set this before calling post(): umax.fixed({id:'myId', token:'myToken'}), then, the parameters set by the fixed() method are spliced after the url address as '?key=name&key=name', then send the 'json string or array string' as contentType='aplication/json'

Can also be:

let data=await umax.post('/demo', 'id=666&value=value').catch(err=>{});  // Used in the async function

**Note: url parameter header '/' can be written or not written, so you can call the interface like this:

umax.post('demo/list').then(data=>{});  // Is equivalent to umax.post('/demo/list').then(data=>{});
```

8:  `umax.form()`
------

**.form()　　Simply send a file through FormData to the server, return Promise**

　Parameter :<br>
　　**.form**( *url,* *arg* )<br>
　　`url:　Interface url　[string]　<must>`<br>
　　`arg:　Interface required parameters　[json]　<must>`<br>
　　　　`arg: {`<br>
　　　　　　`fieldName: [string], <must>  File data field name`<br>
　　　　　　`files: [file|blob|array|json|HTMLInputElement],　<must>　For files to send, refer to the base case`<br>
　　　　　　`data: [json]   [optional]　　Plain data to send`<br>
　　　　`}`<br>

**Based case :**
```javascript
<html>
<input type="file" id="fileElement_1"/>
<input type="file" id="fileElement_2"/>
</html>

<script>
fileElement_1.onchange=async function(){
	let files=fileElement_1.files;
	// Here are two virtual blobs of data...
	let blob1=(I'm a Blob);
	let blob2=(I'm a Blob);

	umax.form('/demo', {
		fieldName:'file',
		// Parameters that can be accepted by files : ↓↓↓↓↓↓

		files:files[0],  // Receive File
		files:umax._base64ToBlob(await umax._toBase64(files[0])),  // Receive Blob
		files:fileElement_1,  // Receive input[type=file] element, all files on the fileElement_1 element will be sent
		files:{name:'name_1', file:files[0]}, // Receive {name:'name', file:file} data, If the files parameter is a json, the umax object first execute 'name in json' and 'file in json', if true, It will send a file to the background like this: new FormData(fieldName, json.file, json.name), *Thus, only one file can be sent*
		files:{'name_1.jpg':files[0], 'name_2.jpg':files[1]}, // Receive {name:file} data, If the files parameter is a json, if there is no 'name' key and no 'file' key, It will send a file to the background like this:new FormData(fieldName, json[keyOfjson], keyOfjson), *In this way, multiple files can be sent*
		files:[blob1, blob2],  // Receive [Blob, Blob, ...]
		files:[fileElement_1, fileElement_2],  // Receive [HTMLInputElement, HTMLInputElement, ...], all 'input[type=file]' files on all elements in the array will be sent
		files:[...files],  // Receive [File, File, ...], it is important to note that 'files' are not array, and they must be converted to array before they can be received by the method
		files:[{name:'name_1', file:files[0]}, {name:'name_2', file:files[1]}], // Receive [Json, Json, ...]
			// ***Pay special attention to: if 'files' receives an array, the values in the array must be of the same type, can't mix. You can't pass values like this: -> files:[{name:'a', file:File}, File]

		// Parameters that can be accepted by files: ↑↑↑↑↑↑
		data:{
			key1:'value1',
			key2:'value2',
			...
		}
	}).then(data=>{
		// todo ...
	}).catch(err=>{
		// todo ...
	});
};
</script>

**Note: url parameter header '/' can be written or not written, so you can call the interface like this:

umax.form('demo/list', {...}).then(data=>{...});  // Is equivalent to umax.form('/demo/list', {...}).then(data=>{...});
```

9:  `umax.put()`
------

**.put()　　Send a put request, return Promise**

　Parameter :<br>
　　**.put**( *url,* *arg* )<br>
　　`url:　Interface url　[string]　<must>`<br>
　　`arg:　Interface required parameters　[json|string]　[optional]`<br>
　　　　**The second argument to the .put() method accepts either `json string` or `array string`,**<br>
　　　　**The contentType inside the method is automatically set to 'aplication/json' instead of manually**<br>

**Based case :**
```javascript
**It is used in the same way as the umax.post() method
```

10:  `umax.patch()`
------

**.patch()　　Send a patch request, return Promise**

　Parameter :<br>
　　**.patch**( *url,* *arg* )<br>
　　`url:　Interface url　[string]　<must>`<br>
　　`arg:　Interface required parameters　[json|string]　[optional]`<br>
　　　　**The second argument to the .patch() method accepts either `json string` or `array string`,**<br>
　　　　**The contentType inside the method is automatically set to 'aplication/json' instead of manually**<br>

**Based case :**
```javascript
**It is used in the same way as the umax.post() method
```

11:  `umax.delete()`
------

**.delete()　　Send a delete request, return Promise**

　Parameter :<br>
　　**.delete**( *url,* *arg* )<br>
　　`url:　Interface url　[string]　<must>`<br>
　　`arg:　Interface required parameters　[json|string]　[optional]`<br>
　　　　**The second argument to the .delete() method accepts either `json string` or `array string`,**<br>
　　　　**The contentType inside the method is automatically set to 'aplication/json' instead of manually**<br>

**Based case :**
```javascript
**It is used in the same way as the umax.post() method
```

12:  `umax.options()`
------

**.options()　　Send a options request, return Promise**

　Parameter :<br>
　　**.options**( *url* )<br>
　　`url:　Interface url　[string]　<must>`<br>

**Based case :**
```javascript
umax.options('/demo').then(data=>{
	console.log(data);
	/*
	***Note: the .options() method returns data in a fixed format: ↓↓↓↓↓↓
	{
		"headers":"content-type: text/plain; charset=utf-8\r\n",
		"statusText":"OK",
		"status":200,
		"responseURL":"http://localhost:8888/demo"
	}
	*/
}).catch(err=>{
	// todo ...
});

**Note: url parameter header '/' can be written or not written, so you can call the interface like this:

umax.options('demo/list').then(data=>{});  // Is equivalent to umax.options('/demo/list').then(data=>{});
```

13:  `umax.head()`
------

**.head()　　Send a head request, return Promise**

　Parameter :<br>
　　**.head**( *url* )<br>
　　`url:　Interface url　[string]　<must>`<br>

**Based case :**
```javascript
umax.head('/demo').then(data=>{
	console.log(data);
	/*
	***Note: the .head() method returns data in a fixed format: ↓↓↓↓↓↓
	{
		"headers":"content-type: text/plain; charset=utf-8\r\n",
		"statusText":"OK",
		"status":200,
		"responseURL":"http://localhost:8888/demo"
	}
	*/
}).catch(err=>{
	// todo ...
});

**Note: url parameter header '/' can be written or not written, so you can call the interface like this:

umax.head('demo/list').then(data=>{});  // Is equivalent to umax.head('/demo/list').then(data=>{});
```

14:  `umax._isJson()`
------

**._isJson()　　Determine if an element is json, return Boolean**

　Parameter :<br>
　　**._isJson**( *anything* )<br>
　　`anything:　Anything that need to be judged　[any]　<must>`<br>

**Based case :**
```javascript
console.log(umax._isJson({a:'a', b:'b'}));  // true
console.log(umax._isJson(['a', 'b'])); // false
```

15:  `umax._isBase64()`
------

**._isBase64()　　Determines if a string is a base64 string, return Boolean**

　Parameter :<br>
　　**._isBase64**( *str* )<br>
　　`str:　String that need to be judged　[string]　<must>`<br>

**Based case :**
```javascript
let str='abcdefg';

console.log(umax._isBase64(str));  // false
```

16:  `umax._toBase64()`
------

**._toBase64()　　Convert file or blob to base64 string, return Promise**

　Parameter :<br>
　　**._toBase64**( *arg* )<br>
　　`arg:　The file or blob that need to convert　[file|blob]　<must>`<br>

**Based case :**
```javascript
<html>
<input type="file" id="fileElement"/>
</html>

<script>
fileElement.onchange=async function(){
	let base64='';
	if(fileElement.files.length>0){
		base64=await umax._toBase64(fileElement.files[0]);
	}

	if(umax._isBase64(base64)){
		console.log(typeof base64); // string
		alert('Oh, Yes!');
	}else{
		alert('Oh, No!');
	}
};
</script>
```

17:  `umax._base64ToBlob()`
------

**._base64ToBlob()　　Convert base64 string to blob, return Blob**

　Parameter :<br>
　　**._base64ToBlob**( *str* )<br>
　　`str:　The base64 string that need to convert　[string]　<must>`<br>

**Based case :**
```javascript
<html>
<input type="file" id="fileElement"/>
</html>

<script>
fileElement.onchange=async function(){
	let base64='';
	if(fileElement.files.length>0){
		base64=await umax._toBase64(fileElement.files[0]);
	}

	if(umax._isBase64(base64)){
		let blob=umax._base64ToBlob(base64);
		
		umax.form('/demo/form', {fieldName:'blob', files:blob}).catch(()=>{
			alert('Oh, No!');
		});
	}else{
		alert('Oh, No!');
	}
};
</script>
```

18:  `umax._base64ToFile()`
------

**._base64ToFile()　　Convert base64 string to file, return File**

　Parameter :<br>
　　**._base64ToFile**( *str* )<br>
　　`str:　The base64 string that need to convert　[string]　<must>`<br>

**Based case :**
```javascript
<html>
<input type="file" id="fileElement"/>
</html>

<script>
fileElement.onchange=async function(){
	let base64='';
	if(fileElement.files.length>0){
		base64=await umax._toBase64(fileElement.files[0]);
	}

	if(umax._isBase64(base64)){
		let file=umax._base64ToFile(base64);
		
		umax.form('/demo/form', {fieldName:'file', files:file}).catch(()=>{  // This is just an experiment, please don't take it seriously... If you want to send files here, just send fileElement.files[0]
			alert('Oh, No!');
		});
	}else{
		alert('Oh, No!');
	}
};
</script>
```

19:  `umax._compress()`
------

**._compress()　　Compress one or more image files, return Promise**

　Parameter :<br>
　　**._compress**( *json* )<br>
　　`json:　Configuration data for ._compress() method　[json]　<must>`<br>
　　　　`json: {`<br>
　　　　　　`file: [file|array],　　The file or array of files that need to compress <must> default ''`<br>
　　　　　　`maxWidth: [number],　　Sets the maximum width after compression [optional] default null`<br>
　　　　　　`maxHeight: [number],　　Set the maximum height after compression [optional] default null`<br>
　　　　　　`quality: [number],　　Set the quality of the compressed image [optional] default 1 (Without compression)`<br>
　　　　　　`type: [string],　　Set the compressed image format [optional] default 'image/jpeg'`<br>
　　　　`}`<br>
　　　　**The 'file' argument can take a single 'File' file or an array of 'File' files**<br>
　　　　**If the 'file' argument is a 'File' file, the ._compress() method will return a Promise with a resolve result of Blob**<br>
　　　　**If the 'file' argument is an array of 'File' files, the ._compress() method will return a Promise that the resolve result is a Blob array sorted in the order of the array of 'File' files**<br>
　　　　**In general, 'maxWidth' and 'maxHeight' only need to be set one. After setting one, the other one will be adjusted automatically according to the scale of the original image**<br>
　　　　**If both 'maxWidth' and 'maxHeight' are set, 'maxWidth' has a higher priority than 'maxHeight'**<br>
　　　　**Valid value of 'quality' is 0-1(not including 0, but including 1)**<br>
　　　　**If the valid 'quality' is set, the 'type' parameter will be invalidated and the actual 'type' returned is fixed to 'image/jpeg'**<br>
**Based case :**
```javascript
<html>
<input type="file" multiple id="fileElement"/>
</html>

<script>
fileElement.onchange=async function(){
	let files=[...fileElement.files];
	if(files.length==1){
		let json={
			file:files[0],
			maxWidth:200,
			quality:.1
		};

		let blob=await umax._compress(json);

		umax.form('/demo/form', {fieldName:'blob', files:blob}).catch(()=>{
			alert('Oh, No!');
		});
	}else if(files.length>1){
		let json={
			file:files,
			maxWidth:200,
			quality:.1
		};

		let blobArr=await umax._compress(json);

		umax.form('/demo/form', {fieldName:'blob', files:blobArr}).catch(()=>{
			alert('Oh, No!');
		});
	}else{
		alert('Oh, No!');
	};
};
</script>
```
