function GoogleClosureCompiler(){
	this.processClosureCompilerResponse=this.processClosureCompilerResponse.bind(this);
	this.compile=this.compile.bind(this);
}
GoogleClosureCompiler.prototype.processClosureCompilerResponse=function(evt){
	switch(this.xhr.readyState){
		case 4:
			if(this.xhr.status>=400){
				shell.Popup("Network Error:\n"+this.xhr.statusText, 0, "Google Closure Compiler",MessageBoxConstants.MB_OK|MessageBoxConstants.MB_ICONERROR|MessageBoxConstants.MB_RTLREADING|MessageBoxConstants.MB_SETFOREGROUND);
				return;
			}
			try{
				var jsr=JSON.parse(this.xhr.responseText);
				if(this.onSuccess){
					this.onSuccess(jsr);
				}
			}catch(e){
				shell.Popup("Error(s):\n"+this.xhr.responseText, 0, "Google Closure Compiler",MessageBoxConstants.MB_OK|MessageBoxConstants.MB_ICONERROR|MessageBoxConstants.MB_RTLREADING|MessageBoxConstants.MB_SETFOREGROUND);
			}
		break;
	}
}

GoogleClosureCompiler.prototype.compile=function(code,config){
	if(!code){
		shell.Popup("Your code is empty (metadata is not counted)", 0, "Google Closure Compiler",MessageBoxConstants.MB_OK|MessageBoxConstants.MB_ICONERROR|MessageBoxConstants.MB_RTLREADING|MessageBoxConstants.MB_SETFOREGROUND);
		return 0;
	}
	var compilationLevel=config.level!=undefined?config.level:1;
	switch(compilationLevel){
		case 0:compilationLevel="WHITESPACE_ONLY";break;
		case 1:compilationLevel="SIMPLE_OPTIMIZATIONS";break;
		case 2:compilationLevel="ADVANCED_OPTIMIZATIONS";break;
		case "WHITESPACE_ONLY":
		case "SIMPLE_OPTIMIZATIONS":
		case "ADVANCED_OPTIMIZATIONS":break;
		default:compilationLevel="SIMPLE_OPTIMIZATIONS";break;
	}
	var externs=config.externs||[],externFiles=config.externFiles||[],prettyPrint=(typeof config.prettyPrint!=undefined)?config.prettyPrint:1,warning_level;
	var outputInfo={"compiled_code":1,"warnings":1,"errors":1,"statistics":1};
	var params="js_code="+encodeURIComponent(code);
	params+="&compilation_level="+encodeURIComponent(compilationLevel);
	params+="&output_format=json&language=ECMASCRIPT6";
	for(var i=0;i<externs.length;i++)params+="&js_externs="+encodeURIComponent(externs[i]);
	for(var i=0;i<externFiles.length;i++)params+="&externs_url="+encodeURIComponent(externFiles[i]);
	for(var i in outputInfo)if(outputInfo[i])params+="&output_info="+i;
	//params+="&pretty_print="+prettyPrint;
	
	this.xhr=new ActiveXObject("Microsoft.XMLHTTP");
	this.xhr.open("POST","https://closure-compiler.appspot.com/compile",1);
	this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	this.xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
	this.xhr.onReadystatechange=this.processClosureCompilerResponse;
	this.xhr.send(params);
}


function KToolsModuleClosureCompiler(){
	this.ClComp=new GoogleClosureCompiler();
};
KToolsModuleClosureCompiler.prototype=new kToolsModule();
KToolsModuleClosureCompiler.prototype.langs=["javascript","html"];
KToolsModuleClosureCompiler.prototype.includeStatistics=true;
KToolsModuleClosureCompiler.prototype.processClCompResp=function(metadata,jsr){
	var statStr='';
	if(jsr.statistics){
		for(var statName in jsr.statistics){
			statStr+=statName+" : "+jsr.statistics[statName]+(statName.indexOf("Size")>-1?(" ("+Math.round(jsr.statistics[statName]*10000/jsr.statistics.originalSize)/100+"%)"):"")+"\n";
		}
	}

	var messages=[];

	var messageTypes={errors:"error",warnings:"warning"};
	for(var type in messageTypes){
		if(jsr[type]){
			jsr[type].forEach(function(i){
				i.etype=messageTypes[type];
				i.text=i[messageTypes[type]];
				delete i[messageTypes[type]];
			});
			messages=messages.concat(jsr[type]);
		}
	}

	messages=messages.sort(function(a,b){
		var dline=a.lineno-b.lineno;
		return dline?dline:(a.charno-b.charno);
	});
	
	if(messages.length>0){
		if(shell.Popup(
			statStr+"\nGoogle Closure Compiler has messages for you. Would you like to see them (you will see original code)?",
			0, "Google Closure Compiler",
			MessageBoxConstants.MB_YESNO|MessageBoxConstants.MB_ICONQUESTION|MessageBoxConstants.MB_SETFOREGROUND
		)===MessageBoxConstants.buttons.IDYES){
			createGridViewDialog({
				arr:messages,
				title:"Closure Compiler Result",
				header: ["","line","char","subtype","text"],
				getCells:function(m){
					return ["<i class='"+m.etype+"'/>",m.lineno,m.charno,m.type,m.text];
				},
				onRowClick:function(row){
					var line = parseInt(row.cells[1].innerText)-1;
					var col = parseInt(row.cells[2].innerText)-1;
					Editor.currentView.line = line;
					var lineObj = Editor.currentView.lines.get(line);
					var posNr = lineObj.start + col;
					Editor.currentView.pos = posNr;
					Editor.currentView.anchor = posNr;
				}
			});
			return;
		}
	}
	if(jsr.compiledCode){
		if(metadata){
			jsr.compiledCode=metadata.join("\n")+"\n"+jsr.compiledCode;
		}
		if(this.includeStatistics){
			jsr.compiledCode="/*\n"+statStr+"*/\n"+jsr.compiledCode;
		}
		if(Editor.currentView.selection)Editor.currentView.selection=jsr.compiledCode;
		else Editor.currentView.text=jsr.compiledCode;
		if(!this.includeStatistics&&!messages.length){
			shell.Popup(
				statStr,
				0, "Google Closure Compiler",
				MessageBoxConstants.MB_ICONINFORMATION|MessageBoxConstants.MB_SETFOREGROUND
			);
		}
	}
};

KToolsModuleClosureCompiler.prototype.metadataBlockRx=/^\/[*\/][ \t]*==([\w_-]+)==$[^\0]+?^(?:\/\/)?[ \t]*==\/\1==(?:\*\/)?$/img;
KToolsModuleClosureCompiler.prototype.cutMetadataBlocks=function(str){
	return str.match(this.metadataBlockRx);
}
KToolsModuleClosureCompiler.prototype.init=function(){
	var self=this;
	function requestClosureCompiler(cfg){
		var code=Editor.currentView.selection||Editor.currentView.text;
		var metadata=self.cutMetadataBlocks(code);
		self.ClComp.onSuccess=self.processClCompResp.bind(self,metadata);
		self.ClComp.compile(code,cfg);
	};
	this.menu = kTools.submenu("Google Closure Compiler");
	this.menu.addItem({
		text:"Whitespace optimizations",
		cmd:function(){
			requestClosureCompiler({level:0});
		}
	});
	this.menu.addItem({
		text:"Simple optimizations",
		cmd:function(){
			requestClosureCompiler({level:1});
		}
	});
	this.menu.addItem({
		text:"Advanced optimizations",
		cmd:function(){
			requestClosureCompiler({level:2});
		}
	});
	/*
	function createOptimizationDialog(){
		var dialog = new Dialog({
			npp:Editor,
			html: "<!DOCTYPE html><html></html>", 
			Height:300,
			Width:200,
			Top: 200,
			title: "Google Closure Compiler"
		});
		var doc=dialog.htmlDialog.document;
		var frm=doc.createElement("FORM");
		var tbl=doc.createElement("TABLE");
		tbl.border="1";
		tbl.style.backgroundColor="#808080";
		var prettyPrintCbx=doc.createElement("INPUT");
		prettyPrintCbx.type="checkbox";
		prettyPrintCbx.id="prettyPrintCbx";
		prettyPrintCbx.checked=true;
		var prettyPrintLbl=doc.createElement("LABEL");
		prettyPrintLbl["for"]="prettyPrintCbx";
		
		
		var startBtn=doc.createElement("INPUT");
		startBtn.type="button";
		startBtn.value="FIRE TEH LASER!!!";
		
		doc.body.appendChild(frm);
		frm.appendChild(prettyPrintLbl);
		frm.appendChild(prettyPrintCbx);
		frm.appendChild(startBtn);
		frm.appendChild(tbl);
		startBtn.focus();
	}

	closureCompilerMenu.addItem({
		text:"Custom settings",
		cmd:createOptimizationDialog
	});*/
};
kTools.addModule(new KToolsModuleClosureCompiler());
