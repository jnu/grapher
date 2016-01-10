/*!
 * Ayasdi Inc. 2015
 * Grapher.js may be freely distributed under the Apache 2.0 license.
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Grapher=e():t.Grapher=e()}(this,function(){return function(t){function e(n){if(i[n])return i[n].exports;var r=i[n]={exports:{},id:n,loaded:!1};return t[n].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){function n(){return this.initialize.apply(this,arguments),this}var r=n.WebGLRenderer=i(9),s=n.CanvasRenderer=i(8),o=n.Color=i(3),a=n.Link=i(4),h=n.Node=i(5),l=n.Shaders=i(6),u=n.utils=i(7),d=[34,34,34,255];n.prototype={},n.prototype.initialize=function(t){t||(t={}),this.props=u.extend({color:d,scale:1,translate:[0,0],resolution:window.devicePixelRatio||1},t),t.canvas||(this.props.canvas=document.createElement("canvas")),this.canvas=this.props.canvas;var e=this._getWebGL();e&&(this.props.webGL=e,this.props.canvas.addEventListener("webglcontextlost",function(t){this._onContextLost(t)}.bind(this)),this.props.canvas.addEventListener("webglcontextrestored",function(t){this._onContextRestored(t)}.bind(this)),this.props.linkShaders=new l(this.props.linkShaders),this.props.nodeShaders=new l(this.props.nodeShaders)),this.renderer=e?new r(this.props):new s(this.props),this.rendered=!1,this.links=[],this.nodes=[],this.renderer.setLinks(this.links),this.renderer.setNodes(this.nodes),this.willUpdate={},this.updateAll={},this._clearUpdateQueue(),this._updateLink=u.bind(this._updateLink,this),this._updateNode=u.bind(this._updateNode,this),this._updateLinkByIndex=u.bind(this._updateLinkByIndex,this),this._updateNodeByIndex=u.bind(this._updateNodeByIndex,this),this.animate=u.bind(this.animate,this),this.handlers={},u.eachKey(t,this.set,this)},n.prototype.set=function(t,e){var i=this[e];return i&&u.isFunction(i)?i.call(this,t):void 0},n.prototype.on=function(t,e){return this.handlers[t]=this.handlers[t]||[],this.handlers[t].push(e),this.canvas.addEventListener(t,e,!1),this},n.prototype.off=function(t,e){var i=u.bind(function(e){var i=u.indexOf(this.handlers[t],e);i>-1&&this.handlers[t].splice(i,1),this.canvas.removeEventListener(t,e,!1)},this);return e&&this.handlers[t]?i(e):u.isUndefined(e)&&this.handlers[t]&&u.each(this.handlers[t],i),this},n.prototype.data=function(t){return u.isUndefined(t)?this.props.data:(this.props.data=t,this.exit(),this.enter(),this.update(),this)},n.prototype.enter=function(){var t=this.data();if(this.links.length<t.links.length){var e=t.links.slice(this.links.length,t.links.length);u.eachPop(e,u.bind(function(){this.links.push(new a)},this))}if(this.nodes.length<t.nodes.length){var i=t.nodes.slice(this.nodes.length,t.nodes.length);u.eachPop(i,u.bind(function(){this.nodes.push(new h)},this))}return this},n.prototype.exit=function(){var t=this.data();return t.links.length<this.links.length&&this.links.splice(t.links.length,this.links.length-t.links.length),t.nodes.length<this.nodes.length&&this.nodes.splice(t.nodes.length,this.nodes.length-t.nodes.length),this},n.prototype.update=function(t,e,i){var n;return u.isArray(e)?n=e:u.isNumber(e)&&u.isNumber(i)&&(n=u.range(e,i)),u.isArray(n)?(this._addToUpdateQueue(t,n),t===p&&this._addToUpdateQueue(f,this._findLinks(n))):(t!==p&&(this.updateAll.links=!0),t!==f&&(this.updateAll.nodes=!0)),this},n.prototype.updateNode=function(t,e){return this._addToUpdateQueue(p,[t]),e&&this._addToUpdateQueue(f,this._findLinks([t])),this},n.prototype.updateLink=function(t){return this._addToUpdateQueue(f,[t]),this},n.prototype.clear=function(){return this.data({links:[],nodes:[]}),this.render(),this},n.prototype.render=function(){return this.rendered=!0,this._update(),this.renderer.render(),this},n.prototype.animate=function(){this.render(),this.currentFrame=requestAnimationFrame(this.animate)},n.prototype.play=function(){return this.currentFrame=requestAnimationFrame(this.animate),this},n.prototype.pause=function(){return this.currentFrame&&cancelAnimationFrame(this.currentFrame),this.currentFrame=null,this},n.prototype.resize=function(t,e){return this.renderer.resize(t,e),this},n.prototype.width=function(t){return u.isUndefined(t)?this.canvas.clientWidth:(this.resize(t,null),this)},n.prototype.height=function(t){return u.isUndefined(t)?this.canvas.clientHeight:(this.resize(null,t),this)},n.prototype.transform=function(t){return u.isUndefined(t)?{scale:this.props.scale,translate:this.props.translate}:(this.scale(t.scale),this.translate(t.translate),this)},n.prototype.scale=function(t){return u.isUndefined(t)?this.props.scale:(u.isNumber(t)&&(this.props.scale=t),this.updateTransform=!0,this)},n.prototype.translate=function(t){return u.isUndefined(t)?this.props.translate:(u.isArray(t)&&(this.props.translate=t),this.updateTransform=!0,this)},n.prototype.color=function(t){return u.isUndefined(t)?this.props.color:(this.props.color=t,this)},n.prototype.getDataPosition=function(t,e){var i=u.isUndefined(e)?t.x:t,n=u.isUndefined(e)?t.y:e;return t=this.renderer.untransformX(i),e=this.renderer.untransformY(n),{x:t,y:e}},n.prototype.getDisplayPosition=function(t,e){var i=u.isUndefined(e)?t.x:t,n=u.isUndefined(e)?t.y:e;return t=this.renderer.transformX(i),e=this.renderer.transformY(n),{x:t,y:e}},n.prototype._addToUpdateQueue=function(t,e){var i=t===p?this.willUpdate.nodes:this.willUpdate.links,n=t===p?this.updateAll.nodes:this.updateAll.links,r=t===p?this.nodes:this.links,s=function(t){u.uniqueInsert(i,t)};!n&&u.isArray(e)&&u.each(e,s,this),n=n||i.length>=r.length,t===p?this.updateAll.nodes=n:this.updateAll.links=n},n.prototype._clearUpdateQueue=function(){this.willUpdate.links=[],this.willUpdate.nodes=[],this.updateAll.links=!1,this.updateAll.nodes=!1,this.updateTransform=!1},n.prototype._update=function(){var t=this.willUpdate.links,e=this.willUpdate.nodes;this.updateAll.links?u.each(this.links,this._updateLink):t&&t.length&&u.eachPop(t,this._updateLinkByIndex),this.updateAll.nodes?u.each(this.nodes,this._updateNode):e&&e.length&&u.eachPop(e,this._updateNodeByIndex),this.updateTransform&&(this.renderer.setScale(this.props.scale),this.renderer.setTranslate(this.props.translate)),this._clearUpdateQueue()},n.prototype._updateLink=function(t,e){var i=this.data(),n=i.links[e],r=i.nodes[n.from],s=i.nodes[n.to],a=u.isUndefined(n.color)?o.interpolate(this._findColor(r.color),this._findColor(s.color)):this._findColor(n.color);t.update(r.x,r.y,s.x,s.y,a)},n.prototype._updateNode=function(t,e){var i=this.data().nodes[e];t.update(i.x,i.y,i.r,this._findColor(i.color))},n.prototype._updateNodeByIndex=function(t){this._updateNode(this.nodes[t],t)},n.prototype._updateLinkByIndex=function(t){this._updateLink(this.links[t],t)};var c=function(t,e){var i,n=t.length,r=!1;for(i=0;n>i;i++)if(e.to==t[i]||e.from==t[i]){r=!0;break}return r};n.prototype._findLinks=function(t){var e,i=this.data().links,n=i.length,r=[];for(e=0;n>e;e++)c(t,i[e])&&r.push(e);return r},n.prototype._findColor=function(t){return t||this.color()},n.prototype._getWebGL=function(){var t=null;try{t=this.canvas.getContext("webgl")||this.canvas.getContext("experimental-webgl")}catch(e){t=null}return t},n.prototype._onContextLost=function(t){t.preventDefault(),this.currentFrame&&cancelAnimationFrame(this.currentFrame)},n.prototype._onContextRestored=function(){var t=this._getWebGL();this.renderer.initGL(t),this.currentFrame?this.play():this.rendered&&this.render()};var p=n.NODES="nodes",f=n.LINKS="links";t.exports=n},function(t,e,i){(function(t){!function(){var e=function(){return!i&&this.init&&this.init.apply(this,arguments),this};e.prototype={init:function(t){this.canvas=t.canvas,this.lineWidth=t.lineWidth||2,this.resolution=t.resolution||1,this.scale=t.scale,this.translate=t.translate,this.resize()},setNodes:function(t){this.nodeObjects=t},setLinks:function(t){this.linkObjects=t},setScale:function(t){this.scale=t},setTranslate:function(t){this.translate=t},transformX:function(t){return t*this.scale+this.translate[0]},transformY:function(t){return t*this.scale+this.translate[1]},untransformX:function(t){return(t-this.translate[0])/this.scale},untransformY:function(t){return(t-this.translate[1])/this.scale},resize:function(t,e){var i=(t||this.canvas.clientWidth)*this.resolution,n=(e||this.canvas.clientHeight)*this.resolution;this.canvas.width!=i&&(this.canvas.width=i),this.canvas.height!=n&&(this.canvas.height=n)}};var i=!1;e.extend=function(t){function e(){!i&&this.init&&this.init.apply(this,arguments)}var n=this.prototype;i=!0;var r=new this;i=!1,r._super=this.prototype;for(var s in t)r[s]="function"==typeof t[s]&&"function"==typeof n[s]&&/\b_super\b/.test(t[s])?function(t,e){return function(){var i=this._super;this._super=n[t];var r=e.apply(this,arguments);return this._super=i,r}}(s,t[s]):t[s];return e.prototype=r,e.prototype.constructor=e,e.extend=arguments.callee,e},t&&t.exports&&(t.exports=e)}()}).call(e,i(2)(t))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e){function i(t,e,i){i=void 0===i?.5:i;var n=t.map(function(t,n){var r=e[n];return t+(r-t)*i});return n}t.exports={interpolate:i}},function(t,e){function i(){return this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.color=null,this}i.prototype.update=function(t,e,i,n,r){return this.x1=t,this.y1=e,this.x2=i,this.y2=n,this.color=r,this},t.exports=i},function(t,e){function i(){return this.x=0,this.y=0,this.r=10,this.color=null,this}i.prototype.update=function(t,e,i,n){return this.x=t,this.y=e,this.r=i,this.color=n,this},t.exports=i},function(t,e,i){(function(t){!function(){function e(t){return this.vertexCode=t&&t.vertexCode||null,this.fragmentCode=t&&t.fragmentCode||null,this}e.prototype.addVertexAttr=function(t,e,i,n,r){var s={name:t,value:e,size:i,type:n,normalized:r};this.vertexAttrs.push(s)},e.prototype.addUniformAttr=function(t,e){var i={name:t,value:e};this.uniformAttrs.push(i)},t&&t.exports&&(t.exports=e)}()}).call(e,i(2)(t))},function(t,e){function i(){}function n(t,e,i){e=p(e,i);for(var n=t.length;--n>-1;)e(t[n],n);return t}function r(t,e,i){for(e=p(e,i);t.length;)e(t.pop());return t}function s(t,e,i){if(e=p(e,i),v(t))for(var n=Object.keys(t);n.length;){var r=n.pop();e(t[r],r)}return t}function o(t,e,i){e=p(e,i);for(var n=t.length,r=new Array(n);--n>-1;)r[n]=e(t[n],n);return r}function a(t){return r(t,i),t}function h(t,e,i){i=y(i)?i:1,f(e)&&(e=t,t=0);for(var n=Math.max(Math.ceil((e-t)/i),0),r=new Array(n);--n>-1;)r[n]=t+i*n;return r}function l(t,e){for(var i=0,n=t.length;n>i;){var r=i+n>>>1;e<t[r]?n=r:i=r+1}return i}function u(t,e){for(var i=t.length;--i>-1;)if(t[i]===e)return i;return i}function d(t,e){return-1===u(t,e)&&t.push(e),t}function c(t,e){if(v(t)&&v(e))for(var i=Object.getOwnPropertyNames(e),n=i.length;--n>-1;){var r=i[n];t[r]=e[r]}return t}function p(t,e){return e?function(){return t.apply(e,arguments)}:t}function f(t){return"undefined"==typeof t}function g(t){return"function"==typeof t}function v(t){return"object"==typeof t&&!!t}function y(t){return"number"==typeof t}function _(t){return y(t)&&t!==+t}t.exports={each:n,eachPop:r,eachKey:s,map:o,clean:a,range:h,sortedIndex:l,indexOf:u,uniqueInsert:d,extend:c,bind:p,noop:i,isUndefined:f,isFunction:g,isObject:v,isArray:Array.isArray,isNumber:y,isNaN:_}},function(t,e,i){var n=i(1),r=n.extend({init:function(t){this._super(t),this.context=this.canvas.getContext("2d")},render:function(){this.resize(),this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.renderLinks(),this.renderNodes()},renderNodes:function(){for(var t=0;t<this.nodeObjects.length;t++){var e=this.nodeObjects[t],i=this.transformX(e.x)*this.resolution,n=this.transformY(e.y)*this.resolution,r=e.r*Math.abs(this.scale*this.resolution);this.context.beginPath(),this.context.arc(i,n,r,0,2*Math.PI,!1),this.context.fillStyle="rgba("+e.color.join(",")+")",this.context.fill()}},renderLinks:function(){for(var t=0;t<this.linkObjects.length;t++){var e=this.linkObjects[t],i=this.transformX(e.x1)*this.resolution,n=this.transformY(e.y1)*this.resolution,r=this.transformX(e.x2)*this.resolution,s=this.transformY(e.y2)*this.resolution;this.context.beginPath(),this.context.moveTo(i,n),this.context.lineTo(r,s),this.context.lineWidth=this.lineWidth*Math.abs(this.scale*this.resolution),this.context.strokeStyle="rgba("+e.color.join(",")+")",this.context.stroke()}}});t.exports=r},function(t,e,i){var n=i(11),r=i(10),s=i(13),o=i(12),a=i(1),h=Math.sqrt(2),l=a.extend({init:function(t){this.gl=t.webGL,this.linkVertexShader=t.linkShaders&&t.linkShaders.vertexCode||n,this.linkFragmentShader=t.linkShaders&&t.linkShaders.fragmentCode||r,this.nodeVertexShader=t.nodeShaders&&t.nodeShaders.vertexCode||s,this.nodeFragmentShader=t.nodeShaders&&t.nodeShaders.fragmentCode||o,this._super(t),this.initGL(),this.NODE_ATTRIBUTES=9,this.LINK_ATTRIBUTES=6},initGL:function(t){t&&(this.gl=t),this.linksProgram=this.initShaders(this.linkVertexShader,this.linkFragmentShader),this.nodesProgram=this.initShaders(this.nodeVertexShader,this.nodeFragmentShader),this.gl.linkProgram(this.linksProgram),this.gl.linkProgram(this.nodesProgram),this.gl.blendFuncSeparate(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA,this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA),this.gl.enable(this.gl.BLEND)},initShaders:function(t,e){var i=this.getShaders(this.gl.VERTEX_SHADER,t),n=this.getShaders(this.gl.FRAGMENT_SHADER,e),r=this.gl.createProgram();return this.gl.attachShader(r,i),this.gl.attachShader(r,n),r},getShaders:function(t,e){var i=this.gl.createShader(t);return this.gl.shaderSource(i,e),this.gl.compileShader(i),i},updateNodesBuffer:function(){for(var t=0,e=this.nodeObjects,i=e.length,n=this.resolution,r=Math.abs(this.scale*n),s=this.nodes=new Float32Array(27*i),o=0;i>o;o++){var a=e[o],l=this.transformX(a.x)*n,u=this.transformY(a.y)*n,d=a.r*r+1,c=d+10;s[t++]=l-c,s[t++]=u-c,s[t++]=a.color[0],s[t++]=a.color[1],s[t++]=a.color[2],s[t++]=a.color[3],s[t++]=l,s[t++]=u,s[t++]=d,s[t++]=l+(1+h)*c,s[t++]=u-c,s[t++]=a.color[0],s[t++]=a.color[1],s[t++]=a.color[2],s[t++]=a.color[3],s[t++]=l,s[t++]=u,s[t++]=d,s[t++]=l-c,s[t++]=u+(1+h)*c,s[t++]=a.color[0],s[t++]=a.color[1],s[t++]=a.color[2],s[t++]=a.color[3],s[t++]=l,s[t++]=u,s[t++]=d}},updateLinksBuffer:function(){for(var t=0,e=this.linkObjects,i=e.length,n=this.links=new Float32Array(12*i),r=this.resolution*this.translate[0],s=this.resolution*this.translate[1],o=this.resolution*this.scale,a=0;i>a;a++){var h=e[a],l=h.x1*o+r,u=h.y1*o+s,d=h.x2*o+r,c=h.y2*o+s;n[t++]=l,n[t++]=u,n[t++]=h.color[0],n[t++]=h.color[1],n[t++]=h.color[2],n[t++]=h.color[3],n[t++]=d,n[t++]=c,n[t++]=h.color[0],n[t++]=h.color[1],n[t++]=h.color[2],n[t++]=h.color[3]}},resize:function(t,e){this._super(t,e),this.gl.viewport(0,0,this.gl.drawingBufferWidth,this.gl.drawingBufferHeight)},render:function(){this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.resize(),this.updateNodesBuffer(),this.updateLinksBuffer(),this.renderLinks(),this.renderNodes()},renderLinks:function(){var t=this.linksProgram;this.gl.useProgram(t);var e=this.links,i=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,i),this.gl.bufferData(this.gl.ARRAY_BUFFER,e,this.gl.STATIC_DRAW);var n=this.gl.getUniformLocation(t,"u_resolution");this.gl.uniform2f(n,this.canvas.width,this.canvas.height);var r=this.gl.getAttribLocation(t,"a_position"),s=this.gl.getAttribLocation(t,"a_rgba");this.gl.enableVertexAttribArray(r),this.gl.enableVertexAttribArray(s),this.gl.vertexAttribPointer(r,2,this.gl.FLOAT,!1,this.LINK_ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),this.gl.vertexAttribPointer(s,4,this.gl.FLOAT,!1,this.LINK_ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8);var o=this.gl.getParameter(this.gl.ALIASED_LINE_WIDTH_RANGE),a=this.lineWidth*Math.abs(this.scale*this.resolution),h=Math.min(Math.max(a,o[0]),o[1]);this.gl.lineWidth(h),this.gl.drawArrays(this.gl.LINES,0,this.links.length/this.LINK_ATTRIBUTES)},renderNodes:function(){var t=this.nodesProgram;this.gl.useProgram(t);var e=this.nodes,i=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,i),this.gl.bufferData(this.gl.ARRAY_BUFFER,e,this.gl.STATIC_DRAW);var n=this.gl.getUniformLocation(t,"u_resolution");this.gl.uniform2f(n,this.canvas.width,this.canvas.height);var r=this.gl.getAttribLocation(t,"a_position"),s=this.gl.getAttribLocation(t,"a_rgba"),o=this.gl.getAttribLocation(t,"a_center"),a=this.gl.getAttribLocation(t,"a_radius");this.gl.enableVertexAttribArray(r),this.gl.enableVertexAttribArray(s),this.gl.enableVertexAttribArray(o),this.gl.enableVertexAttribArray(a),this.gl.vertexAttribPointer(r,2,this.gl.FLOAT,!1,this.NODE_ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,0),this.gl.vertexAttribPointer(s,4,this.gl.FLOAT,!1,this.NODE_ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,8),this.gl.vertexAttribPointer(o,2,this.gl.FLOAT,!1,this.NODE_ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,24),this.gl.vertexAttribPointer(a,1,this.gl.FLOAT,!1,this.NODE_ATTRIBUTES*Float32Array.BYTES_PER_ELEMENT,32),this.gl.drawArrays(this.gl.TRIANGLES,0,this.nodes.length/this.NODE_ATTRIBUTES)}});t.exports=l},function(t,e){t.exports=" 	  precision mediump float; 	  varying vec4 rgba; 	  void main() { 	    gl_FragColor = rgba; 	  }"},function(t,e){t.exports=" 	  uniform vec2 u_resolution; 	  attribute vec2 a_position; 	  attribute vec4 a_rgba; 	  varying vec4 rgba; 	  void main() { 	    vec2 clipspace = a_position / u_resolution * 2.0 - 1.0; 	    gl_Position = vec4(clipspace * vec2(1, -1), 0, 1); 	    rgba = a_rgba / 255.0; 	  }"},function(t,e){t.exports=" 	  precision mediump float; 	  varying vec4 rgba; 	  varying vec2 center; 	  varying vec2 resolution; 	  varying float radius; 	  void main() { 	    vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0); 	    float x = gl_FragCoord.x; 	    float y = resolution[1] - gl_FragCoord.y; 	    float dx = center[0] - x; 	    float dy = center[1] - y; 	    float distance = sqrt(dx * dx + dy * dy); 	    float diff = distance - radius; 	    if ( diff < 0.0 ) 	      gl_FragColor = rgba; 	    else if ( diff >= 0.0 && diff <= 1.0 ) 	      gl_FragColor = vec4(rgba.r, rgba.g, rgba.b, rgba.a - diff); 	    else  	      gl_FragColor = color0; 	  }"},function(t,e){t.exports=" 	  uniform vec2 u_resolution; 	  attribute vec2 a_position; 	  attribute vec4 a_rgba; 	  attribute vec2 a_center; 	  attribute float a_radius; 	  varying vec4 rgba; 	  varying vec2 center; 	  varying vec2 resolution; 	  varying float radius; 	  void main() { 	    vec2 clipspace = a_position / u_resolution * 2.0 - 1.0; 	    gl_Position = vec4(clipspace * vec2(1, -1), 0, 1); 	    rgba = a_rgba / 255.0; 	    radius = a_radius; 	    center = a_center; 	    resolution = u_resolution; 	  }"}])});