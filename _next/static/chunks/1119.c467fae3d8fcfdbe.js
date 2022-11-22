(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1119],{17282:function(e,t,n){e=n.nmd(e),ace.define("ace/mode/json_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var i=e("../lib/oop"),o=e("./text_highlight_rules").TextHighlightRules,r=function(){this.$rules={start:[{token:"variable",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]\\s*(?=:)'},{token:"string",regex:'"',next:"string"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:"text",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:"comment",regex:"\\/\\/.*$"},{token:"comment.start",regex:"\\/\\*",next:"comment"},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"},{token:"punctuation.operator",regex:/[,]/},{token:"text",regex:"\\s+"}],string:[{token:"constant.language.escape",regex:/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\\\/bfnrt])/},{token:"string",regex:'"|$',next:"start"},{defaultToken:"string"}],comment:[{token:"comment.end",regex:"\\*\\/",next:"start"},{defaultToken:"comment"}]}};i.inherits(r,o),t.JsonHighlightRules=r}),ace.define("ace/mode/json5_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/json_highlight_rules"],function(e,t,n){"use strict";var i=e("../lib/oop"),o=e("./json_highlight_rules").JsonHighlightRules,r=function(){o.call(this);var e=[{token:"variable",regex:/[a-zA-Z$_\u00a1-\uffff][\w$\u00a1-\uffff]*\s*(?=:)/},{token:"variable",regex:/['](?:(?:\\.)|(?:[^'\\]))*?[']\s*(?=:)/},{token:"constant.language.boolean",regex:/(?:null)\b/},{token:"string",regex:/'/,next:[{token:"constant.language.escape",regex:/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\/bfnrt]|$)/,consumeLineEnd:!0},{token:"string",regex:/'|$/,next:"start"},{defaultToken:"string"}]},{token:"string",regex:/"(?![^"]*":)/,next:[{token:"constant.language.escape",regex:/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\/bfnrt]|$)/,consumeLineEnd:!0},{token:"string",regex:/"|$/,next:"start"},{defaultToken:"string"}]},{token:"constant.numeric",regex:/[+-]?(?:Infinity|NaN)\b/}];for(var t in this.$rules)this.$rules[t].unshift.apply(this.$rules[t],e);this.normalizeRules()};i.inherits(r,o),t.Json5HighlightRules=r}),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,n){"use strict";var i=e("../range").Range,o=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t).match(/^(\s*\})/);if(!n)return 0;var o=n[1].length,r=e.findMatchingBracket({row:t,column:o});if(!r||r.row==t)return 0;var a=this.$getIndent(e.getLine(r.row));e.replace(new i(t,0,t,o-1),a)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(o.prototype),t.MatchingBraceOutdent=o}),ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(e,t,n){"use strict";var i=e("../../lib/oop"),o=e("../../range").Range,r=e("./fold_mode").FoldMode,a=t.FoldMode=function(e){e&&(this.foldingStartMarker=RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};i.inherits(a,r),(function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var i=e.getLine(n);if(this.singleLineBlockCommentRe.test(i)&&!this.startRegionRe.test(i)&&!this.tripleStarBlockCommentRe.test(i))return"";var o=this._getFoldWidgetBase(e,t,n);return!o&&this.startRegionRe.test(i)?"start":o},this.getFoldWidgetRange=function(e,t,n,i){var o=e.getLine(n);if(this.startRegionRe.test(o))return this.getCommentRegionBlock(e,o,n);var r=o.match(this.foldingStartMarker);if(r){var a=r.index;if(r[1])return this.openingBracketBlock(e,r[1],n,a);var s=e.getCommentFoldRange(n,a+r[0].length,1);return s&&!s.isMultiLine()&&(i?s=this.getSectionRange(e,n):"all"!=t&&(s=null)),s}if("markbegin"!==t){var r=o.match(this.foldingStopMarker);if(r){var a=r.index+r[0].length;return r[1]?this.closingBracketBlock(e,r[1],n,a):e.getCommentFoldRange(n,a,-1)}}},this.getSectionRange=function(e,t){for(var n=e.getLine(t),i=n.search(/\S/),r=t,a=n.length,s=t+=1,g=e.getLength();++t<g;){var l=(n=e.getLine(t)).search(/\S/);if(-1!==l){if(i>l)break;var c=this.getFoldWidgetRange(e,"all",t);if(c){if(c.start.row<=r)break;if(c.isMultiLine())t=c.end.row;else if(i==l)break}s=t}}return new o(r,a,s,e.getLine(s).length)},this.getCommentRegionBlock=function(e,t,n){for(var i=t.search(/\s*$/),r=e.getLength(),a=n,s=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,g=1;++n<r;){t=e.getLine(n);var l=s.exec(t);if(l&&(l[1]?g--:g++,!g))break}var c=n;if(c>a)return new o(a,i,c,t.length)}}).call(a.prototype)}),ace.define("ace/mode/json5",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/json5_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(e,t,n){"use strict";var i=e("../lib/oop"),o=e("./text").Mode,r=e("./json5_highlight_rules").Json5HighlightRules,a=e("./matching_brace_outdent").MatchingBraceOutdent,s=e("./behaviour/cstyle").CstyleBehaviour,g=e("./folding/cstyle").FoldMode,l=function(){this.HighlightRules=r,this.$outdent=new a,this.$behaviour=new s,this.foldingRules=new g};i.inherits(l,o),(function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/json5"}).call(l.prototype),t.Mode=l}),ace.require(["ace/mode/json5"],function(t){e&&(e.exports=t)})},71119:function(e,t,n){"use strict";n.r(t);var i=n(85893),o=n(67294),r=n(74981);n(17282),n(74936);var a=n(11409),s=n(55061);let g=()=>{let{model:e,dispatch:t}=(0,o.useContext)(a.rU),n=(0,o.useCallback)(e=>{t((0,s.j1)(e||""))},[t]);return(0,i.jsx)(r.ZP,{width:"100%",height:"calc(100% - 64px)",fontSize:16,mode:"json5",theme:"sqlserver",name:"json_editor",value:e,editorProps:{$blockScrolling:!0},onChange:n})};t.default=g}}]);