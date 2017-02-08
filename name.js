function CrossDomainName(target, agent, callback, security) {
    if (typeof target !== 'string' || typeof agent !== 'string' || typeof callback !== 'function') {
        throw '参数错误';
    }
    this.state = 0;
    this.target = target;
    this.agent = agent;
    this.callback = callback || Function;
    this.security = security || true;
    this.iframe = document.createElement('iframe');
    var self = this;
    function onload() {
        if (self.state === 1) {
            var data = self.iframe.contentWindow.name;
            self.callback.call(self.iframe, data);
            if (self) {
                self.iframe.contentWindow.document.close();//关闭文档流  
                self.iframe.contentWindow.close();//关闭Iframe  
                document.body.removeChild(self.iframe);//移除Iframe  
            }
        } else if (self.state === 0) {
            self.state = 1;
            self.iframe.contentWindow.location = self.agent;
        }
    }
    if (document.attachEvent) {
        this.iframe.attachEvent('onload', onload);
    } else if (document.addEventListener) {
        this.iframe.addEventListener('load', onload, false);
    } else {
        this.iframe.onload = onload;
    }
    this.iframe.src = this.target;
    document.body.appendChild(this.iframe);
}
//调用  
new CrossDomainName('http://www.kingwell.com/kingwell.html', 'http://name.b.com/adfas.html', function (data) {
    alert(data);
});  