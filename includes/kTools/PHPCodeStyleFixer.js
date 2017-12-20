function kToolsModulePHPCodeStyleFixer(basePath){
	this.base=basePath;
	
};
/*
E:\php>php  --xml help fix
*/
kToolsModulePHPCodeStyleFixer.prototype=new kToolsCommandLineModule();
kToolsModulePHPCodeStyleFixer.prototype.name="PHP-CS-Fixer";
kToolsModulePHPCodeStyleFixer.prototype.executable="E:\\php\\php.exe";
kToolsModulePHPCodeStyleFixer.prototype.files={
	"PHPCSFIXER":"$BASE$php-cs-fixer"
};
kToolsModulePHPCodeStyleFixer.prototype.arguments=[
	"$PHPCSFIXER$",
	"--no-interaction",
	"fix",
	"$PATH$",
	"--format=json",
	'--output="php://stderr"'
];
kToolsModulePHPCodeStyleFixer.prototype.postprocess=function(shared){
	if(!shared.stdErr){
		shell.Popup("Fixing is not needed", 0, this.name, MessageBoxConstants.MB_OK|MessageBoxConstants.MB_ICONINFORMATION);
		return;
	}
	Editor.currentView.text=shared.stdErr;
	alert(shared.stdOut);
}
kTools.addModule(new kToolsModulePHPCodeStyleFixer("E:\\public_html\\modules\\PHP-CS-Fixer\\"));
