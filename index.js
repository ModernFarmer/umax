if(!HTMLCanvasElement.prototype.toBlob){   // 如果canvas对象没有toBlob方法原型, 则加上(兼容低版本浏览器)
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function(callback, type, quality){
            let _this = this;
            setTimeout(function(){
                let binStr = atob(_this.toDataURL(type, quality).split(',')[1]);
                let len = binStr.length;
                let arr = new Uint8Array(len);
                for(let i = 0; i < len; i++){
                    arr[i] = binStr.charCodeAt(i);
                };
                callback(new Blob([arr], {type:type || 'image/jpeg'}));
            });
        }
    });
}
export const Umax = (function(_CONFIG, BEFORE_OPEN, BEFORE_SEND, READY_RESPONSED, TOBE_ENCODED, TEMPORARY, __BEFORE, __REQUEST_BODY, __REQUEST_ENCODED,  __REQUEST_SIMPLE,  __CHECK_RESPONSED){
    return class umax{
        constructor(){
            this[_CONFIG] = null;
            this[TEMPORARY] = null;
            this.fixed = null;
            this.beforeRequest = null;
            this.responsed = null;
            this.init = function(json){
                let result = {};
                if(!json){
                    result = {baseUrl:''};
                }else{
                    result.baseUrl = json.baseUrl || '';
                    result.timeout = json.timeout || null;
                    result.ontimeout = json.ontimeout || null;
                    result.onerror = json.onerror || null;
                    result.responseType = json.responseType || null;
                    result.headers = json.headers || null;
                    result.onprogress = json.onprogress || null;
                    result.user = json.user || null;
                    result.password = json.password || null;
                    result.withCredentials = json.withCredentials === true ? true : false;
                };
                if(typeof result.baseUrl === 'string'){
                    result.baseUrl = result.baseUrl.replace(/[\s\r\n]+/g, '').replace(/[\/\\]/g, '/').replace(/\/$/, '');
                    this[_CONFIG] = result;
                    delete this.init;
                }else{
                    throw ' -> umax初始化失败 -> baseUrl必须是一个字符串!';
                };
            };
        }
        set(json){
            let result = {};
            if(json.baseUrl)result.baseUrl = json.baseUrl;
            if(json.timeout)result.timeout = json.timeout;
            if(json.ontimeout)result.ontimeout = json.ontimeout;
            if(json.onerror)result.onerror = json.onerror;
            if(json.responseType)result.responseType = json.responseType;
            if(json.headers)result.headers = json.headers;
            if(json.onprogress)result.onprogress = json.onprogress;
            if(json.user)result.user = json.user;
            if(json.password)result.password = json.password;
            if(json.withCredentials)result.withCredentials === true ? true : false;
            if(result.baseUrl && typeof result.baseUrl === 'string'){
                result.baseUrl = result.baseUrl.replace(/[\s\r\n]+/g, '').replace(/[\/\\]/g, '/').replace(/\/$/, '');
            }else{
                result.baseUrl = '';
            };

            if(Object.keys(result).length)this[TEMPORARY] = result;
            return this;
        }
        get(url, json){
            return this[__REQUEST_ENCODED](url, 'GET', json);
        }
        delete(url, json){
            return this[__REQUEST_ENCODED](url, 'DELETE', json);
        }
        post(url, json){
            return this[__REQUEST_BODY](url, 'POST', json);
        }
        put(url, json){
            return this[__REQUEST_BODY](url, 'PUT', json);
        }
        patch(url, json){
            return this[__REQUEST_BODY](url, 'PATCH', json);
        }
        head(url){
            return this[__REQUEST_SIMPLE](url, 'HEAD');
        }
        options(url){
            return this[__REQUEST_SIMPLE](url, 'OPTIONS');
        }
        form(url, json){
            if(!this[_CONFIG])throw ' -> umax对象未初始化, 请先执行.init()方法初始化umax对象!';
            return new Promise(async resolve => {
                let {ajaxObj,trueConfig} = await this[BEFORE_OPEN]();
                url = url.replace(/[\/\\]/g, '/').replace(/^\//, '');
                let trueUrl = '';
                trueUrl = (url.indexOf('https://') > -1 || url.indexOf('http://') > -1) ? url : trueConfig.baseUrl + '/' + url;
                ajaxObj.open('POST', trueUrl, true, trueConfig.user, trueConfig.password);
                let formObj = new FormData();
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
                            json.files.forEach(val => {
                                formObj.append(json.fieldName, val.file, val.name);
                            });
                        }else if(json.files[0] instanceof File || json.files[0] instanceof Blob){
                            json.files.forEach(val => {
                                formObj.append(json.fieldName, val);
                            });
                        }else if(json.files[0] instanceof HTMLInputElement && json.files[0].type === 'file'){
                            json.files.forEach(val => {
                                [...val.files].forEach(file => {
                                    formObj.append(json.fieldName, file);
                                });
                            });
                        }
                    }else if(json.files instanceof HTMLInputElement && json.files.type === 'file'){
                        [...json.files.files].forEach(val => {
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
                ajaxObj.onreadystatechange = this[READY_RESPONSED].bind(this, resolve, ajaxObj);
                ajaxObj = null;
            });
        }
        [__REQUEST_BODY](url, method, json){
            if(!this[_CONFIG])throw ' -> umax对象未初始化, 请先执行.init()方法初始化umax对象!';
            return new Promise(async resolve => {
                let {ajaxObj,trueConfig} = await this[BEFORE_OPEN]();
                let dataObj = null;
                if(json){
                    dataObj = this[TOBE_ENCODED](json);
                }else{
                    dataObj = this[TOBE_ENCODED]({});
                };
                url = url.replace(/[\/\\]/g, '/').replace(/^\//, '');
                let trueUrl = '';
                if(dataObj && dataObj.concatUrl){
                    let concatUrl = url.indexOf('?') > -1 ? '&' + dataObj.concatUrl : '?' + dataObj.concatUrl;
                    url += concatUrl;
                }
                trueUrl = (url.indexOf('https://') > -1 || url.indexOf('http://') > -1) ? url : trueConfig.baseUrl + '/' + url;
                ajaxObj.open(method, trueUrl, true, trueConfig.user, trueConfig.password);
                let _encoded = null;
                if(dataObj){
                    ajaxObj.setRequestHeader('Content-Type', dataObj.header);
                    _encoded = dataObj.encoded;
                }
                this[BEFORE_SEND](ajaxObj, trueConfig);
                ajaxObj.send(_encoded);
                ajaxObj.onreadystatechange = this[READY_RESPONSED].bind(this, resolve, ajaxObj);
                ajaxObj = null;
            });
        }
        [__REQUEST_ENCODED](url, method, json){
            if(!this[_CONFIG])throw ' -> umax对象未初始化, 请先执行.init()方法初始化umax对象!';
            return new Promise(async resolve => {
                let {ajaxObj,trueConfig} = await this[BEFORE_OPEN]();
                let dataObj = null;
                if(json){
                    dataObj = this[TOBE_ENCODED](json);
                }else{
                    dataObj = this[TOBE_ENCODED]({});
                };
                url = url.replace(/[\/\\]/g, '/').replace(/^\//, '');
                let trueUrl = '';
                if(dataObj){
                    let encoded = url.indexOf('?') > -1 ? '&' + dataObj.encoded : '?' + dataObj.encoded;
                    trueUrl = (url.indexOf('https://') > -1 || url.indexOf('http://') > -1) ? url + encoded : trueConfig.baseUrl + '/' + url + encoded;
                }else{
                    trueUrl = (url.indexOf('https://') > -1 || url.indexOf('http://') > -1) ? url : trueConfig.baseUrl + '/' + url;
                };
                ajaxObj.open(method, trueUrl, true, trueConfig.user, trueConfig.password);
                this[BEFORE_SEND](ajaxObj, trueConfig);
                ajaxObj.send();
                ajaxObj.onreadystatechange = this[READY_RESPONSED].bind(this, resolve, ajaxObj);
                ajaxObj = null;
            });
        }
        [__REQUEST_SIMPLE](url, method){
            if(!this[_CONFIG])throw ' -> umax对象未初始化, 请先执行.init()方法初始化umax对象!';
            return new Promise(async resolve => {
                let {ajaxObj,trueConfig} = await this[BEFORE_OPEN]();
                url = url.replace(/[\/\\]/g, '/').replace(/^\//, '');
                let trueUrl = '';
                trueUrl = (url.indexOf('https://') > -1 || url.indexOf('http://') > -1) ? url : trueConfig.baseUrl + '/' + url;
                ajaxObj.open(method, trueUrl, true, trueConfig.user, trueConfig.password);
                this[BEFORE_SEND](ajaxObj, trueConfig);
                ajaxObj.send();
                ajaxObj.onreadystatechange = this[__CHECK_RESPONSED].bind(this, resolve, ajaxObj);
                ajaxObj = null;
            });
        }
        [BEFORE_OPEN](){
            return new Promise(async resolve => {
                let temporary = null;
                if(this[TEMPORARY]){
                    temporary = Object.assign({}, this[TEMPORARY]);
                }
                this[TEMPORARY] = null;
                let trueConfig = Object.assign({}, this[_CONFIG]);
                if(this.beforeRequest){
                    let _c = await this[__BEFORE](this.beforeRequest, this[_CONFIG]);
                    if(_c.baseUrl)trueConfig.baseUrl = _c.baseUrl;
                    if(_c.timeout)trueConfig.timeout = _c.timeout;
                    if(_c.ontimeout)trueConfig.ontimeout = _c.ontimeout;
                    if(_c.onerror)trueConfig.onerror = _c.onerror;
                    if(_c.responseType)trueConfig.responseType = _c.responseType;
                    if(_c.headers)trueConfig.headers = _c.headers;
                    if(_c.onprogress)trueConfig.onprogress = _c.onprogress;
                    if(_c.user)trueConfig.user = _c.user;
                    if(_c.password)trueConfig.password = _c.password;
                    if(_c.withCredentials === true)trueConfig.withCredentials = true;
                    if(trueConfig.baseUrl && typeof trueConfig.baseUrl === 'string'){
                        trueConfig.baseUrl = trueConfig.baseUrl.replace(/[\s\r\n]+/g, '').replace(/[\/\\]/g, '/').replace(/\/$/, '');
                    }else{
                        trueConfig.baseUrl = '';
                    };
                }
                if(temporary){
                    if(temporary.baseUrl)trueConfig.baseUrl = temporary.baseUrl;
                    if(temporary.timeout)trueConfig.timeout = temporary.timeout;
                    if(temporary.ontimeout)trueConfig.ontimeout = temporary.ontimeout;
                    if(temporary.onerror)trueConfig.onerror = temporary.onerror;
                    if(temporary.responseType)trueConfig.responseType = temporary.responseType;
                    if(temporary.headers)trueConfig.headers = temporary.headers;
                    if(temporary.onprogress)trueConfig.onprogress = temporary.onprogress;
                    if(temporary.user)trueConfig.user = temporary.user;
                    if(temporary.password)trueConfig.password = temporary.password;
                    if(temporary.withCredentials === true)trueConfig.withCredentials = true;
                    if(trueConfig.baseUrl && typeof trueConfig.baseUrl === 'string'){
                        trueConfig.baseUrl = trueConfig.baseUrl.replace(/[\s\r\n]+/g, '').replace(/[\/\\]/g, '/').replace(/\/$/, '');
                    }else{
                        trueConfig.baseUrl = '';
                    };
                }
                if (trueConfig.headers && !trueConfig.headers['Accept']) {
                    trueConfig.headers['Accept'] = 'application/json, text/plain, */*';
                } else if (!trueConfig.headers) {
                    trueConfig.headers = {'Accept': 'application/json, text/plain, */*'};
                }
                let ajaxObj = null;
                if(window.XMLHttpRequest){
                    ajaxObj = new XMLHttpRequest();
                }else{
                    ajaxObj = new ActiveXObject('Microsoft.XMLHTTP');
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
            if(trueConfig.responseType)ajaxObj.responseType = trueConfig.responseType;
            if(trueConfig.onprogress && typeof trueConfig.onprogress === 'function'){
                ajaxObj.onprogress = function(eventObj){
                    trueConfig.onprogress(eventObj);
                };
            }
            if(trueConfig.timeout){
                ajaxObj.timeout = trueConfig.timeout;
                if(trueConfig.ontimeout && typeof trueConfig.ontimeout === 'function'){
                    ajaxObj.ontimeout = function(ajaxObj){
                        trueConfig.ontimeout(ajaxObj);
                    };
                }
                if(trueConfig.onerror && typeof trueConfig.onerror === 'function'){
                    ajaxObj.onerror = function(ajaxObj){
                        trueConfig.onerror(ajaxObj);
                    };
                }
            }
            if(trueConfig.withCredentials === true)ajaxObj.withCredentials = true;
        }
        [READY_RESPONSED](resolve, ajaxObj){
            if(ajaxObj.readyState === 4){
                let data = ajaxObj.response;
                if(this.responsed && typeof this.responsed === 'function'){
                    if(ajaxObj.responseType){
                        if(this._isJson(data)){
                            // 这里深拷贝, umax.responsed() 方法不改变最终返回的数据
                            this.responsed(JSON.parse(JSON.stringify(data)), ajaxObj);
                        }else{
                            this.responsed(data, ajaxObj);
                        };
                        resolve(data);
                    }else{
                        try{
                            let r = JSON.parse(data);
                            this.responsed(r, ajaxObj);
                            resolve(JSON.parse(data));
                        }catch(err){
                            this.responsed(data, ajaxObj);
                            resolve(data);
                        }
                    };
                }else{
                    if(ajaxObj.responseType){
                        resolve(data);
                    }else{
                        try{
                            let r = JSON.parse(data);
                            resolve(r);
                        }catch(err){
                            resolve(data);
                        }
                    };
                }
            }
            ajaxObj = null;
        }
        [__CHECK_RESPONSED](resolve, ajaxObj){
            if(ajaxObj.readyState === 4){
                let headers = ajaxObj.getAllResponseHeaders().toLowerCase();
                if(this.responsed && typeof this.responsed === 'function'){
                    this.responsed({headers, statusText:ajaxObj.statusText, status:ajaxObj.status, responseURL:ajaxObj.responseURL}, ajaxObj);
                }
                resolve({headers, statusText:ajaxObj.statusText, status:ajaxObj.status, responseURL:ajaxObj.responseURL});
            }
            ajaxObj = null;
        }
        [TOBE_ENCODED](item){
            if(typeof item === 'string'){
                if(this.fixed){
                    try{
                        JSON.parse(item);
                        let arr = [];
                        for(let key in this.fixed){
                            arr.push(key + '=' + this.fixed[key]);
                        };
                        let result = arr.join('&');
                        return {
                            header:'application/json;charset=utf-8',
                            encoded:item,
                            concatUrl:result.replace(/\+/g, '%2B')
                        };
                    }catch(err){
                        let arr = [];
                        for(let key in this.fixed){
                            arr.push(key + '=' + this.fixed[key]);
                        };
                        let result = arr.join('&') + '&';
                        item = item.indexOf('?') > -1 ? item.replace(/^\?/, '') : item;
                        return {
                            header:'application/x-www-form-urlencoded',
                            encoded:(result + item).replace(/\+/g, '%2B')
                        };
                    }
                }else{
                    try{
                        JSON.parse(item);
                        return {
                            header:'application/json;charset=utf-8',
                            encoded:item
                        };
                    }catch(err){
                        return {
                            header:'application/x-www-form-urlencoded',
                            encoded:item.replace(/\+/g, '%2B')
                        };
                    }
                };
            }else if(this._isJson(item)){
                if(this.fixed){
                    item = {...this.fixed, ...item};
                }
                let arr = [];
                for(let name in item){
                    arr.push(name + '=' + item[name]);
                };
                if(arr.length === 0)return null;
                return {
                    header:'application/x-www-form-urlencoded',
                    encoded:arr.join('&').replace(/\+/g, '%2B')
                };
            }else{
                throw 'umax对象的.get .post .put .patch .delete方法的第二个参数只能接收 字符串 或者 json!';
            };
        }
        [__BEFORE](fn, config){
            return new Promise(resolve => {
                if(!fn){
                    resolve(null);
                }else{
                    resolve(fn(Object.assign({}, config)));
                };
            });
        }
        _isJson(obj){
            let boolean_isjson = typeof(obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
            return boolean_isjson;
        }
        _isBase64(str){  //判断一个字符串是否为Base64字符串,返回布尔值
            let arr = str.split(',');
            if(arr.length !== 2){
                return false;
            }else{
                if(!/^data\:/.test(arr[0]))return false;
                if(!/\;base64$/.test(arr[0]))return false;
                let len = arr[1].length;
                if(!len || len % 4 !== 0 || !/[a-zA-Z0-9\+\/\=]/.test(arr[1]))return false;
                let index = str.indexOf('=');
                return index === -1 || index === len - 1 || (index === len - 2 && str[len - 1] === '=');
            };
        }
        _toBase64(blobOrFile){  // 将File或者Blob转成Base64, 返回Promise
            return new Promise(resolve => {
                let obj = new FileReader();
                obj.readAsDataURL(blobOrFile);
                obj.onload = function(o){
                    resolve(o.target.result);
                }
            });
        }
        _base64ToBlob(base64){  // 将Base64转成Blob, 返回Blob
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
        _base64ToFile(base64, filename){  // 将Base64转成File, 返回File
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
        _compress(json){  // 压缩图片, 返回 Blob|[Blob, Blob, ...]
            let file = json.file;
            let maxWidth = json.maxWidth || null;
            let maxHeight = json.maxHeight || null;
            let quality = json.quality || null;
            let type = json.type || 'image/jpeg';
            if(Array.isArray(file)){  // 判断file是否是一个数组
                let um_imgArr = [];
                let um_promiseArr = [];
                file.forEach(val => {
                    let um_json = {};
                    um_json.file = val;
                    um_json.img = new Image();
                    um_json.reader = new FileReader();
                    um_json.canvas = document.createElement('canvas'); 
                    um_json.context = um_json.canvas.getContext('2d');
                    um_json.target_width = 0;
                    um_json.target_height = 0;
                    um_imgArr.push(um_json);
                });
                um_imgArr.forEach(val => {
                    let promiseObj = new Promise(resolve => {
                        val.img.onload = function(){
                            let originWidth = this.width;
                            let originHeight = this.height;
                            if((maxWidth && maxWidth > 0) && (maxHeight && maxHeight > 0)){
                                if(originWidth > maxWidth || originHeight > maxHeight){
                                    if(originWidth / originHeight > maxWidth / maxHeight){
                                        val.target_width = maxWidth;
                                        val.target_height = Math.ceil(maxWidth * (originHeight / originWidth));
                                    }else{
                                        val.target_width = Math.ceil(maxHeight * (originWidth / originHeight));
                                        val.target_height = maxHeight;
                                    };
                                }else{
                                    val.target_width = originWidth;
                                    val.target_height = originHeight;
                                };
                            }else if((maxWidth && maxWidth>0) && !maxHeight){
                                val.target_width = maxWidth;
                                val.target_height = Math.ceil(maxWidth * (originHeight / originWidth));
                            }else if(!maxWidth && (maxHeight && maxHeight > 0)){
                                val.target_width = Math.ceil(maxHeight * (originWidth / originHeight));
                                val.target_height = maxHeight;
                            }else if(!maxWidth && !maxHeight){
                                val.target_width = originWidth;
                                val.target_height = originHeight;
                            };
                            val.canvas.width = val.target_width;
                            val.canvas.height = val.target_height;
                            val.context.drawImage(val.img, 0, 0, val.target_width, val.target_height);
                            if(quality && typeof quality === 'number' && quality > 0 && quality <= 1){
                                val.canvas.toBlob(blob => {
                                    resolve(blob);
                                }, 'image/jpeg', quality);
                            }else{
                                val.canvas.toBlob(blob => {
                                    resolve(blob);
                                }, type);
                            };
                        };
                        val.reader.onload = function(){
                            val.img.src = this.result;
                        };
                        val.reader.readAsDataURL(val.file);
                    });
                    um_promiseArr.push(promiseObj);
                });
                return new Promise(resolve => {
                    Promise.all(um_promiseArr).then(data => {
                        resolve(data);
                    });
                });
            }else{
                return new Promise(resolve => {
                    let reader = new FileReader();
                    let img = new Image();
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    let target_width = 0;
                    let target_height = 0;
                    img.onload = function(){
                        let originWidth = this.width;
                        let originHeight = this.height;
                        if((maxWidth && maxWidth > 0) && (maxHeight && maxHeight > 0)){
                            if(originWidth > maxWidth || originHeight > maxHeight){
                                if(originWidth / originHeight > maxWidth / maxHeight){
                                    target_width = maxWidth;
                                    target_height = Math.ceil(maxWidth * (originHeight / originWidth));
                                }else{
                                    target_width = Math.ceil(maxHeight * (originWidth / originHeight));
                                    target_height = maxHeight;
                                };
                            }else{
                                target_width = originWidth;
                                target_height = originHeight;
                            };
                        }else if((maxWidth && maxWidth > 0) && !maxHeight){
                            target_width = maxWidth;
                            target_height = Math.ceil(maxWidth * (originHeight / originWidth));
                        }else if(!maxWidth && (maxHeight && maxHeight > 0)){
                            target_width = Math.ceil(maxHeight * (originWidth / originHeight));
                            target_height = maxHeight;
                        }else if(!maxWidth && !maxHeight){
                            target_width = originWidth;
                            target_height = originHeight;
                        };
                        canvas.width = target_width;
                        canvas.height = target_height;
                        context.drawImage(img, 0, 0, target_width, target_height);
                        if(quality && typeof quality === 'number' && quality > 0 && quality <= 1){
                            canvas.toBlob(blob => {
                                resolve(blob);
                            }, 'image/jpeg', quality);
                        }else{
                            canvas.toBlob(blob => {
                                resolve(blob);
                            }, type);
                        };
                    };
                    reader.onload = function(){
                        img.src = this.result;
                    };
                    reader.readAsDataURL(file);
                });
            };
        };
    }
})(Symbol('_config'), Symbol('beforOpen'), Symbol('beforeSenc'), Symbol('readResponse'), Symbol('tobeEncoded'), Symbol('temporary'), Symbol('__before'), Symbol('__request_body'), Symbol('__request_encoded'), Symbol('__request_simple'), Symbol('__checkResponsed'));

export default new Umax();
