var deobfMenu = kTools.submenu("Deobfuscate");
deobfMenu.addItem({
	text:"Deobfuscate 1",
	cmd:deobfFJO
});
function deobfFJO(){
	var massOfMasses={};
	var str=currentView.selection||currentView.text;
	var rx=new RegExp('var _(0x\d+) ?= ?\[(".+", )+, ".+"\];',"ig");
	var mass=[],massOfNamesMasses=[];
	
	var sstr;
	str=str.replace(/(_0x[0-9a-z]+)[^\[\)] ?= ?\[(["'].+['"],?[ \t\n]*)+\]/gi,function(f){massOfNamesMasses.push(f);return "";});
	var context={};

	for(var i=0;i<massOfNamesMasses.length;i++)eval(("massOfMasses."+massOfNamesMasses[i]+";"));
	
	str=str.replace(/_0x[0-9a-z]+\[[0-9a-z]+\]/gi,function (f){
		var retV;
		try{
			retV=eval("massOfMasses."+f);
		}catch(e){retV=f;}
		
		switch (typeof retV){
			case "string":
				retV=retV.toString();
				return retV.substring(12,retV.length-2);
			case "number":
				return retV;
			default:
				return retV.toSource();
		}
	});
	

	str.replace(/new String\(((\"[^\"]+\")|(\'[^\']+\'))\)/,"$1");
	//str=str.replace(/(\+?((\"[^\"]+\")|(\'[^\']+\'))){2,}/ig,function(f){return "'"+eval((f+";"),context)+"'";});
	//alert(str);
	if(currentView.selection)currentView.selection=str;
	else currentView.text=str;
};
