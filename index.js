if(!HTMLCanvasElement.prototype.toBlob){    // 如果canvas对象没有toBlob方法原型, 则加上(即兼容低版本浏览器)
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function(callback, type, quality){
            let _this=this;
            setTimeout(function(){
                let binStr=atob(_this.toDataURL(type, quality).split(',')[1]);
                let len=binStr.length;
                let arr=new Uint8Array(len);
                for(let i=0; i<len; i++){
                    arr[i]=binStr.charCodeAt(i);
                };
                callback(new Blob([arr], {type:type || 'image/jpeg'}));
            });
        }
    });
}
    
export default (function(BEFORE_OPEN, BEFORE_SEND, READY_RESPONSED, TOBE_ENCODED, TEMPORARY, __BEFORE, __REQEUST, __CHECK_RESPONSED){
    class ___UM_ajax{
        constructor(){
            /*this.config={  // ajax的全局配置
                baseUrl:'http://localhost:8888', // *必须 [string] 设置基础访问地址
                timeout:null, // [number] 设置超时时间
                ontimeout:null,  // [function] 设置超时执行函数  自带固定参数: XMLHttpRequest对象
                responseType:'', // [string] 设置返回的数据类型
                headers:null, // [json] 设置请求头
                onprogress:null  // [function] 设置下载进度执行函数  自带固定参数: ProgressEvent对象, 它的.loaded属性代表已经完成发送部分的文件大小[number], 它的.total属性代表整个文件大小[number]
            };*/
            this.config=null;
            this[TEMPORARY]=null;  // 存放单次临时数据的对象
            this.fixed=null;  // 存放每次请求的固定参数
            this.beforeRequest=function(config){  // 请求发送前触发 [function]  默认null  自带固定参数: config对象; 代表ajax的*全局*配置
                // 如果beforeRequest里面有异步函数, 则必须返回一个Promise
                // 比如:
                /*return new Promise((resolve, reject)=>{
                    setTimeout(()=>{
                        // todo ...
                        resolve(config);
                    }, 2000);
                });*/
                // todo ...
                return config;  // 必须返回config
            };
            this.responsed=function(result, XMLObj){  // 接收请求数据后立即触发 [function]  默认null  自带固定参数: 1:接收到的数据, 2:XMLHttpRequest对象; 代表ajax的*全局*配置
                // todo
            };
            this.init=function(json){
                let result={};
                result.baseUrl=json.baseUrl || null;
                result.timeout=json.timeout || null;
                result.ontimeout=json.ontimeout || null;
                result.responseType=json.responseType || null;
                result.headers=json.headers || null;
                result.onprogress=json.onprogress || null;
                result.user=json.user || null;
                result.password=json.password || null;
                if(typeof result.baseUrl==='string' && /^https?\:\/\//.test(result.baseUrl)){
                    this.config=result;
                    delete this.init;
                }else{
                    throw ' -> umax初始化失败!';
                };
            };
        }
        set(json){
            let result={};
            if(json.baseUrl)result.baseUrl=json.baseUrl;
            if(json.timeout)result.timeout=json.timeout;
            if(json.ontimeout)result.ontimeout=json.ontimeout;
            if(json.responseType)result.responseType=json.responseType;
            if(json.headers)result.headers=json.headers;
            if(json.onprogress)result.onprogress=json.onprogress;
            if(json.user)result.user=json.user;
            if(json.password)result.password=json.password;
            if(JSON.stringify(result)!=='{}')this[TEMPORARY]=result;
            return this;
        }
        get(url, json){
            if(!this.config)throw ' -> umax对象未初始化, 请先执行.init()方法初始化ajax对象!';
            return new Promise(async (resolve, reject)=>{
                let _a=await this[BEFORE_OPEN]();
                let {ajaxObj,trueConfig}=_a;
                let dataObj=null;
                if(json)dataObj=this[TOBE_ENCODED](json);
                let trueUrl=dataObj?trueConfig.baseUrl+url+'?'+dataObj.encoded:trueConfig.baseUrl+url;
                ajaxObj.open('GET', trueUrl, true, trueConfig.user, trueConfig.password);
                this[BEFORE_SEND](ajaxObj, trueConfig);
                ajaxObj.send();
                ajaxObj.onreadystatechange=this[READY_RESPONSED].bind(this, resolve, reject, ajaxObj);
            });
        }
        post(url, json){
            return this[__REQEUST](url, 'POST', json);
        }
        put(url, json){
            return this[__REQEUST](url, 'PUT', json);
        }
        delete(url, json){
            return this[__REQEUST](url, 'DELETE', json);
        }
        patch(url, json){
            return this[__REQEUST](url, 'PATCH', json);
        }
        head(url){
            return new Promise(async (resolve, reject)=>{
                let _a=await this[BEFORE_OPEN]();
                let {ajaxObj,trueConfig}=_a;
                ajaxObj.open('HEAD', trueConfig.baseUrl+url, true, trueConfig.user, trueConfig.password);
                this[BEFORE_SEND](ajaxObj, trueConfig);
                ajaxObj.send();
                ajaxObj.onreadystatechange=this[__CHECK_RESPONSED].bind(this, resolve, reject, ajaxObj);
            });
        }
        options(url){
            return new Promise(async (resolve, reject)=>{
                let _a=await this[BEFORE_OPEN]();
                let {ajaxObj,trueConfig}=_a;
                ajaxObj.open('OPTIONS', trueConfig.baseUrl+url, true, trueConfig.user, trueConfig.password);
                this[BEFORE_SEND](ajaxObj, trueConfig);
                ajaxObj.send();
                ajaxObj.onreadystatechange=this[__CHECK_RESPONSED].bind(this, resolve, reject, ajaxObj);
            });
        }
        form(url, json){
            /*let aaa={
                fieldName:'', // 传给后台的文件数组字段名
                files:file,
                files:{key0:file0,key1:file1},
                files:{name:'', file:null},
                files:[{name:'', file:null}],
                files:[file0, file1],
                files:[InputElemnent0, InputElement1],
                files:InputElement,
                data:{
                }
            };*/
            if(!this.config)throw ' -> umax对象未初始化, 请先执行.init()方法初始化ajax对象!';
            return new Promise(async (resolve, reject)=>{
                let _a=await this[BEFORE_OPEN]();
                let {ajaxObj,trueConfig}=_a;
                ajaxObj.open('POST', trueConfig.baseUrl+url, true, trueConfig.user, trueConfig.password);
                let formObj=new FormData();
                if(json.files){
                    if(!json.fieldName)throw '.form(url, json)方法的第二个参数缺少fieldName字段!';
                    if(json.files instanceof File || json.files instanceof Blob){
                        formObj.append(json.fieldName, json.files);
                    }else if(this._isJson(json.files)){
                        if('name' in json.files && 'file' in json.files){
                            formObj.append(json.fieldName, json.files.file, json.files.name);
                        }else{
                            for(let key in json.files){
                                formObj.append(json.fieldName, json.files[key], key);
                            };
                        };
                    }else if(Array.isArray(json.files) && json.files.length>0){
                        if(this._isJson(json.files[0]) && 'name' in json.files[0] && 'file' in json.files[0]){
                            json.files.forEach(val=>{
                                formObj.append(json.fieldName, val.file, val.name);
                            });
                        }else if(json.files[0] instanceof File || json.files[0] instanceof Blob){
                            json.files.forEach(val=>{
                                formObj.append(json.fieldName, val);
                            });
                        }else if(json.files[0] instanceof HTMLInputElement && json.files[0].type==='file'){
                            json.files.forEach(val=>{
                                [...val.files].forEach(file=>{
                                    formObj.append(json.fieldName, file);
                                });
                            });
                        }
                    }else if(json.files instanceof HTMLInputElement && json.files.type==='file'){
                        [...json.files.files].forEach(val=>{
                            formObj.append(json.fieldName, val);
                        });
                    }
                }
                if(json.data){
                    for(let key in json.data){
                        formObj.set(key, json.data[key]);
                    };
                }
                this[BEFORE_SEND](ajaxObj, trueConfig);
                ajaxObj.send(formObj);
                ajaxObj.onreadystatechange=this[READY_RESPONSED].bind(this, resolve, reject, ajaxObj);
            });
        }
        [__REQEUST](url, method, json){
            if(!this.config)throw ' -> umax对象未初始化, 请先执行.init()方法初始化ajax对象!';
            return new Promise(async (resolve, reject)=>{
                let _a=await this[BEFORE_OPEN]();
                let {ajaxObj,trueConfig}=_a;
                ajaxObj.open(method, trueConfig.baseUrl+url, true, trueConfig.user, trueConfig.password);
                let dataObj=null;
                if(json)dataObj=this[TOBE_ENCODED](json);
                let _encoded=null;
                if(dataObj){
                    ajaxObj.setRequestHeader('Content-Type', dataObj.header);
                    _encoded=dataObj.encoded;
                }
                this[BEFORE_SEND](ajaxObj, trueConfig);
                ajaxObj.send(_encoded);
                ajaxObj.onreadystatechange=this[READY_RESPONSED].bind(this, resolve, reject, ajaxObj);
            });
        }
        [BEFORE_OPEN](){
            return new Promise(async (resolve, reject)=>{
                let temporary=null;
                if(this[TEMPORARY]){
                    temporary=Object.assign({}, this[TEMPORARY]);
                }
                this[TEMPORARY]=null;
                let trueConfig=null;
                if(this.beforeRequest)trueConfig=await this[__BEFORE](this.beforeRequest, this.config);
                if(!trueConfig)trueConfig=this.config;
                if(temporary){
                    if(temporary.baseUrl)trueConfig.baseUrl=temporary.baseUrl;
                    if(temporary.timeout)trueConfig.timeout=temporary.timeout;
                    if(temporary.ontimeout)trueConfig.ontimeout=temporary.ontimeout;
                    if(temporary.responseType)trueConfig.responseType=temporary.responseType;
                    if(temporary.headers)trueConfig.headers=temporary.headers;
                    if(temporary.onprogress)trueConfig.onprogress=temporary.onprogress;
                    if(temporary.user)trueConfig.user=temporary.user;
                    if(temporary.password)trueConfig.password=temporary.password;
                }
                let ajaxObj=null;
                if(window.XMLHttpRequest){
                    ajaxObj=new XMLHttpRequest();
                }else{
                    ajaxObj=new ActiveXObject('Microsoft.XMLHTTP');
                };
                resolve({ajaxObj, trueConfig});
            });
        }
        [BEFORE_SEND](ajaxObj, trueConfig){
            if(trueConfig.headers){
                for(let name in trueConfig.headers){
                    ajaxObj.setRequestHeader(name, trueConfig.headers[name]);
                };
            }
            if(trueConfig.responseType)ajaxObj.responseType=trueConfig.responseType;
            if(trueConfig.onprogress && typeof trueConfig.onprogress==='function'){
                ajaxObj.onprogress=function(eventObj){
                    trueConfig.onprogress(eventObj);
                };
            }
            if(trueConfig.timeout){
                ajaxObj.timeout=trueConfig.timeout;
                if(trueConfig.ontimeout && typeof trueConfig.ontimeout==='function'){
                    ajaxObj.ontimeout=function(ajaxObj){
                        trueConfig.ontimeout(ajaxObj);
                    };
                }
            }
        }
        [READY_RESPONSED](resolve, reject, ajaxObj){
            if(ajaxObj.readyState==4){
                let data=ajaxObj.response;
                if(this.responsed && typeof this.responsed==='function'){
                    if(typeof data==='string'){
                        try{
                            let r=JSON.parse(data);
                            this.responsed(r, ajaxObj);
                        }catch{
                            this.responsed(data, ajaxObj);
                        }
                    }else{
                        this.responsed(data, ajaxObj);
                    };
                }
                if(ajaxObj.status>=200 && ajaxObj.status<300 || ajaxObj.status==304){
                    if(typeof data==='string'){
                        try{
                            let _r=JSON.parse(data);
                            resolve(_r);
                        }catch{
                            resolve(data);
                        }
                    }else{
                        resolve(data);
                    };
                }else{
                    reject({statusText:ajaxObj.statusText, status:ajaxObj.status, responseURL:ajaxObj.responseURL});
                };
            }
        }
        [__CHECK_RESPONSED](resolve, reject, ajaxObj){
            if(ajaxObj.readyState==4){
                let headers=ajaxObj.getAllResponseHeaders().toLowerCase();
                if(this.responsed && typeof this.responsed==='function'){
                    this.responsed({headers, statusText:ajaxObj.statusText, status:ajaxObj.status, responseURL:ajaxObj.responseURL}, ajaxObj);
                }
                if(ajaxObj.status>=200 && ajaxObj.status<300 || ajaxObj.status==304){
                    resolve({headers, statusText:ajaxObj.statusText, status:ajaxObj.status, responseURL:ajaxObj.responseURL});
                }else{
                    reject({statusText:ajaxObj.statusText, status:ajaxObj.status, responseURL:ajaxObj.responseURL});
                };
            }
        }
        [TOBE_ENCODED](item){
            if(typeof item=='string'){
                if(this.fixed){
                    let arr=[];
                    for(let key in this.fixed){
                        arr.push(key+'='+this.fixed[key]);
                    };
                    let result=arr.join('&')+'&';
                    try{
                        JSON.parse(item);
                        return {
                            header:'application/json;charset=utf-8',
                            encoded:result+item
                        };
                    }catch{
                        return {
                            header:'application/x-www-form-urlencoded',
                            encoded:result+item
                        };
                    }
                }else{
                    try{
                        JSON.parse(item);
                        return {
                            header:'application/json;charset=utf-8',
                            encoded:item
                        };
                    }catch{
                        return {
                            header:'application/x-www-form-urlencoded',
                            encoded:item
                        };
                    }
                };
            }else if(this._isJson(item)){
                if(this.fixed){
                    item={...this.fixed, ...item};
                }
                let arr=[];
                for(let name in item){
                    arr.push(name+'='+item[name]);
                };
                return {
                    header:'application/x-www-form-urlencoded',
                    encoded:arr.join('&')
                };
            }else{
                throw 'umax对象的.get .post .put .patch .delete方法的第二个参数只能接收 字符串 或者 json!';
            };
        }
        [__BEFORE](fn, config){
            return new Promise((resolve, reject)=>{
                if(!fn){
                    resolve(null);
                }else{
                    resolve(fn(Object.assign({}, config)));
                };
            });
        }
        _isJson(obj){             //判断一个对象是否为json对象,返回布尔值
            let boolean_isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
            return boolean_isjson;
        }
        _isBase64(str){            //判断一个字符串是否为Base64字符串,返回布尔值
            let arr=str.split(',');
            if(arr.length!==2){
                return false;
            }else{
                if(!/^data\:/.test(arr[0]))return false;
                if(!/\;base64$/.test(arr[0]))return false;
                let len=arr[1].length;
                if(!len || len % 4 !== 0 || !/[a-zA-Z0-9\+\/\=]/.test(arr[1]))return false;
                let index = str.indexOf('=');
                return index === -1 || index === len - 1 || (index === len - 2 && str[len - 1] === '=');
            };
        }
        _toBase64(blobOrFile){     // 将File或者Blob转成Base64, 返回Promise
            return new Promise(resolve=>{
                let obj=new FileReader();
                obj.readAsDataURL(blobOrFile);
                obj.onload=function(o){
                    resolve(o.target.result);
                }
            });
        }
        _base64ToBlob(base64){    // 将Base64转成Blob, 返回Blob
            let arr = base64.split(','),
                type = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type});
        }
        _base64ToFile(base64, filename){    // 将Base64转成File, 返回File
            let arr = base64.split(','),
                type = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type});
        }
        _compress(json){      // 压缩图片
            let file=json.file;
            let maxWidth=json.maxWidth || null;
            let maxHeight=json.maxHeight || null;
            let quality=json.quality || null;
            let type=json.type || 'image/jpeg';

            if(Array.isArray(file)){    // 判断file是否是一个数组
                let um_imgArr=[];
                let um_promiseArr=[];
                file.forEach(val=>{
                    let um_json={};
                    um_json.file=val;
                    um_json.img=new Image();
                    um_json.reader=new FileReader();
                    um_json.canvas=document.createElement('canvas'); 
                    um_json.context=um_json.canvas.getContext('2d');
                    um_json.target_width=0;
                    um_json.target_height=0;
                    um_imgArr.push(um_json);
                });
                um_imgArr.forEach((val, i)=>{
                    let promiseObj=new Promise((resolve, reject)=>{
                        val.img.onload=function(){
                            // 图片原始尺寸
                            let originWidth = this.width;
                            let originHeight = this.height;
                            if((maxWidth && maxWidth>0) && (maxHeight && maxHeight>0)){
                                if(originWidth>maxWidth || originHeight>maxHeight){
                                    if(originWidth/originHeight>maxWidth/maxHeight){
                                        val.target_width=maxWidth;
                                        val.target_height=Math.ceil(maxWidth*(originHeight/originWidth));
                                    }else{
                                        val.target_width=Math.ceil(maxHeight*(originWidth/originHeight));
                                        val.target_height=maxHeight;
                                    };
                                }else{
                                    val.target_width=originWidth;
                                    val.target_height=originHeight;
                                };
                            }else if((maxWidth && maxWidth>0) && !maxHeight){
                                val.target_width=maxWidth;
                                val.target_height=Math.ceil(maxWidth*(originHeight/originWidth));
                            }else if(!maxWidth && (maxHeight && maxHeight>0)){
                                val.target_width=Math.ceil(maxHeight*(originWidth/originHeight));
                                val.target_height=maxHeight;
                            }else if(!maxWidth && !maxHeight){
                                val.target_width=originWidth;
                                val.target_height=originHeight;
                            };
                            // 指定画布大小
                            val.canvas.width=val.target_width;
                            val.canvas.height=val.target_height;
                            // 画布生成画面
                            val.context.drawImage(val.img, 0, 0, val.target_width, val.target_height);
                            if(quality){
                                val.canvas.toBlob(blob=>{
                                    resolve({_index:i, _file:blob});
                                }, 'image/jpeg', quality);
                            }else{
                                val.canvas.toBlob(blob=>{
                                    resolve({_index:i, _file:blob});
                                }, type);
                            };
                        };
                        val.reader.onload=function(){
                            val.img.src=this.result;
                        };
                        val.reader.readAsDataURL(val.file);
                    });
                    um_promiseArr.push(promiseObj);
                });
                
                return new Promise((resolve, reject)=>{
                    Promise.all(um_promiseArr).then(data=>{
                        data.sort((obj1, obj2)=>{
                            let n1=obj1._index;
                            let n2=obj2._index;
                            return n1-n2;
                        });
                        data.forEach((val, i, arr)=>{
                            arr[i]=val._file;
                        });
                        resolve(data);
                    }).catch(err=>{
                        reject(err);
                    });
                });
            }else{
                return new Promise((resolve, reject)=>{
                    let reader=new FileReader();
                    let img=new Image();
                    let canvas=document.createElement('canvas');
                    let context=canvas.getContext('2d');
                    let target_width=0;
                    let target_height=0;
                    img.onload=function(){
                        // 图片原始尺寸
                        let originWidth = this.width;
                        let originHeight = this.height;
                        if((maxWidth && maxWidth>0) && (maxHeight && maxHeight>0)){
                            if(originWidth>maxWidth || originHeight>maxHeight){
                                if(originWidth/originHeight>maxWidth/maxHeight){
                                    target_width=maxWidth;
                                    target_height=Math.ceil(maxWidth*(originHeight/originWidth));
                                }else{
                                    target_width=Math.ceil(maxHeight*(originWidth/originHeight));
                                    target_height=maxHeight;
                                };
                            }else{
                                target_width=originWidth;
                                target_height=originHeight;
                            };
                        }else if((maxWidth && maxWidth>0) && !maxHeight){
                            target_width=maxWidth;
                            target_height=Math.ceil(maxWidth*(originHeight/originWidth));
                        }else if(!maxWidth && (maxHeight && maxHeight>0)){
                            target_width=Math.ceil(maxHeight*(originWidth/originHeight));
                            target_height=maxHeight;
                        }else if(!maxWidth && !maxHeight){
                            target_width=originWidth;
                            target_height=originHeight;
                        };
                        // 指定画布大小
                        canvas.width=target_width;
                        canvas.height=target_height;
                        // 画布生成画面
                        context.drawImage(img, 0, 0, target_width, target_height);
                        if(quality){
                            canvas.toBlob(blob=>{
                                resolve(blob);
                            }, 'image/jpeg', quality);
                        }else{
                            canvas.toBlob(blob=>{
                                resolve(blob);
                            }, type);
                        };
                    };
                    reader.onload=function(){
                        img.src=this.result;
                    };
                    reader.readAsDataURL(file);
                });
            };
        };
    }
    return new ___UM_ajax();
})(Symbol('beforOpen'), Symbol('beforeSenc'), Symbol('readResponse'), Symbol('tobeEncoded'), Symbol('temporary'), Symbol('__before'), Symbol('__request'), Symbol('__checkResponsed'));
