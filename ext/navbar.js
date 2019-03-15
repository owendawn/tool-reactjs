class Navbar extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        let that = this;
        document.querySelector(".pager").addEventListener("click", function () {
            let ev = document.createEvent("HTMLEvents");
            ev.initEvent("click", false, true);
            let dom = document.querySelector(".nav-link[aria-expanded='true']")
            if (dom) {
                that.toggleDropDown(dom.id);
            }
        });
    }

    toggleDropDown(id, e) {
        let target = document.getElementById(id);
        let dropdowndom = document.querySelector('.dropdown-menu[aria-labelledby="' + id + '"]');
        let parent = dropdowndom.parentNode.getBoundingClientRect();
        let it = target.getBoundingClientRect();
        let baseStyle = "top:" + it.height + "px;left:" + (it.left - parent.left) + "px;"
        if (target.getAttribute("aria-expanded") === "false") {
            dropdowndom.style = baseStyle + "display:block";
            target.setAttribute("aria-expanded", true);
        } else {
            dropdowndom.style = baseStyle + "";
            target.setAttribute("aria-expanded", false);
        }
    }

    urlChange(type, e) {
        let toggleDom = document.querySelector(".dropdown-toggle[aria-expanded='true']");
        if (toggleDom) {
            let toggleId = toggleDom.id;
            this.toggleDropDown(toggleId)
        }
        if (this.props.urlChange) {
            this.props.urlChange(type);
        } else {
            console.log("page jump");
            window.location.href = "/tool.html#" + type;
        }
    }

    render() {
        return (
            <div className="navbar">
                <div className="logoDiv" >
                    <span> -ϰ - </span>
                </div>
                <div className="navbar-nav">
                    <ul className="nav-items">
                        <li > <a href="/vipparse.html" > Vip 解 析 </a></li>
                        <li > <a onClick={this.urlChange.bind(this, "CLZH")}> 磁 链 转 换 </a></li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" onClick={this.toggleDropDown.bind(this, "navbarDropdown")} id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                工具集
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" onClick={this.urlChange.bind(this, "JRZH")}> 金 融 转 换 </a>
                                <a className="dropdown-item" onClick={this.urlChange.bind(this, "SPZGIF")}>视频 转 GIF</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}