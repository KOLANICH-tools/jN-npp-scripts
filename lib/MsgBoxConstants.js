MessageBoxConstants={
	//buttons
	MB_OK:0,
	MB_OKCANCEL:1,
	MB_ABORTRETRYIGNORE:2,
	MB_YESNOCANCEL:3,
	MB_YESNO:4,
	MB_RETRYCANCEL:5,
	MB_CANCELTRYCONTINUE:6,
	MB_HELP:0x4000,
	//icons
	MB_ICONERROR:0x10,
	MB_ICONQUESTION:0x20,
	MB_ICONEXCLAMATION:0x30,
	MB_ICONINFORMATION:0x40,
	//defaultButtons
	MB_DEFBUTTON:function(num){return (num-1)<<16;},
	//modality
	MB_APPLMODAL:0x0,//The user must respond to the message box before continuing work in the window identified by the hWnd parameter. However, the user can move to the windows of other threads and work in those windows.
	MB_SYSTEMMODAL:0x1000,//Same as MB_APPLMODAL except that the message box has the WS_EX_TOPMOST style. Use system-modal message boxes to notify the user of serious, potentially damaging errors that require immediate attention (for example, running out of memory). This flag has no effect on the user's ability to interact with windows other than those associated with hWnd.
	MB_TASKMODAL:0x2000,//Same as MB_APPLMODAL except that all the top-level windows belonging to the current thread are disabled if the hWnd parameter is NULL. Use this flag when the calling application or library does not have a window handle available but still needs to prevent input to other windows in the calling thread without suspending other threads.
	
	//other modifiers
	MB_SETFOREGROUND:0x10000,//The message box becomes the foreground window. Internally, the system calls the SetForegroundWindow function for the message box.
	MB_DEFAULT_DESKTOP_ONLY:0x20000,//Same as desktop of the interactive window station. For more information, see Window Stations.

	MB_RIGHT:0x80000,//The text is right-justified.
	MB_RTLREADING:0x100000,//Displays message and caption text using right-to-left reading order on Hebrew and Arabic systems.

	MB_TOPMOST:0x40000,//The message box is created with the WS_EX_TOPMOST window style.
	MB_SERVICE_NOTIFICATION:0x200000,//The caller is a service notifying the user of an event. The function displays a message box on the current active desktop, even if there is no user logged on to the computer.
	buttons:{
		IDOK:1,
		IDCANCEL:2,
		IDABORT:3,
		IDRETRY:4,
		IDIGNORE:5,
		IDYES:6,
		IDNO:7,
		IDTRYAGAIN:10,
		IDCONTINUE:11
	}
};
