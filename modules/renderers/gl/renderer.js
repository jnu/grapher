var LinkVertexShaderSource = require('./shaders/link.vert.js'),
    LinkFragmentShaderSource = require('./shaders/link.frag.js'),
    NodeVertexShaderSource = require('./shaders/node.vert.js'),
    NodeFragmentShaderSource = require('./shaders/node.frag.js'),
    Renderer = require('../renderer.js');

var SQRT_2 = Math.sqrt(2);

var WebGLRenderer = Renderer.extend({
  init: function (o) {
    this.gl = o.webGL;

    this.linkVertexShader = o.linkShaders && o.linkShaders.vertexCode || LinkVertexShaderSource;
    this.linkFragmentShader = o.linkShaders && o.linkShaders.fragmentCode || LinkFragmentShaderSource;
    this.nodeVertexShader = o.nodeShaders && o.nodeShaders.vertexCode ||  NodeVertexShaderSource;
    this.nodeFragmentShader = o.nodeShaders && o.nodeShaders.fragmentCode || NodeFragmentShaderSource;


    this._super(o);
    this.initGL();

    this.NODE_ATTRIBUTES = 9;
    this.LINK_ATTRIBUTES = 6;
  },

  initGL: function (gl) {
    if (gl) this.gl = gl;

    this.linksProgram = this.initShaders(this.linkVertexShader, this.linkFragmentShader);
    this.nodesProgram = this.initShaders(this.nodeVertexShader, this.nodeFragmentShader);

    this.gl.linkProgram(this.linksProgram);
    this.gl.linkProgram(this.nodesProgram);

    this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);
  },

  initShaders: function (vertexShaderSource, fragmentShaderSource) {
    var vertexShader = this.getShaders(this.gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = this.getShaders(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    var shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    return shaderProgram;
  },

  getShaders: function (type, source) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    return shader;
  },

  updateNodesBuffer: function () {
    var j = 0;
    var nodeObjects = this.nodeObjects;
    var n = nodeObjects.length;
    var resolution = this.resolution;
    var rScale = Math.abs(this.scale * resolution);
    var nodes = this.nodes = new Float32Array(27 * n);

    for (var i = 0; i < n; i++) {
      var node = nodeObjects[i];
      var cx = this.transformX(node.x) * resolution;
      var cy = this.transformY(node.y) * resolution;
      var r = node.r * rScale + 1;
      // adding few px to keep shader area big enough for antialiasing pixesls
      var shaderSize = r + 10;

      nodes[j++] = (cx - shaderSize);
      nodes[j++] = (cy - shaderSize);
      nodes[j++] = node.color[0];
      nodes[j++] = node.color[1];
      nodes[j++] = node.color[2];
      nodes[j++] = node.color[3];
      nodes[j++] = cx;
      nodes[j++] = cy;
      nodes[j++] = r;

      nodes[j++] = (cx + (1 + SQRT_2) * shaderSize);
      nodes[j++] = cy - shaderSize;
      nodes[j++] = node.color[0];
      nodes[j++] = node.color[1];
      nodes[j++] = node.color[2];
      nodes[j++] = node.color[3];
      nodes[j++] = cx;
      nodes[j++] = cy;
      nodes[j++] = r;

      nodes[j++] = (cx - shaderSize);
      nodes[j++] = (cy + (1 + SQRT_2) * shaderSize);
      nodes[j++] = node.color[0];
      nodes[j++] = node.color[1];
      nodes[j++] = node.color[2];
      nodes[j++] = node.color[3];
      nodes[j++] = cx;
      nodes[j++] = cy;
      nodes[j++] = r;
    }
  },

  updateLinksBuffer: function () {
    var j = 0;
    var linkObjects = this.linkObjects;
    var n = linkObjects.length;
    var links = this.links = new Float32Array(12 * n);

    // transformX:
    // (x * this.scale + this.translate[0]) * this.resolution
    //
    // transformY:
    // (y * this.scale + this.translate[1]) * this.resolution
    var xTranslation = this.resolution * this.translate[0];
    var yTranslation = this.resolution * this.translate[1];
    var scale = this.resolution * this.scale;

    for (var i = 0; i < n; i++) {
      var link = linkObjects[i];
      var x1 = link.x1 * scale + xTranslation;
      var y1 = link.y1 * scale + yTranslation;
      var x2 = link.x2 * scale + xTranslation;
      var y2 = link.y2 * scale + yTranslation;

      links[j++] = x1;
      links[j++] = y1;
      links[j++] = link.color[0];
      links[j++] = link.color[1];
      links[j++] = link.color[2];
      links[j++] = link.color[3];

      links[j++] = x2;
      links[j++] = y2;
      links[j++] = link.color[0];
      links[j++] = link.color[1];
      links[j++] = link.color[2];
      links[j++] = link.color[3];
    }
  },

  resize: function (width, height) {
    this._super(width, height);
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
  },

  render: function () {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.resize();
    this.updateNodesBuffer();
    this.updateLinksBuffer();
    this.renderLinks(); // links have to be rendered first because of blending;
    this.renderNodes();
  },

  renderLinks: function () {
    var program = this.linksProgram;
    this.gl.useProgram(program);

    var linksBuffer = this.links;
    var buffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, linksBuffer, this.gl.STATIC_DRAW);

    var resolutionLocation = this.gl.getUniformLocation(program, 'u_resolution');
    this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);

    var positionLocation = this.gl.getAttribLocation(program, 'a_position');
    var rgbaLocation = this.gl.getAttribLocation(program, 'a_rgba');

    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.enableVertexAttribArray(rgbaLocation);

    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, this.LINK_ATTRIBUTES  * Float32Array.BYTES_PER_ELEMENT, 0);
    this.gl.vertexAttribPointer(rgbaLocation, 4, this.gl.FLOAT, false, this.LINK_ATTRIBUTES  * Float32Array.BYTES_PER_ELEMENT, 8);

    var lineWidthRange = this.gl.getParameter(this.gl.ALIASED_LINE_WIDTH_RANGE), // ex [1,10]
        lineWidth = this.lineWidth * Math.abs(this.scale * this.resolution),
        lineWidthInRange = Math.min(Math.max(lineWidth, lineWidthRange[0]), lineWidthRange[1]);

    this.gl.lineWidth(lineWidthInRange);
    this.gl.drawArrays(this.gl.LINES, 0, this.links.length/this.LINK_ATTRIBUTES);
  },

  renderNodes: function () {
    var program = this.nodesProgram;
    this.gl.useProgram(program);

    var nodesBuffer = this.nodes;
    var buffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, nodesBuffer, this.gl.STATIC_DRAW);

    var resolutionLocation = this.gl.getUniformLocation(program, 'u_resolution');
    this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);

    var positionLocation = this.gl.getAttribLocation(program, 'a_position');
    var rgbaLocation = this.gl.getAttribLocation(program, 'a_rgba');
    var centerLocation = this.gl.getAttribLocation(program, 'a_center');
    var radiusLocation = this.gl.getAttribLocation(program, 'a_radius');

    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.enableVertexAttribArray(rgbaLocation);
    this.gl.enableVertexAttribArray(centerLocation);
    this.gl.enableVertexAttribArray(radiusLocation);

    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, this.NODE_ATTRIBUTES  * Float32Array.BYTES_PER_ELEMENT, 0);
    this.gl.vertexAttribPointer(rgbaLocation, 4, this.gl.FLOAT, false, this.NODE_ATTRIBUTES  * Float32Array.BYTES_PER_ELEMENT, 8);
    this.gl.vertexAttribPointer(centerLocation, 2, this.gl.FLOAT, false, this.NODE_ATTRIBUTES  * Float32Array.BYTES_PER_ELEMENT, 24);
    this.gl.vertexAttribPointer(radiusLocation, 1, this.gl.FLOAT, false, this.NODE_ATTRIBUTES  * Float32Array.BYTES_PER_ELEMENT, 32);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.nodes.length / this.NODE_ATTRIBUTES);
  }
});

module.exports = WebGLRenderer;
