//>>built
define("dojox/mobile/bidi/CarouselItem",["dojo/_base/declare","./common"],function(b,c){return b(null,{_setHeaderTextAttr:function(a){this._set("headerText",a);this.headerTextNode.innerHTML=this._cv?this._cv(a):a;a=this.getParent()?this.getParent().getParent():null;if(this.textDir=this.textDir?this.textDir:a?a.get("textDir"):"")this.headerTextNode.innerHTML=c.enforceTextDirWithUcc(this.headerTextNode.innerHTML,this.textDir)},_setFooterTextAttr:function(a){this._set("footerText",a);this.footerTextNode.innerHTML=
this._cv?this._cv(a):a;a=this.getParent()?this.getParent().getParent():null;if(this.textDir=this.textDir?this.textDir:a?a.get("textDir"):"")this.footerTextNode.innerHTML=_BidiSupport.enforceTextDirWithUcc(this.footerTextNode.innerHTML,this.textDir)}})});
//# sourceMappingURL=CarouselItem.js.map