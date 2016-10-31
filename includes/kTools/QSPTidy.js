/*
A very simple stupid and dirty reindenter for QSP covering most of cases.
*/
function KToolsModuleQSPTidy(){};
KToolsModuleQSPTidy.prototype=new kToolsModule();
KToolsModuleQSPTidy.prototype.tabsProto = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
KToolsModuleQSPTidy.prototype.reindentLine=function(line, offset){
	return this.tabsProto.substring(0, offset) + line.replace(/^\s+/, "");
};
KToolsModuleQSPTidy.prototype.indChangeRx = /^\s*((?:if|act)\b.+\:|(?:else\s*\:?)|end)\s*$/i;
KToolsModuleQSPTidy.prototype.endLocRx = /^-{3}\s*.+\s*-{4,}$/i;
KToolsModuleQSPTidy.prototype.reindentQSP=function(txt){
	var nness = 0;
	var lines =txt.split("\n");
	/*var overflowOccured=false;
	var overflowBlindnessThreshold=12;
	var overflowFading=0;
	
	var underflowOccured=false;
	var underflowBlindnessThreshold=12;
	var underflowFading=0;*/
	
	var prevNness=0;
	for (var i = 0, j=0; i < lines.length; ++i, ++j) {
		var line=lines[i];
		prevNness=nness;
		if(nness<0){
			nness=0;
			//line[j++]="!WARNING: nestedness gone negative";
			//underflowOccured=true;
		}
		if(nness>this.tabsProto.length){
			nness=this.tabsProto.length;
			//line[j++]="!WARNING: nestedness overflowed limit of "+this.tabsProto.length+". Cropped.";
			//overflowOccured=true;
		}
		var r = line.match(this.indChangeRx);
		if (r && r[1]) {
			r[1]=r[1].toLowerCase();
			if (r[1] == "end") {
				--nness;
				lines[j] = this.reindentLine(line, nness);
			}
			else if (/\belse\b/.test(r[1])) {
				lines[j] = this.reindentLine(line, nness-1);
			}
			else {
				lines[j] = this.reindentLine(line, nness);
				++nness;
			}
		} else {
			if(this.endLocRx.test(line)){
				nness=0;
				//overflowOccured=false;
				//overflowFading=0;
			}
			lines[j] = this.reindentLine(line, nness);
		}
		
		/*if(overflowOccured&& nness<prevNness){
			++overflowFading;
			if(overflowFading>overflowBlindnessThreshold){
				//We think that it is safe to assume that there will be no overflows anymore so we can emit warnings about overflows again
				overflowOccured=false;
				overflowFading=0;
			}
		}*/
	}
	return lines.join("\n");
};

KToolsModuleQSPTidy.prototype.exec=function(){
	if(Editor.currentView.selection){
		Editor.currentView.selection=this.reindentQSP(Editor.currentView.selection);
	}else{
		Editor.currentView.text=this.reindentQSP(Editor.currentView.text);
	}
};

KToolsModuleQSPTidy.prototype.init=function(){
	kTools.item({
		text:"Reindent QSP",
		cmd:this.exec.bind(this)
	});
};
kTools.addModule(new KToolsModuleQSPTidy());