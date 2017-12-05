function KaitaiStructCompiler(basePath){
	this.base=basePath;
	
};
KaitaiStructCompiler.prototype=new kToolsCommandLineModule();
KaitaiStructCompiler.prototype.name="Kaitai Struct Compiler";
KaitaiStructCompiler.prototype.executable="$BASE$\\bin\\kaitai-struct-compiler.bat";
KaitaiStructCompiler.prototype.files={};
KaitaiStructCompiler.prototype.arguments=[
	"--ksc-json-output",
	"--target",
	"python",
	//"--outdir",
	//"$PATH$",
	"$PATH$"
];
KaitaiStructCompiler.prototype.postprocess=function(shared){
	var messages=[];
	res=JSON.parse(shared.stdOut);
	for(var fileName in res){
		var f=res[fileName];
		var err=f["errors"];
		if(err){
			for(var i=0;i<err.length;i++){
				var curErr=err[i];
				curErr["etype"]="error";
				curErr["type"]="error";
				curErr["lineno"]=null;
				curErr["charno"]=null;
				messages.push(curErr);
			}
		}
	}
	/*messages=messages.sort(function(a,b){
		var dline=a.lineno-b.lineno;
		return dline?dline:(a.charno-b.charno);
	});*/
	
	
	
	if(messages.length>0){
		createGridViewDialog({
			arr:messages,
			title:"Closure Compiler Result",
			header: ["","line","char","subtype","path","message"],
			getCells:function(m){
				return ["<i class='"+m.etype+"'/>",m.lineno,m.charno,m.type,m.path,m.message];
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
	if(res["output"]){
		for(var lang in languages){
			var langOut=res["output"][lang];
			for(var modName in langOut){
				var files=langOut[modName]["files"]
				for(var fileIndex=0;fileIndex<files.length;fileIndex++){
					Editor.open(files[fileIndex]["fileName"]); //TODO: open in new tab
				}
			}
		}
	}
	//Editor.currentView.text=JSON.stringify(res, null, "\t");
}
kTools.addModule(new KaitaiStructCompiler("E:\\kaitai-struct-compiler"));
