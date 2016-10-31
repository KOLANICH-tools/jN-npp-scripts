function KToolsModuleCopyAs(){};
KToolsModuleCopyAs.prototype=new kToolsModule();
KToolsModuleCopyAs.prototype.converters={
	"C string":function(str){
		return "\""+str.replace(/"/g,"\\\"").split(/\r?\n/g).join("\\n\"\n\"")+"\"";
	}
};
KToolsModuleCopyAs.prototype.init=function(){
	var menu = kTools.submenu("CopyAs");
	for(var cName in this.converters){
		var f=this.converters[cName];
		menu.addItem({
			text:cName,
			cmd:(function(){
				return function(){
					if(currentView.selection){
						System.clipBoard=f(currentView.selection);
					}else
						System.clipBoard=f(currentView.text);
				};
			})()
		});
	}
};
kTools.addModule(new KToolsModuleCopyAs());