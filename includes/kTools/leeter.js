require(Editor.nppDir+"/Plugins/jN/jN/lib/Leeter.js/Leeter.js");//https://github.com/KOLANICH/Leeter.js

function KToolsModuleLeeter(){};
KToolsModuleLeeter.prototype=new kToolsModule();
KToolsModuleLeeter.prototype.init=function(){
	var leeterMenu = kTools.submenu("1377er");
	var leeter=new Leeter();
	leeterMenu.addItem({
		text:"1377ify",
		cmd:function(){
			if(currentView.selection){
				currentView.selection=leeter.makeLeet(currentView.selection);
			}else
				currentView.text=leeter.makeLeet(currentView.text);
		}
	});
	leeterMenu.addItem({
		text:"limited 1377ify",
		cmd:function(){
			var leetedCharsPerWord=parseInt(prompt("input count"));
			if(currentView.selection){
				currentView.selection=leeter.makeLeetByWords(currentView.selection, leetedCharsPerWord);
			}else
				currentView.text=leeter.makeLeetByWords(currentView.text, leetedCharsPerWord);
		}
	});
};
kTools.addModule(new KToolsModuleLeeter());
