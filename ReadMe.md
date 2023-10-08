jN-npp-scripts
==============
**We have moved to https://codeberg.org/KOLANICH-tools/jN-npp-scripts, grab new versions there.**

Under the disguise of "better security" Micro$oft-owned GitHub has [discriminated users of 1FA passwords](https://github.blog/2023-03-09-raising-the-bar-for-software-security-github-2fa-begins-march-13/) while having commercial interest in widespread adoption of [FIDO 1FA specifications](https://fidoalliance.org/specifications/download/) and [Windows Hello implementation](https://support.microsoft.com/en-us/windows/passkeys-in-windows-301c8944-5ea2-452b-9886-97e4d2ef4422) which [M$ promotes as a replacement for passwords](https://github.blog/2023-07-12-introducing-passwordless-authentication-on-github-com/). It will result in dire consequencies and is competely inacceptable, [read why](https://codeberg.org/KOLANICH/Fuck-GuanTEEnomo).

If you don't want to participate in harming yourself, it is recommended to follow the lead and migrate somewhere away of GitHub and Micro$oft. Here is [the list of alternatives and rationales to do it](https://github.com/orgs/community/discussions/49869). If they delete the discussion, there are certain well-known places where you can get a copy of it. [Read why you should also leave GitHub](https://codeberg.org/KOLANICH/Fuck-GuanTEEnomo).

---

This is scripts for [jN plugin](https://github.com/sieukrem/jn-npp-plugin) for [Notepad++](http://notepad-plus-plus.org/) editor.

Installation
------------

1. Clone to Notepad++ ```plugins\jN``` folder (basically, it's ```C:\Program Files\Notepad++\plugins\jN```)
2. Initialize submodules.
3. Restart Notepad++

```includes``` Folder contains several JavaScript Files. They implement some functionality.

* ```zen coding.js``` - extends Npp with ["Zen Coding"](http://emmet.io/) functionality,
* ```decode.js``` - adds menu, that allows to decode text from some encoding to UTF-8,
* ```clearcase.js``` - adds menu, that allows to work with files under clearcase version control,
* ```gTranslate.js``` - adds menu, that allows you to translate some selected text,
* ```MenuCmds.js``` - allows you to execute some standard menu actions of Npp,
* ```run.js``` - adds menu and hotkey to run some javascript direkt from Npp,
* ```Dialog.js``` - adds Internet Explorer based dialog functionality, including gridview dialog about errors of different tools
* ```test.menu.js``` - some tests and samples of functionality of nppscripting plugin,
* ```includes.js``` - adds new Menu, that allows you to open files in includes.

kTools
------
kTools is the main part of this repo, it is a framework to add more tools to NPP using jN plugin.

* ```kTools.js``` - base for kTools. It provides base objects for modules with some useful functionality. Its architecture is not optimal - it depends on global variable, but I dont know how to sandbox every module. Maybe some kind of metadata block?
* ```ktools/``` - modules for kTools are stored in this folder
	* ```GoogleClosureCompiler.js``` - allows you to optimize JS source with [Google Closure Compiler](https://closure-compiler.appspot.com/home) just from editor.
	* ```JSNice.js``` - [A statistical deobfuscator of JS](http://jsnice.org/). Infers names using [CRF](https://en.wikipedia.org/wiki/Conditional_random_field). [More info](http://www.srl.inf.ethz.ch/jsnice.php).
	* ```leeter.js``` - allows you convert text to [1337 5?34|<](https://encyclopediadramatica.es/1337)
	* ```PHPLint.js``` - binding to [PHPLint](http://www.icosaedro.it/phplint/), you'll have to edit the file to write correct path to it
	* ```KaitaiStructCompiler.js``` - binding to [Kaitai Struct compiler](https://github.com/kaitai-io/kaitai_struct), you'll have to edit the file to write correct path to it
	* ```deobfusctators.js``` - some self-written deobfuscators generally for JS. The name of obfuscator is often unknown (I'll be glad if you will say me the name if you know it).

Move any of these files into "includes/disabled" to disable it. For example clearcase.js if you don't know what is this :-).

Hacking
-------
[jN API reference](https://github.com/sieukrem/jn-npp-plugin/wiki)

To add a module to kTools you need to create a file in ```kTools``` folder, inherit something in ```kTools.js```, and register it with ```kTools.addModule```.
* ```kToolsModule``` is just a module with menu.
* ```kToolsCommandLineModule``` is a module which uses some CLI tool and parses it output. It allows you to add support of cli tools with minimum effort. If you provide it with the paths, it even won't put waste into the menu if the tool is not present!
