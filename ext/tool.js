// ==================================== es6工具类 ========================================
class Tools {
    static loadScript(url, callback) {
        let old_script = document.getElementById(url);
        if (old_script) {
            if (old_script.ready == true) {
                callback && callback();
                return;
            } else {
                document.body.removeChild(old_script);
            }
        }
        let script = document.createElement('script');
        script.id = url;
        script.src = url;
        script.onload = script.onreadystatechange = function () {
            if (script.ready) {
                return false;
            }
            if (!script.readyState || script.readyState == "loaded" || script.readyState == 'complete') {
                script.ready = true;
                callback && callback();
            }
        };
        document.body.appendChild(script);
    }

    //同步加载多个脚本
    static syncLoadScripts(scripts, callback) {
        var ok = 0;
        var loadScript = function (url) {
            Tools.loadScript(url, function () {
                ok++;
                if (ok == scripts.length) {
                    callback && callback();
                } else {
                    loadScript(scripts[ok])
                }
            })
        }
        loadScript(scripts[0]);
    }

    //异步加载多个脚本
    static asyncLoadScripts(scripts, callback) {
        var ok = 0;
        for (var i = 0; i < scripts.length; i++) {
            Tools.loadScript(scripts[i], function () {
                console.log(scripts[ok])
                ok++;
                if (ok == scripts.length) {
                    callback && callback();
                }
            })
        }
    }
}




// ==================================== 磁链转换部分========================================
class CLZHContent extends React.Component {
    constructor(props) {
        super(props)
    }
    componentWillMount(){
        Tools.asyncLoadScripts([ "./ext/encrypt.util.js"]);
    }
    componentDidMount() {
        // var url='ed2k://|file|%E8%B6%8A%E7%8B%B1.Prison.Break.S05E08.%E4%B8%AD%E8%8B%B1%E5%AD%97%E5%B9%95.HDTVrip.720P-%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86V2.mp4|619162687|1551a1c5c2807796aaffee499a46f3bf|h=vk7qarwo76nmosnvbzlsfjx2k2myy32n|/';
        // var url = 'thunder://QUFodHRwOi8veHVubGVpYS56dWlkYTM2MC5jb20vMTgwMy+77svAyMu56cC0MS5CRDEyODC438fl1tDTosur19aw5i5tcDRaWg==';
        // document.getElementById("inputurl").value = url;
        window.ConvertURL2FG = function (url, fUrl, uid) {
            try {
                FlashgetDown(url, uid);
            } catch (e) {
                location.href = fUrl;
            }
        }

        Tools.syncLoadScripts(["https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.js"], function () {
            new Clipboard('.cp').on('success', function (e) {
                var thedom = e.trigger;
                var i = document.createElement("i");
                i.innerHTML = '✔';
                i.setAttribute("class", "flag");
                i.style = "font-weight:bolder;color:#e314e4;font-size:17pt;";
                thedom.parentNode.appendChild(i);
                setTimeout(function () {
                    // thedom.parentNode.removeChild(i);
                }, 3000);
                e.clearSelection();
            });
        });

    }
    cleanCopyFlag() {
        var flags = document.getElementsByClassName("flag");
        for (var i = 0; i < flags.length; i++) {
            var it = flags[i];
            it.parentNode.removeChild(it);
            i--;
        }
    }
    clear() {
        document.querySelectorAll('.content input').forEach(function (it) {
            it.value = '';
        });
        this.cleanCopyFlag();
    }
   
    convert(isAnsi) {

        function ThunderEncode(t_url) {
            var thunderPrefix = "AA";
            var thunderPosix = "ZZ";
            var thunderTitle = "thunder://";
            var tem_t_url = t_url;
            var thunderUrl = thunderTitle + EncryptUtil.base64.encode64(EncryptUtil.utf16to8(thunderPrefix + tem_t_url + thunderPosix));
            return thunderUrl;
        }
        function Thunderdecode(url) {
            url = url.replace('thunder://', '');
            let thunderUrl = EncryptUtil.utf8to16(EncryptUtil.base64.decode64(url));
            thunderUrl = thunderUrl.substr(2, thunderUrl.length - 4);
            return thunderUrl;
        }
        function ThunderEncode1(t_url) {
            var thunderPrefix = "AA";
            var thunderPosix = "ZZ";
            var thunderTitle = "thunder://";
            var tem_t_url = t_url;
            var thunderUrl = thunderTitle + EncryptUtil.base64.encode64(EncryptUtil.Ansi.strUnicode2Ansi(thunderPrefix + tem_t_url + thunderPosix));
            return thunderUrl;
        }
        function Thunderdecode1(url) {
            url = url.replace('thunder://', '');
            let thunderUrl = EncryptUtil.Ansi.strAnsi2Unicode(EncryptUtil.base64.decode64(url));
            thunderUrl = thunderUrl.substr(2, thunderUrl.length - 4);
            return thunderUrl;
        }



        function flashgetencode(url) {
            url = 'Flashget://' + EncryptUtil.base64.encode64(EncryptUtil.utf16to8('[FLASHGET]' + url + '[FLASHGET]')) + '&1926';
            return url;
        }
        function Flashgetdecode(url) {
            url = url.replace('Flashget://', '');
            if (url.indexOf('&') != -1) {
                url = url.substr(0, url.indexOf('&'));
            }
            url = EncryptUtil.utf8to16(EncryptUtil.base64.decode64(url));
            flashgeturl = url.replace('[FLASHGET]', '').replace('[FLASHGET]', '');
            return flashgeturl;
        }


        function qqencode(url) {
            return 'qqdl://' + EncryptUtil.base64.encode64(EncryptUtil.utf16to8(url));
        }
        function qqdecode(url) {
            return EncryptUtil.utf8to16(EncryptUtil.base64.decode64(url.replace('qqdl://', '')));
        }





        this.cleanCopyFlag();
        let oldurl = document.getElementById("inputurl").value.trim();
        if (oldurl == '') {
            return;
        }
        let newurl;
        if (oldurl.indexOf("thunder://") != -1) {
            if (isAnsi) {
                newurl = Thunderdecode1(oldurl);
            } else {
                newurl = Thunderdecode(oldurl);
            }
        } else if (oldurl.indexOf("Flashget://") != -1) {
            newurl = Flashgetdecode(oldurl);
        } else if (oldurl.indexOf("qqdl://") != -1) {
            newurl = qqdecode(oldurl);
        } else {
            newurl = oldurl;
        }

        let thunderurl;
        if (isAnsi) {
            thunderurl = ThunderEncode1(newurl);
        } else {
            thunderurl = ThunderEncode(newurl);
        }
        let flashgeturl = flashgetencode(newurl);
        let qqurl = qqencode(newurl);

        this.reWrite(oldurl, newurl, thunderurl, flashgeturl, qqurl);
    }
    reWrite(oldurl, newurl, thunderurl, flashgeturl, qqurl) {
        function createThunderDownLoadADOm(label, url, title, id, name, cls, style) {
            return [
                "<a",
                "	oncontextmenu=ThunderNetwork_SetHref(this) ",
                id ? "id='" + id + "'" : "",
                name ? "name='" + name + "'" : "",
                "	style='" + (style || "") + "'",
                "	class='" + (cls || "") + "'",
                ' 	onclick="return OnDownloadClick_Simple(this)" ',
                '	href="' + url + '"',
                ' 	thunderResTitle="' + (title || "迅雷下载") + '"',
                ' 	thunderType="04"',
                ' 	thunderPid="00008"',
                ' 	thunderHref="' + url + '"',
                '>' + (label || "迅雷下载") + '</a>'
            ].join("");
        }
        function createFlashgetOrOtherDownLoadADOm(label, url, flashgeturl, id, name, cls, style) {
            var str = "<a href='javascript://' onclick='ConvertURL2FG(\"" + flashgeturl + "\",\"" + url + "\",1926)'>" + label + "</a>";
            return str;
        }
        document.getElementById("inputurl").value = oldurl;
        document.getElementById("realurl").value = newurl;
        document.getElementById("thunderurl").value = thunderurl;
        document.getElementById("flashgeturl").value = flashgeturl;
        document.getElementById("qqurl").value = qqurl;
        document.getElementById("thunderdownload").innerHTML = createThunderDownLoadADOm("迅雷下载", thunderurl, "迅雷下载", null, null, "btn btn-link", null);
        document.getElementById("otherdownload").innerHTML = createFlashgetOrOtherDownLoadADOm("其他下载", newurl, flashgeturl, null, null, "", null);
    }


    render() {
        return (
            <div className="content" >
                原始地址：
                <input className="url" type="text" id="inputurl" />
                <button className="btn btn-success btn-sm" onClick={this.convert.bind(this, false)}>Utf16转换</button>
                <button className="btn btn-success btn-sm" onClick={this.convert.bind(this, true)}>Unicode转换</button>
                <span>
                    <button className="cp btn btn-primary btn-sm" data-clipboard-target="#inputurl" aria-label="复制成功！">复制</button>
                </span>
                <button className="btn btn-default btn-sm" onClick={this.clear.bind(this)}>清空</button>
                <hr />
                真实地址：
                <input className="url input-sm" type="text" id="realurl" />
                <span>
                    <button className="cp btn btn-primary btn-sm" data-clipboard-target="#realurl" aria-label="复制成功！">复制</button>
                </span>
                <br />
                迅雷地址：
                <input className="url" type="text" id="thunderurl" />
                <span>
                    <button className="cp btn btn-primary btn-sm" data-clipboard-target="#thunderurl" aria-label="复制成功！">复制</button>
                </span>
                <br />
                快车地址：
                <input className="url" type="text" id="flashgeturl" />
                <span>
                    <button className="cp btn btn-primary btn-sm" data-clipboard-target="#flashgeturl" aria-label="复制成功！">复制</button>
                </span>
                <br />
                旋风地址：
                <input className="url" type="text" id="qqurl" />
                <span>
                    <button className="cp btn btn-primary btn-sm" data-clipboard-target="#qqurl" aria-label="复制成功！">复制</button>
                </span>
                <br />
                <hr />
                <span id="thunderdownload"></span>
                <span id="otherdownload"></span>
            </div>
        )
    }
}


// ==================================== 金融转换部分========================================
class JRZHContent extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        Tools.syncLoadScripts(["https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.js"], function () {
            new Clipboard('.cp').on('success', function (e) {
                var thedom = e.trigger;
                var i = document.createElement("i");
                i.innerHTML = '✔';
                i.setAttribute("class", "flag");
                i.style = "font-weight:bolder;color:#e314e4;font-size:17pt;";
                thedom.parentNode.appendChild(i);
                setTimeout(function () {
                    // thedom.parentNode.removeChild(i);
                }, 3000);
                e.clearSelection();
            });
        });

    }
    convert() {
        let v = document.getElementById("raw").value;
        if (v && v.trim().length > 0) {
            document.getElementById("price").value = this.changeMoneyToChinese(v);
        }
    }
    changeMoneyToChinese(money) {
        var cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]; //汉字的数字
        var cnIntRadice = ["", "拾", "佰", "仟"]; //基本单位
        var cnIntUnits = ["", "万", "亿", "兆"]; //对应整数部分扩展单位
        var cnDecUnits = ["角", "分", "毫", "厘"]; //对应小数部分单位
        var cnIntLast = "元"; //整型完以后的单位
        var maxNum = 999999999999999.9999; //最大处理的数字

        var IntegerNum; //金额整数部分
        var DecimalNum; //金额小数部分
        var ChineseStr = ""; //输出的中文金额字符串
        var parts; //分离金额后用的数组，预定义
        if (money === "") {
            return "";
        }
        money = parseFloat(money);
        if (money >= maxNum) {
            alert('超出最大处理数字');
            return "";
        }
        if (money === 0) {
            ChineseStr = cnNums[0] + cnIntLast
            return ChineseStr;
        }
        money = money.toString(); //转换为字符串
        if (money.indexOf(".") === -1) {
            IntegerNum = money;
            DecimalNum = '';
        } else {
            parts = money.split(".");
            IntegerNum = parts[0];
            DecimalNum = parts[1].substr(0, 4);
        }
        if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
            let zeroCount = 0;
            let IntLen = IntegerNum.length;
            for (let i = 0; i < IntLen; i++) {
                let n = IntegerNum.substr(i, 1);
                let p = IntLen - i - 1;
                let q = p / 4;
                let m = p % 4;
                if (n === "0") {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        ChineseStr += cnNums[0];
                    }
                    zeroCount = 0; //归零
                    ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m === 0 && zeroCount < 4) {
                    ChineseStr += cnIntUnits[q];
                }
            }
            ChineseStr += cnIntLast;
        }
        if (DecimalNum !== '') { //小数部分
            decLen = DecimalNum.length;
            for (i = 0; i < decLen; i++) {
                n = DecimalNum.substr(i, 1);
                if (n !== '0') {
                    ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (ChineseStr === '') {
            ChineseStr += cnNums[0] + cnIntLast;
        }
        return ChineseStr;
    }
    render() {
        return (
            <div className="content">

                <strong>金额</strong><small> （数字）</small>：<input className="price" type="text" id="raw" />
                <button className="btn btn-success" onClick={this.convert.bind(this)}>转换</button>
                <hr />
                <strong>金额</strong><small> （标准）</small>：<input className="price" type="text" id="price" readOnly />
                <span>
                    <button className="cp btn btn-primary" data-clipboard-target="#price" aria-label="复制成功！">复制</button>
                </span>
            </div>
        )
    }
}


// ==================================== 视频转gif部分 ========================================
class SPZGIFContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            delay: 200,
            timeoutKeeper: null,
            width: 100,
        }
    }

    componentDidMount() {
        Tools.syncLoadScripts(["ext/gif.js/gif.js"])
        let that = this;
        this.refs.video.addEventListener("ended", function () {
            that.finishDrawVideo();
        });
    }
    initAll() {
        this.refs.widthRange.removeAttribute("disabled");
        this.setState({ width: 100 });
    }

    changeFile(e) {
        console.log(e.target)
        this.refs.video.src = URL.createObjectURL(e.target.files[0]);
    }

    drawVideo() {
        this.refs.widthRange.setAttribute("disabled", true);
        let video = this.refs.video;
        let ratio = video.offsetWidth / video.offsetHeight;
        let canvas = document.createElement("canvas");
        canvas.width = this.state.width;
        canvas.height = Math.floor(this.state.width / ratio);
        this.refs.captures.appendChild(canvas);
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, this.state.width, this.state.width / ratio)
        video.play();
        this.setState({ timeoutKeeper: setTimeout(this.drawVideo.bind(this), this.state.delay) })
    }

    finishDrawVideo() {
        clearTimeout(this.state.timeoutKeeper);
        this.setState({ timeoutKeeper: null })
        this.refs.video.pause();
    }

    createGif() {
        this.refs.video.pause();
        let gif = new GIF({
            workers: 2,
            quality: 10
        });
        document.querySelectorAll(".captures canvas").forEach(function (it, idx, all) {
            gif.addFrame(it, { delay: 200 });
        });
        let that = this;
        gif.on('finished', function (blob) {
            that.refs.gif.src = URL.createObjectURL(blob);
        });
        gif.render();
    }

    downloadGif() {
        window.open(this.refs.gif.src)
    }
    widthChange(e) {
        console.log(e.target.value)
        this.setState({ width: e.target.value });
    }

    render() {
        return (
            <div className="content">
                <script src="https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.js"></script>
                <div>
                    <input type="file" className="btn btn-success" onChange={this.changeFile.bind(this)} />
                </div>
                <hr />
                <div className="media-area">
                    <video ref="video" src="" controls muted style={{ maxWidth: '50%' }} />
                    <img ref="gif" src="" style={{ maxWidth: '50%', float: 'right' }} />
                </div>
                <hr />
                <div>
                    图片宽度 ：
                    <input type="range" min="100" max="1000" onChange={this.widthChange.bind(this)} ref="widthRange" value={this.state.width} />
                    <input type="text" value={this.state.width} readOnly style={{ width: '50px' }} />
                    <br />
                    <br />
                    <button className="btn btn-secondery" onClick={this.initAll.bind(this)}>初始化所有配置参数</button>
                    <button className="btn btn-info" onClick={this.drawVideo.bind(this)}>开始截图</button>
                    <button className="btn btn-warning" onClick={this.finishDrawVideo.bind(this)}>停止截图</button>
                    <button className="btn btn-primary" onClick={this.createGif.bind(this)}>生成Gif</button>
                    <button className="btn btn-danger" onClick={this.downloadGif.bind(this)}>下载Gif</button>
                </div>
                <div className="captures" ref="captures">
                </div>

            </div>
        )
    }
}


// ==================================== 其他========================================


