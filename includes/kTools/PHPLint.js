function kToolsModulePHPLint(basePath){
	this.base=basePath;
	this.executable=this.base+'src\\phplint.exe';
};
kToolsModulePHPLint.prototype=new kToolsCommandLineModule();
kToolsModulePHPLint.prototype.name="PHP Lint";
kToolsModulePHPLint.prototype.stdOutRx=/([a-z]:[\\\/\/\w_ -.]+):(\d+):\s*((?:fatal\s+)?(?:warning|error|notice)):(.+)$/im;
kToolsModulePHPLint.prototype.arguments=[
	'--modules-path $BASE$modules',
	"--tab-size 4",
	"--php-version 5",
	"--print-path shortest",
	"$PATH$"
];
kToolsModulePHPLint.prototype.stdOutLineProcesser=function(parsedLine,line,shared){
	if(parsedLine){
		var type=parsedLine[3].toLowerCase();
		type=type.replace(/\s+/i,'_');
		shared.messages.push({
			"type" : type,
			"file" : parsedLine[1],
			"line" : parsedLine[2],
			"message" : parsedLine[4],
		});
	}else{
		shared.messages.push({
			"message" : line,
		});
	}
}
kTools.addModule(new kToolsModulePHPLint("E:\\phplint\\phplint\\"));
