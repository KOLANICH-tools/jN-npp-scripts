function JSNice(){
	this.processResponse=this.processResponse.bind(this);
	this.deobf=this.deobf.bind(this);
}
JSNice.prototype.processResponse=function(evt){
	switch(this.xhr.readyState){
		case 4:
			if(this.xhr.status>=400){
				shell.Popup("Network Error:\n"+this.xhr.statusText, 0, "JSNice",MessageBoxConstants.MB_OK|MessageBoxConstants.MB_ICONERROR|MessageBoxConstants.MB_RTLREADING|MessageBoxConstants.MB_SETFOREGROUND);
				return;
			}
			try{
				var jsr=JSON.parse(this.xhr.responseText);
				if(this.onSuccess){
					this.onSuccess(jsr);
				}
			}catch(e){
				shell.Popup("Error(s):\n"+this.xhr.responseText, 0, "JSNice",MessageBoxConstants.MB_OK|MessageBoxConstants.MB_ICONERROR|MessageBoxConstants.MB_RTLREADING|MessageBoxConstants.MB_SETFOREGROUND);
			}
		break;
	}
}

JSNice.prototype.deobf=function(code){
	if(!code){
		shell.Popup("Your code is empty (metadata is not counted)", 0, "JSNice",MessageBoxConstants.MB_OK|MessageBoxConstants.MB_ICONERROR|MessageBoxConstants.MB_RTLREADING|MessageBoxConstants.MB_SETFOREGROUND);
		return 0;
	}
	var url="http://www.jsnice.org/beautify?";
	var config={pretty:1,rename:1,types:1,suggest:0};
	for(var par in config){
		url+=par+"="+config[par]+"&";
	}
	
	this.xhr=new ActiveXObject("Microsoft.XMLHTTP");
	this.xhr.open("POST",url,1);
	//this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	this.xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
	this.xhr.onReadystatechange=this.processResponse;
	this.xhr.send(code);
}


function KToolsModuleJSNice(){
	this.JSNice=new JSNice();
};
KToolsModuleJSNice.prototype=new kToolsModule();
KToolsModuleJSNice.prototype.langs=["javascript","html"];
KToolsModuleJSNice.prototype.processResp=function(metadata,jsr){
	var text=jsr.js;
	if(metadata){
		text=metadata+text;
	}
	if(typeof jsr.suggest !== "undefined"){
		for(var varSubst in jsr.suggest)text=text.replace(new RegExp(varSubst,"g"),jsr.suggest[varSubst]);
	}
	if(Editor.currentView.selection)Editor.currentView.selection=jsr.js;
		else Editor.currentView.text=text;
};

KToolsModuleJSNice.prototype.metadataBlockRx=/^\/[*\/][ \t]*==([\w_-]+)==$[^\0]+?^(?:\/\/)?[ \t]*==\/\1==(?:\*\/)?$/img;
KToolsModuleJSNice.prototype.cutMetadataBlocks=function(str){
	return str.match(this.metadataBlockRx);
}
KToolsModuleJSNice.prototype.init=function(){
	var self=this;
	function requestJSNice(){
		var code=Editor.currentView.selection||Editor.currentView.text;
		var metadata=self.cutMetadataBlocks(code);
		self.JSNice.onSuccess=self.processResp.bind(self,metadata);
		self.JSNice.deobf(code);
	};
	kTools.item({
		text:"JSNice",
		cmd:function(){
			requestJSNice();
		}
	});
};
kTools.addModule(new KToolsModuleJSNice());