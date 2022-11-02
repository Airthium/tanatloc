"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4716],{34716:function(e,t,n){n.r(t),n.d(t,{default:function(){return g}});var s=n(85893),r=n(67294),a=n(74981);n(74936),ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){let s=e("../lib/oop"),r=e("./text_highlight_rules").TextHighlightRules;class a{static getTagRule(e){return{token:"comment.doc.tag.storage.type",regex:"\\b(?:TODO|FIXME|XXX|HACK)\\b"}}static getStartRule(e){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:e}}static getEndRule(e){return{token:"comment.doc",regex:"\\*\\/",next:e}}constructor(){this.$rules={start:[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},a.getTagRule(),{defaultToken:"comment.doc",caseInsensitive:!0}]}}}s.inherits(a,r),t.DocCommentHighlightRules=a}),ace.define("ace/mode/javascript_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],function(e,t,n){let s=e("../lib/oop"),r=e("./doc_comment_highlight_rules").DocCommentHighlightRules,a=e("./text_highlight_rules").TextHighlightRules,o="[a-zA-Z\\$_\xa1-￿][a-zA-Z\\d\\$_\xa1-￿]*";class i{constructor(e){let t=this.createKeywordMapper({"variable.language":"Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|Namespace|QName|XML|XMLList|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt|JSON|Math|this|arguments|prototype|window|document",keyword:"const|yield|import|get|set|async|await|break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|of|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|__parent__|__count__|escape|unescape|with|__proto__|class|enum|extends|super|export|implements|private|public|interface|package|protected|static","storage.type":"const|let|var|function","constant.language":"null|Infinity|NaN|undefined","support.function":"alert","constant.language.boolean":"true|false"},"identifier"),n="\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|u{[0-9a-fA-F]{1,6}}|[0-2][0-7]{0,2}|3[0-7][0-7]?|[4-7][0-7]?|.)";this.$rules={no_regex:[r.getStartRule("doc-start"),g("no_regex"),{token:"string",regex:"'(?=.)",next:"qstring"},{token:"string",regex:'"(?=.)',next:"qqstring"},{token:"constant.numeric",regex:/0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/},{token:"constant.numeric",regex:/(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/},{token:["storage.type","punctuation.operator","support.function","punctuation.operator","entity.name.function","text","keyword.operator"],regex:"("+o+")(\\.)(prototype)(\\.)("+o+")(\\s*)(=)",next:"function_arguments"},{token:["storage.type","punctuation.operator","entity.name.function","text","keyword.operator","text","storage.type","text","paren.lparen"],regex:"("+o+")(\\.)("+o+")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",next:"function_arguments"},{token:["entity.name.function","text","keyword.operator","text","storage.type","text","paren.lparen"],regex:"("+o+")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",next:"function_arguments"},{token:["storage.type","punctuation.operator","entity.name.function","text","keyword.operator","text","storage.type","text","entity.name.function","text","paren.lparen"],regex:"("+o+")(\\.)("+o+")(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()",next:"function_arguments"},{token:["storage.type","text","entity.name.function","text","paren.lparen"],regex:"(function)(\\s+)("+o+")(\\s*)(\\()",next:"function_arguments"},{token:["entity.name.function","text","punctuation.operator","text","storage.type","text","paren.lparen"],regex:"("+o+")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",next:"function_arguments"},{token:["text","text","storage.type","text","paren.lparen"],regex:"(:)(\\s*)(function)(\\s*)(\\()",next:"function_arguments"},{token:"keyword",regex:"from(?=\\s*('|\"))"},{token:"keyword",regex:"(?:case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void)\\b",next:"start"},{token:["support.constant"],regex:/that\b/},{token:["storage.type","punctuation.operator","support.function.firebug"],regex:/(console)(\.)(warn|info|log|error|time|trace|timeEnd|assert)\b/},{token:t,regex:o},{token:"punctuation.operator",regex:/[.](?![.])/,next:"property"},{token:"storage.type",regex:/=>/,next:"start"},{token:"keyword.operator",regex:/--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,next:"start"},{token:"punctuation.operator",regex:/[?:,;.]/,next:"start"},{token:"paren.lparen",regex:/[\[({]/,next:"start"},{token:"paren.rparen",regex:/[\])}]/},{token:"comment",regex:/^#!.*$/}],property:[{token:"text",regex:"\\s+"},{token:["storage.type","punctuation.operator","entity.name.function","text","keyword.operator","text","storage.type","text","entity.name.function","text","paren.lparen"],regex:"("+o+")(\\.)("+o+")(\\s*)(=)(\\s*)(function)(?:(\\s+)(\\w+))?(\\s*)(\\()",next:"function_arguments"},{token:"punctuation.operator",regex:/[.](?![.])/},{token:"support.function",regex:/(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/},{token:"support.function.dom",regex:/(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/},{token:"support.constant",regex:/(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/},{token:"identifier",regex:o},{regex:"",token:"empty",next:"no_regex"}],start:[r.getStartRule("doc-start"),g("start"),{token:"string.regexp",regex:"\\/",next:"regex"},{token:"text",regex:"\\s+|^$",next:"start"},{token:"empty",regex:"",next:"no_regex"}],regex:[{token:"regexp.keyword.operator",regex:"\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"},{token:"string.regexp",regex:"/[sxngimy]*",next:"no_regex"},{token:"invalid",regex:/\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/},{token:"constant.language.escape",regex:/\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/},{token:"constant.language.delimiter",regex:/\|/},{token:"constant.language.escape",regex:/\[\^?/,next:"regex_character_class"},{token:"empty",regex:"$",next:"no_regex"},{defaultToken:"string.regexp"}],regex_character_class:[{token:"regexp.charclass.keyword.operator",regex:"\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"},{token:"constant.language.escape",regex:"]",next:"regex"},{token:"constant.language.escape",regex:"-"},{token:"empty",regex:"$",next:"no_regex"},{defaultToken:"string.regexp.charachterclass"}],function_arguments:[{token:"variable.parameter",regex:o},{token:"punctuation.operator",regex:"[, ]+"},{token:"punctuation.operator",regex:"$"},{token:"empty",regex:"",next:"no_regex"}],qqstring:[{token:"constant.language.escape",regex:n},{token:"string",regex:"\\\\$",consumeLineEnd:!0},{token:"string",regex:'"|$',next:"no_regex"},{defaultToken:"string"}],qstring:[{token:"constant.language.escape",regex:n},{token:"string",regex:"\\\\$",consumeLineEnd:!0},{token:"string",regex:"'|$",next:"no_regex"},{defaultToken:"string"}]},e&&e.noES6||(this.$rules.no_regex.unshift({regex:"[{}]",onMatch:function(e,t,n){if(this.next="{"==e?this.nextState:"","{"==e&&n.length)n.unshift("start",t);else if("}"==e&&n.length&&(n.shift(),this.next=n.shift(),-1!=this.next.indexOf("string")||-1!=this.next.indexOf("jsx")))return"paren.quasi.end";return"{"==e?"paren.lparen":"paren.rparen"},nextState:"start"},{token:"string.quasi.start",regex:/`/,push:[{token:"constant.language.escape",regex:n},{token:"paren.quasi.start",regex:/\${/,push:"start"},{token:"string.quasi.end",regex:/`/,next:"pop"},{defaultToken:"string.quasi"}]}),e&&!1==e.jsx||l.call(this)),this.embedRules(r,"doc-",[r.getEndRule("no_regex")]),this.normalizeRules()}}function l(){let e=o.replace("\\d","\\d\\-"),t={onMatch:function(e,t,n){let s="/"==e.charAt(1)?2:1;return 1==s?(t!=this.nextState?n.unshift(this.next,this.nextState,0):n.unshift(this.next),n[2]++):2==s&&t==this.nextState&&(n[1]--,(!n[1]||n[1]<0)&&(n.shift(),n.shift())),[{type:"meta.tag.punctuation."+(1==s?"":"end-")+"tag-open.xml",value:e.slice(0,s)},{type:"meta.tag.tag-name.xml",value:e.substr(s)}]},regex:"</?"+e,next:"jsxAttributes",nextState:"jsx"};this.$rules.start.unshift(t);let n={regex:"{",token:"paren.quasi.start",push:"start"};this.$rules.jsx=[n,t,{include:"reference"},{defaultToken:"string"}],this.$rules.jsxAttributes=[{token:"meta.tag.punctuation.tag-close.xml",regex:"/?>",onMatch:function(e,t,n){return t==n[0]&&n.shift(),2==e.length&&(n[0]==this.nextState&&n[1]--,(!n[1]||n[1]<0)&&n.splice(0,2)),this.next=n[0]||"start",[{type:this.token,value:e}]},nextState:"jsx"},n,g("jsxAttributes"),{token:"entity.other.attribute-name.xml",regex:e},{token:"keyword.operator.attribute-equals.xml",regex:"="},{token:"text.tag-whitespace.xml",regex:"\\s+"},{token:"string.attribute-value.xml",regex:"'",stateName:"jsx_attr_q",push:[{token:"string.attribute-value.xml",regex:"'",next:"pop"},{include:"reference"},{defaultToken:"string.attribute-value.xml"}]},{token:"string.attribute-value.xml",regex:'"',stateName:"jsx_attr_qq",push:[{token:"string.attribute-value.xml",regex:'"',next:"pop"},{include:"reference"},{defaultToken:"string.attribute-value.xml"}]},t],this.$rules.reference=[{token:"constant.language.escape.reference.xml",regex:"(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"}]}function g(e){return[{token:"comment",regex:/\/\*/,next:[r.getTagRule(),{token:"comment",regex:"\\*\\/",next:e||"pop"},{defaultToken:"comment",caseInsensitive:!0}]},{token:"comment",regex:"\\/\\/",next:[r.getTagRule(),{token:"comment",regex:"$|^",next:e||"pop"},{defaultToken:"comment",caseInsensitive:!0}]}]}s.inherits(i,a),t.JavaScriptHighlightRules=i}),ace.define("ace/mode/freefem_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],function(e,t,n){let s=e("../lib/oop"),r=e("./doc_comment_highlight_rules").DocCommentHighlightRules,a=e("./text_highlight_rules").TextHighlightRules,o="[a-zA-Z\\$_\xa1-￿][a-zA-Z\\d\\$_\xa1-￿]*";class i{constructor(e){let t=this.createKeywordMapper({"variable.language":"ENDIFMACRO|include|IFMACRO|load",keyword:"adj|append|area|ARGV|be|binary|BoundaryEdge|bordermeasure|CG|Cholesky|cin|cout|Crout|default|diag|edgeOrientation|endl|false|ffind|FILE|find|fixed|flush|GMRES|good|hTriangle|im|imax|imin|InternalEdge|l1|l2|label|lenEdge|length|LINE|linfty|LU|m|max|measure|min|mpiAnySource|mpiBAND|mpiBXOR|mpiCommWorld|mpiLAND|mpiLOR|mpiLXOR|mpiMAX|mpiMIN|mpiPROD|mpirank|mpisize|mpiSUM|mpiUndefined|n|N|Nt|nbe|ndof|ndofK|noshowbase|noshowpos|notaregion|nt|nTonEdge|nuEdge|nuTriangle|nv|nbnomanifold|P|pi|precision|qf1pE|qf1pElump|qf1pT|qf1pTlump|qfV1|qfV1lump|qf2pE|qf2pT|qf2pT4P1|qfV2|qf3pE|qf4pE|qf5pE|qf5pT|qfV5|qf7pT|qf9pT|qfnbpE|quantile|re|region|rfind|scientific|searchMethod|setw|showbase|showpos|sparsesolver|sum|tellp|true|UMFPACK|unused|whoinElement|verbosity|version|volume|x|y|z","storage.type":"bool|border|complex|dmatrix|fespace|func|gslspline|ifstream|int|macro|matrix|mesh|mesh3|meshS|meshL|mpiComm|mpiGroup|mpiRequest|NewMacro|EndMacro|ofstream|Pmmap|problem|Psemaphore|real|solve|string|varf","constant.language":"BDM1|BDM1Ortho|Edge03d|Edge13d|Edge23d|FEQF|HCT|P0|P03d|P0Edge|P1|P13d|P1b|P1b3d|P1bl|P1bl3d|P1dc|P1Edge|P1nc|P2|P23d|P2b|P2BR|P2dc|P2Edge|P2h|P2Morley|P2pnc|P3|P3dc|P3Edge|P4|P4dc|P4Edge|P5Edge|RT0|RT03d|RT0Ortho|RT1|RT1Ortho|RT2|RT2Ortho","support.function":"abs|acos|acosh|adaptmesh|adj|AffineCG|AffineGMRES|arg|asin|asinh|assert|atan|atan2|atanh|atof|atoi|BFGS|broadcast|buildlayers|buildmesh|buildBdMesh|ceil|chi|complexEigenValue|copysign|change|checkmovemesh|checkmesh|clock|cmaes|conj|convect|cos|cosh|cube|d|dd|dfft|diffnp|diffpos|dimKrylov|dist|dumptable|dx|dxx|dxy|dxz|dy|dyx|dyy|dyz|dz|dzx|dzy|dzz|EigenValue|emptymesh|erf|erfc|exec|exit|exp|extract|fdim|floor|fmax|fmin|fmod|freeyams|Gamma|getARGV|getline|gmshload|gmshload3|gslcdfugaussianP|gslcdfugaussianQ|gslcdfugaussianPinv|gslcdfugaussianQinv|gslcdfgaussianP|gslcdfgaussianQ|gslcdfgaussianPinv|gslcdfgaussianQinv|gslcdfgammaP|gslcdfgammaQ|gslcdfgammaPinv|gslcdfgammaQinv|gslcdfcauchyP|gslcdfcauchyQ|gslcdfcauchyPinv|gslcdfcauchyQinv|gslcdflaplaceP|gslcdflaplaceQ|gslcdflaplacePinv|gslcdflaplaceQinv|gslcdfrayleighP|gslcdfrayleighQ|gslcdfrayleighPinv|gslcdfrayleighQinv|gslcdfchisqP|gslcdfchisqQ|gslcdfchisqPinv|gslcdfchisqQinv|gslcdfexponentialP|gslcdfexponentialQ|gslcdfexponentialPinv|gslcdfexponentialQinv|gslcdfexppowP|gslcdfexppowQ|gslcdftdistP|gslcdftdistQ|gslcdftdistPinv|gslcdftdistQinv|gslcdffdistP|gslcdffdistQ|gslcdffdistPinv|gslcdffdistQinv|gslcdfbetaP|gslcdfbetaQ|gslcdfbetaPinv|gslcdfbetaQinv|gslcdfflatP|gslcdfflatQ|gslcdfflatPinv|gslcdfflatQinv|gslcdflognormalP|gslcdflognormalQ|gslcdflognormalPinv|gslcdflognormalQinv|gslcdfgumbel1P|gslcdfgumbel1Q|gslcdfgumbel1Pinv|gslcdfgumbel1Qinv|gslcdfgumbel2P|gslcdfgumbel2Q|gslcdfgumbel2Pinv|gslcdfgumbel2Qinv|gslcdfweibullP|gslcdfweibullQ|gslcdfweibullPinv|gslcdfweibullQinv|gslcdfparetoP|gslcdfparetoQ|gslcdfparetoPinv|gslcdfparetoQinv|gslcdflogisticP|gslcdflogisticQ|gslcdflogisticPinv|gslcdflogisticQinv|gslcdfbinomialP|gslcdfbinomialQ|gslcdfpoissonP|gslcdfpoissonQ|gslcdfgeometricP|gslcdfgeometricQ|gslcdfnegativebinomialP|gslcdfnegativebinomialQ|gslcdfpascalP|gslcdfpascalQ|gslinterpakima|gslinterpakimaperiodic|gslinterpcsplineperiodic|gslinterpcspline|gslinterpsteffen|gslinterplinear|gslinterppolynomial|gslranbernoullipdf|gslranbeta|gslranbetapdf|gslranbinomialpdf|gslranexponential|gslranexponentialpdf|gslranexppow|gslranexppowpdf|gslrancauchy|gslrancauchypdf|gslranchisq|gslranchisqpdf|gslranerlang|gslranerlangpdf|gslranfdist|gslranfdistpdf|gslranflat|gslranflatpdf|gslrangamma|gslrangammaint|gslrangammapdf|gslrangammamt|gslrangammaknuth|gslrangaussian|gslrangaussianratiomethod|gslrangaussianziggurat|gslrangaussianpdf|gslranugaussian|gslranugaussianratiomethod|gslranugaussianpdf|gslrangaussiantail|gslrangaussiantailpdf|gslranugaussiantail|gslranugaussiantailpdf|gslranlandau|gslranlandaupdf|gslrangeometricpdf|gslrangumbel1|gslrangumbel1pdf|gslrangumbel2|gslrangumbel2pdf|gslranlogistic|gslranlogisticpdf|gslranlognormal|gslranlognormalpdf|gslranlogarithmicpdf|gslrannegativebinomialpdf|gslranpascalpdf|gslranpareto|gslranparetopdf|gslranpoissonpdf|gslranrayleigh|gslranrayleighpdf|gslranrayleightail|gslranrayleightailpdf|gslrantdist|gslrantdistpdf|gslranlaplace|gslranlaplacepdf|gslranlevy|gslranweibull|gslranweibullpdf|gslsfairyAi|gslsfairyBi|gslsfairyAiscaled|gslsfairyBiscaled|gslsfairyAideriv|gslsfairyBideriv|gslsfairyAiderivscaled|gslsfairyBiderivscaled|gslsfairyzeroAi|gslsfairyzeroBi|gslsfairyzeroAideriv|gslsfairyzeroBideriv|gslsfbesselJ0|gslsfbesselJ1|gslsfbesselJn|gslsfbesselY0|gslsfbesselY1|gslsfbesselYn|gslsfbesselI0|gslsfbesselI1|gslsfbesselIn|gslsfbesselI0scaled|gslsfbesselI1scaled|gslsfbesselInscaled|gslsfbesselK0|gslsfbesselK1|gslsfbesselKn|gslsfbesselK0scaled|gslsfbesselK1scaled|gslsfbesselKnscaled|gslsfbesselj0|gslsfbesselj1|gslsfbesselj2|gslsfbesseljl|gslsfbessely0|gslsfbessely1|gslsfbessely2|gslsfbesselyl|gslsfbesseli0scaled|gslsfbesseli1scaled|gslsfbesseli2scaled|gslsfbesselilscaled|gslsfbesselk0scaled|gslsfbesselk1scaled|gslsfbesselk2scaled|gslsfbesselklscaled|gslsfbesselJnu|gslsfbesselYnu|gslsfbesselInuscaled|gslsfbesselInu|gslsfbesselKnuscaled|gslsfbesselKnu|gslsfbessellnKnu|gslsfbesselzeroJ0|gslsfbesselzeroJ1|gslsfbesselzeroJnu|gslsfclausen|gslsfhydrogenicR1|gslsfdawson|gslsfdebye1|gslsfdebye2|gslsfdebye3|gslsfdebye4|gslsfdebye5|gslsfdebye6|gslsfdilog|gslsfmultiply|gslsfellintKcomp|gslsfellintEcomp|gslsfellintPcomp|gslsfellintDcomp|gslsfellintF|gslsfellintE|gslsfellintRC|gslsferfc|gslsflogerfc|gslsferf|gslsferfZ|gslsferfQ|gslsfhazard|gslsfexp|gslsfexpmult|gslsfexpm1|gslsfexprel|gslsfexprel2|gslsfexpreln|gslsfexpintE1|gslsfexpintE2|gslsfexpintEn|gslsfexpintE1scaled|gslsfexpintE2scaled|gslsfexpintEnscaled|gslsfexpintEi|gslsfexpintEiscaled|gslsfShi|gslsfChi|gslsfexpint3|gslsfSi|gslsfCi|gslsfatanint|gslsffermidiracm1|gslsffermidirac0|gslsffermidirac1|gslsffermidirac2|gslsffermidiracint|gslsffermidiracmhalf|gslsffermidirachalf|gslsffermidirac3half|gslsffermidiracinc0|gslsflngamma|gslsfgamma|gslsfgammastar|gslsfgammainv|gslsftaylorcoeff|gslsffact|gslsfdoublefact|gslsflnfact|gslsflndoublefact|gslsflnchoose|gslsfchoose|gslsflnpoch|gslsfpoch|gslsfpochrel|gslsfgammaincQ|gslsfgammaincP|gslsfgammainc|gslsflnbeta|gslsfbeta|gslsfbetainc|gslsfgegenpoly1|gslsfgegenpoly2|gslsfgegenpoly3|gslsfgegenpolyn|gslsfhyperg0F1|gslsfhyperg1F1int|gslsfhyperg1F1|gslsfhypergUint|gslsfhypergU|gslsfhyperg2F0|gslsflaguerre1|gslsflaguerre2|gslsflaguerre3|gslsflaguerren|gslsflambertW0|gslsflambertWm1|gslsflegendrePl|gslsflegendreP1|gslsflegendreP2|gslsflegendreP3|gslsflegendreQ0|gslsflegendreQ1|gslsflegendreQl|gslsflegendrePlm|gslsflegendresphPlm|gslsflegendrearraysize|gslsfconicalPhalf|gslsfconicalPmhalf|gslsfconicalP0|gslsfconicalP1|gslsfconicalPsphreg|gslsfconicalPcylreg|gslsflegendreH3d0|gslsflegendreH3d1|gslsflegendreH3d|gslsflog|gslsflogabs|gslsflog1plusx|gslsflog1plusxmx|gslsfpowint|gslsfpsiint|gslsfpsi|gslsfpsi1piy|gslsfpsi1int|gslsfpsi1|gslsfpsin|gslsfsynchrotron1|gslsfsynchrotron2|gslsftransport2|gslsftransport3|gslsftransport4|gslsftransport5|gslsfsin|gslsfcos|gslsfhypot|gslsfsinc|gslsflnsinh|gslsflncosh|gslsfanglerestrictsymm|gslsfanglerestrictpos|gslsfzetaint|gslsfzeta|gslsfzetam1|gslsfzetam1int|gslsfhzeta|gslsfetaint|gslsfeta|imag|int0d|int1d|int2d|int3d|intN|intN1|intalledges|intallfaces|interpolate|invdiff|invdiffnp|invdiffpos|Isend|isInf|isNaN|isoline|Irecv|j0|j1|jn|jump|lgamma|LinearCG|LinearGMRES|log|log10|lrint|lround|max|mean|medit|min|mmg3d|movemesh|movemesh23|movemesh3|movemeshS|mpiAlltoall|mpiAlltoallv|mpiAllgather|mpiAllgatherv|mpiAllReduce|mpiBarrier|mpiGather|mpiGatherv|mpiRank|mpiReduce|mpiScatter|mpiScatterv|mpiSize|mpiWait|mpiWaitAny|mpiWtick|mpiWtime|mshmet|NaN|NLCG|on|plot|polar|Post|pow|processor|processorblock|projection|randinit|randint31|randint32|random|randreal1|randreal2|randreal3|randres53|Read|readmesh|readmesh3|Recv|rint|round|savemesh|savesol|savevtk|seekg|Sent|set|sign|signbit|sin|sinh|sort|splitComm|splitmesh|sqrt|square|square3|segment|srandom|srandomdev|Stringification|swap|system|tan|tanh|tellg|tetg|tetgconvexhull|tetgreconstruction|tetgtransfo|tgamma|triangulate|trunc|Wait|Write|y0|y1|yn","constant.language.boolean":"true|false","variable.parameter":"A|A1|abserror|absolute|aniso|aspectratio|B|B1|bb|beginend|bin|boundary|bw|close|cleanmesh|cmm|coef|composante|cutoff|datafilename|dataname|dim|distmax|displacement|doptions|dparams|eps|err|errg|facemerge|facetcl|factorize|file|fill|fixedborder|flabel|flags|floatmesh|floatsol|fregion|gradation|grey|hmax|hmin|holelist|hsv|init|inquire|inside|IsMetric|iso|ivalue|keepbackvertices|label|labeldown|labelmid|labelup|levelset|loptions|lparams|maxit|maxsubdiv|meditff|mem|memory|metric|mode|nbarrow|nbiso|nbiter|nbjacoby|nboffacetcl|nbofholes|nbofregions|nbregul|nbsmooth|nbvx|ncv|nev|nomeshgeneration|normalization|omega|op|optimize|option|options|order|orientation|periodic|pNormalT|power|precisvertice|precon|prev|ps|ptmerge|qfe|qforder|qft|qfV|ratio|rawvector|refe|reffacelow|reffacemid|reffaceup|refnum|reft|reftet|reftri|region|regionlist|removeduplicate|renumv|renumt|rescaling|ridgeangle|ridgeangledetection|rmledges|rmInternalEdges|save|sigma|sizeofvolume|smoothing|solver|sparams|split|splitin2|splitpbedge|stop|strategy|swap|switch|sym|t|tgv|thetamax|tol|tolpivot|tolpivotsym|transfo|U2Vc|value|varrow|vector|veps|viso|wait|width|withsurfacemesh|WindowIndex|which|zbound"},"identifier"),n="\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|u{[0-9a-fA-F]{1,6}}|[0-2][0-7]{0,2}|3[0-7][0-7]?|[4-7][0-7]?|.)";this.$rules={no_regex:[r.getStartRule("doc-start"),l("no_regex"),{token:"string",regex:"'(?=.)",next:"qstring"},{token:"string",regex:'"(?=.)',next:"qqstring"},{token:"constant.numeric",regex:/0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/},{token:"constant.numeric",regex:/(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/},{token:["storage.type","punctuation.operator","support.function","punctuation.operator","entity.name.function","text","keyword.operator"],regex:"("+o+")(\\.)(prototype)(\\.)("+o+")(\\s*)(=)",next:"function_arguments"},{token:["storage.type","punctuation.operator","entity.name.function","text","keyword.operator","text","storage.type","text","paren.lparen"],regex:"("+o+")(\\.)("+o+")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",next:"function_arguments"},{token:["entity.name.function","text","keyword.operator","text","storage.type","text","paren.lparen"],regex:"("+o+")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",next:"function_arguments"},{token:["storage.type","punctuation.operator","entity.name.function","text","keyword.operator","text","storage.type","text","entity.name.function","text","paren.lparen"],regex:"("+o+")(\\.)("+o+")(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()",next:"function_arguments"},{token:["storage.type","text","entity.name.function","text","paren.lparen"],regex:"(function)(\\s+)("+o+")(\\s*)(\\()",next:"function_arguments"},{token:["entity.name.function","text","punctuation.operator","text","storage.type","text","paren.lparen"],regex:"("+o+")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",next:"function_arguments"},{token:["text","text","storage.type","text","paren.lparen"],regex:"(:)(\\s*)(function)(\\s*)(\\()",next:"function_arguments"},{token:"keyword",regex:"from(?=\\s*('|\"))"},{token:"keyword",regex:"(?:case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void)\\b",next:"start"},{token:["support.constant"],regex:/that\b/},{token:t,regex:o},{token:"punctuation.operator",regex:/[.](?![.])/,next:"property"},{token:"storage.type",regex:/=>/,next:"start"},{token:"keyword.operator",regex:/--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,next:"start"},{token:"punctuation.operator",regex:/[?:,;.]/,next:"start"},{token:"paren.lparen",regex:/[\[({]/,next:"start"},{token:"paren.rparen",regex:/[\])}]/},{token:"comment",regex:/^#!.*$/}],property:[{token:"text",regex:"\\s+"},{token:["storage.type","punctuation.operator","entity.name.function","text","keyword.operator","text","storage.type","text","entity.name.function","text","paren.lparen"],regex:"("+o+")(\\.)("+o+")(\\s*)(=)(\\s*)(function)(?:(\\s+)(\\w+))?(\\s*)(\\()",next:"function_arguments"},{token:"punctuation.operator",regex:/[.](?![.])/},{token:"identifier",regex:o},{regex:"",token:"empty",next:"no_regex"}],start:[r.getStartRule("doc-start"),l("start"),{token:"string.regexp",regex:"\\/",next:"regex"},{token:"text",regex:"\\s+|^$",next:"start"},{token:"empty",regex:"",next:"no_regex"}],regex:[{token:"regexp.keyword.operator",regex:"\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"},{token:"string.regexp",regex:"/[sxngimy]*",next:"no_regex"},{token:"invalid",regex:/\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/},{token:"constant.language.escape",regex:/\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/},{token:"constant.language.delimiter",regex:/\|/},{token:"constant.language.escape",regex:/\[\^?/,next:"regex_character_class"},{token:"empty",regex:"$",next:"no_regex"},{defaultToken:"string.regexp"}],regex_character_class:[{token:"regexp.charclass.keyword.operator",regex:"\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"},{token:"constant.language.escape",regex:"]",next:"regex"},{token:"constant.language.escape",regex:"-"},{token:"empty",regex:"$",next:"no_regex"},{defaultToken:"string.regexp.charachterclass"}],function_arguments:[{token:"variable.parameter",regex:o},{token:"punctuation.operator",regex:"[, ]+"},{token:"punctuation.operator",regex:"$"},{token:"empty",regex:"",next:"no_regex"}],qqstring:[{token:"constant.language.escape",regex:n},{token:"string",regex:"\\\\$",consumeLineEnd:!0},{token:"string",regex:'"|$',next:"no_regex"},{defaultToken:"string"}],qstring:[{token:"constant.language.escape",regex:n},{token:"string",regex:"\\\\$",consumeLineEnd:!0},{token:"string",regex:"'|$",next:"no_regex"},{defaultToken:"string"}]},this.embedRules(r,"doc-",[r.getEndRule("no_regex")]),this.normalizeRules()}}function l(e){return[{token:"comment",regex:/\/\*/,next:[r.getTagRule(),{token:"comment",regex:"\\*\\/",next:e||"pop"},{defaultToken:"comment",caseInsensitive:!0}]},{token:"comment",regex:"\\/\\/",next:[r.getTagRule(),{token:"comment",regex:"$|^",next:e||"pop"},{defaultToken:"comment",caseInsensitive:!0}]}]}s.inherits(i,a),t.FreefemHighlightRules=i}),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(e,t,n){let s=e("../range").Range,r=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){let n=e.getLine(t),r=n.match(/^(\s*\})/);if(!r)return 0;let a=r[1].length,o=e.findMatchingBracket({row:t,column:a});if(!o||o.row==t)return 0;let i=this.$getIndent(e.getLine(o.row));e.replace(new s(t,0,t,a-1),i)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(r.prototype),t.MatchingBraceOutdent=r}),ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(e,t,n){let s=e("../../lib/oop"),r=e("../../range").Range,a=e("./fold_mode").FoldMode,o=t.FoldMode=function(e){e&&(this.foldingStartMarker=RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};s.inherits(o,a),(function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){let s=e.getLine(n);if(this.singleLineBlockCommentRe.test(s)&&!this.startRegionRe.test(s)&&!this.tripleStarBlockCommentRe.test(s))return"";let r=this._getFoldWidgetBase(e,t,n);return!r&&this.startRegionRe.test(s)?"start":r},this.getFoldWidgetRange=function(e,t,n,s){let r=e.getLine(n);if(this.startRegionRe.test(r))return this.getCommentRegionBlock(e,r,n);let a=r.match(this.foldingStartMarker);if(a){let o=a.index;if(a[1])return this.openingBracketBlock(e,a[1],n,o);let i=e.getCommentFoldRange(n,o+a[0].length,1);return i&&!i.isMultiLine()&&(s?i=this.getSectionRange(e,n):"all"!=t&&(i=null)),i}if("markbegin"!==t&&(a=r.match(this.foldingStopMarker))){let l=a.index+a[0].length;return a[1]?this.closingBracketBlock(e,a[1],n,l):e.getCommentFoldRange(n,l,-1)}},this.getSectionRange=function(e,t){let n=e.getLine(t),s=n.search(/\S/),a=t,o=n.length,i=t+=1,l=e.getLength();for(;++t<l;){n=e.getLine(t);let g=n.search(/\S/);if(-1===g)continue;if(s>g)break;let c=this.getFoldWidgetRange(e,"all",t);if(c){if(c.start.row<=a)break;if(c.isMultiLine())t=c.end.row;else if(s==g)break}i=t}return new r(a,o,i,e.getLine(i).length)},this.getCommentRegionBlock=function(e,t,n){let s=t.search(/\s*$/),a=e.getLength(),o=n,i=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,l=1;for(;++n<a;){t=e.getLine(n);let g=i.exec(t);if(g&&(g[1]?l--:l++,!l))break}let c=n;if(c>o)return new r(o,s,c,t.length)}}).call(o.prototype)}),ace.define("ace/mode/javascript",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/javascript_highlight_rules","ace/mode/matching_brace_outdent","ace/worker/worker_client","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(e,t,n){let s=e("../lib/oop"),r=e("./text").Mode,a=e("./javascript_highlight_rules").JavaScriptHighlightRules,o=e("./matching_brace_outdent").MatchingBraceOutdent,i=e("../worker/worker_client").WorkerClient,l=e("./behaviour/cstyle").CstyleBehaviour,g=e("./folding/cstyle").FoldMode,c=function(){this.HighlightRules=a,this.$outdent=new o,this.$behaviour=new l,this.foldingRules=new g};s.inherits(c,r),(function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$quotes={'"':'"',"'":"'","`":"`"},this.getNextLineIndent=function(e,t,n){let s=this.$getIndent(t),r=this.getTokenizer().getLineTokens(t,e),a=r.tokens,o=r.state;if(a.length&&"comment"==a[a.length-1].type)return s;if("start"==e||"no_regex"==e){let i=t.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/);i&&(s+=n)}else if("doc-start"==e){if("start"==o||"no_regex"==o)return"";let l=t.match(/^\s*(\/?)\*/);l&&(l[1]&&(s+=" "),s+="* ")}return s},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.createWorker=function(e){let t=new i(["ace"],"ace/mode/javascript_worker","JavaScriptWorker");return t.attachToDocument(e.getDocument()),t.on("annotate",function(t){e.setAnnotations(t.data)}),t.on("terminate",function(){e.clearAnnotations()}),t},this.$id="ace/mode/javascript",this.snippetFileId="ace/snippets/javascript"}).call(c.prototype),t.Mode=c}),ace.define("ace/mode/freefem",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/freefem_highlight_rules","ace/mode/matching_brace_outdent","ace/worker/worker_client","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(e,t,n){let s=e("../lib/oop"),r=e("./text").Mode,a=e("./freefem_highlight_rules").FreefemHighlightRules,o=e("./matching_brace_outdent").MatchingBraceOutdent;e("../worker/worker_client").WorkerClient;let i=e("./behaviour/cstyle").CstyleBehaviour,l=e("./folding/cstyle").FoldMode;class g{constructor(){this.HighlightRules=a,this.$outdent=new o,this.$behaviour=new i,this.foldingRules=new l}}s.inherits(g,r),(function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.$quotes={'"':'"',"'":"'","`":"`"},this.getNextLineIndent=function(e,t,n){let s=this.$getIndent(t),r=this.getTokenizer().getLineTokens(t,e),a=r.tokens,o=r.state;if(a.length&&"comment"==a[a.length-1].type)return s;if("start"==e||"no_regex"==e){let i=t.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/);i&&(s+=n)}else if("doc-start"==e){if("start"==o||"no_regex"==o)return"";let l=t.match(/^\s*(\/?)\*/);l&&(l[1]&&(s+=" "),s+="* ")}return s},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/freefem",this.snippetFileId="ace/snippets/freefem"}).call(g.prototype),t.Mode=g}),ace.define("ace/mode/freefem-ejs",["require","exports","module","ace/lib/oop","ace/mode/freefem_highlight_rules","ace/mode/javascript_highlight_rules","ace/lib/oop","ace/mode/javascript","ace/mode/freefem"],function(e,t,n){let s=e("../lib/oop"),r=e("./javascript_highlight_rules").JavaScriptHighlightRules,a=e("./freefem_highlight_rules").FreefemHighlightRules,o=function(e,t){for(let n in a.call(this),e||(e="(?:<%|<\\?|{{)"),t||(t="(?:%>|\\?>|}})"),this.$rules)this.$rules[n].unshift({token:"markup.list.meta.tag",regex:e+"(?![>}])[-=]?",push:"ejs-start"});this.embedRules(new r({jsx:!1}).getRules(),"ejs-",[{token:"markup.list.meta.tag",regex:"-?"+t,next:"pop"},{token:"comment",regex:"//.*?"+t,next:"pop"}]),this.normalizeRules()};s.inherits(o,a),t.EjsHighlightRules=o;let i=e("./javascript").Mode,l=e("./freefem").Mode;class g{constructor(){l.call(this),this.HighlightRules=o,this.createModeDelegates({"js-":i,"ejs-":i})}}s.inherits(g,l),(function(){this.$id="ace/mode/ejs"}).call(g.prototype),t.Mode=g}),ace.require(["ace/mode/freefem-ejs"],function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)});var o=n(11409),i=n(55061);let l=()=>{let{template:e,dispatch:t}=(0,r.useContext)(o.rU),n=(0,r.useCallback)(e=>{t((0,i.zX)(e||""))},[t]),l=(0,r.useCallback)(e=>{t((0,i.KJ)({row:e.cursor.row,column:e.cursor.column}))},[t]);return(0,s.jsx)(a.ZP,{width:"100%",height:"calc(100% - 64px)",fontSize:16,theme:"sqlserver",mode:"freefem-ejs",name:"freefem_editor",value:e,editorProps:{$blockScrolling:!0,$showPrintMargin:!1},onCursorChange:l,onChange:n})};var g=l}}]);