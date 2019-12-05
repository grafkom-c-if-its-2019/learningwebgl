(function() {

  glUtils.SL.init({ callback: function() { main(); } });

  function main() {
    
    var canvas = document.getElementById("glcanvas");
    var gl = glUtils.checkWebGL(canvas);

    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    var cubeVertices = [];

    // Posisi 8 titik kubus
    var cubePoints = [
      [ -0.5, -0.5,  0.5 ],
      [ -0.5,  0.5,  0.5 ],
      [  0.5,  0.5,  0.5 ],
      [  0.5, -0.5,  0.5 ],
      [ -0.5, -0.5, -0.5 ],
      [ -0.5,  0.5, -0.5 ],
      [  0.5,  0.5, -0.5 ],
      [  0.5, -0.5, -0.5 ]
    ];
    var cubeColors = [
      [],
      [ 1.0, 0.0, 0.0 ], // merah
      [ 1.0, 1.0, 0.0 ], // kuning
      [ 0.0, 1.0, 0.0 ], // hijau
      [ 0.0, 0.0, 1.0 ], // biru
      [ 1.0, 1.0, 1.0 ], // putih
      [ 1.0, 0.5, 0.0 ], // orange
      []
    ];
    var cubeNormals = [
      [],
      [ 0.0,  0.0,  1.0], // depan
      [ 1.0,  0.0,  0.0], // kanan
      [ 0.0, -1.0,  0.0], // bawah
      [ 0.0,  0.0, -1.0], // belakang
      [-1.0,  0.0,  0.0], // kiri
      [ 0.0,  1.0,  0.0], // atas
      []
    ];
    var cubeTexCoords = [
      // u, v
      [ 0.0,  0.0],   // kiri bawah
      [ 0.0,  1.0],   // kiri atas
      [ 1.0,  1.0],   // kanan atas
      [ 1.0,  0.0],   // kanan bawah
    ];

    function quad(a, b, c, d) {
      var indices = [a, b, c, a, c, d];
      for (var i = 0; i < indices.length; i++) {
        for (var j = 0; j < 3; j++) {
          cubeVertices.push(cubePoints[indices[i]][j]);
        }
        for (var j = 0; j < 3; j++) {
          cubeVertices.push(cubeColors[a][j]);
        }
        for (var j = 0; j < 3; j++) {
          cubeVertices.push(cubeNormals[a][j]);
        }
        for (var j = 0; j < 2; j++) {
          switch (indices[i]) {
            case a:
              cubeVertices.push(cubeTexCoords[0][j]);
              break;
            case b:
              cubeVertices.push(cubeTexCoords[1][j]);
              break;
            case c:
              cubeVertices.push(cubeTexCoords[2][j]);
              break;
            case d:
              cubeVertices.push(cubeTexCoords[3][j]);
              break;
          
            default:
              break;
          }
        }
      }
    }
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 5, 1, 2);

    // Link antara CPU Memory dengan GPU Memory
    var cubeVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

    // Link untuk attribute
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    // var vColor = gl.getAttribLocation(program, 'vColor');
    var vNormal = gl.getAttribLocation(program, 'vNormal');
    var vTexCoord = gl.getAttribLocation(program, 'vTexCoord');
    gl.vertexAttribPointer(
      vPosition,  // variabel yang memegang posisi attribute di shader
      3,          // jumlah elemen per atribut
      gl.FLOAT,   // tipe data atribut
      false, 
      11 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex 
      0                                   // offset dari posisi elemen di array
    );
    // gl.vertexAttribPointer(
    //   vColor,
    //   3,
    //   gl.FLOAT,
    //   false,
    //   11 * Float32Array.BYTES_PER_ELEMENT,
    //   3 * Float32Array.BYTES_PER_ELEMENT
    // );
    gl.vertexAttribPointer(
      vNormal,
      3,
      gl.FLOAT,
      false,
      11 * Float32Array.BYTES_PER_ELEMENT,
      6 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.vertexAttribPointer(
      vTexCoord,
      2,
      gl.FLOAT,
      false,
      11 * Float32Array.BYTES_PER_ELEMENT,
      9 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(vPosition);
    // gl.enableVertexAttribArray(vColor);
    gl.enableVertexAttribArray(vNormal);
    gl.enableVertexAttribArray(vTexCoord);

    // Definisi transformasi pada model
    var mmLoc = gl.getUniformLocation(program, 'modelMatrix');
    var theta = [ 0.0, 0.0, 0.0 ];
    var xAxis = 0, yAxis = 1, zAxis = 2;
    var thetaSpeed = 0.0;

    // Interaksi dengan keyboard
    function onKeyDown(event) {
      if (event.keyCode == 189) thetaSpeed -= 0.005;      // tombol '-'
      else if (event.keyCode == 187) thetaSpeed += 0.005; // tombol '='
      else if (event.keyCode == 48) thetaSpeed = 0;       // tombol '0'
    }
    document.addEventListener('keydown', onKeyDown);

    // Interaksi dengan mouse
    var lastx, lasty, dragging;
    function onMouseDown(event) { // Ketika tombol klik kiri ditekan
      var x = event.clientX;
      var y = event.clientY;
      var rect = event.target.getBoundingClientRect();
      if (
        rect.left <= x &&
        rect.right > x &&
        rect.top <= y &&
        rect.bottom > y
      ) {
        lastx = x;
        lasty = y;
        dragging = true;
      }
    }
    function onMouseUp(event) {   // Ketika tombol klik kiri dilepas
      dragging = false;
    }
    function onMouseMove(event) { // Ketika mouse bergerak
      var x = event.clientX;
      var y = event.clientY;
      if (dragging) {
        var factor = 10 / canvas.height;
        var dx = factor * (x - lastx);  // Perubahan posisi mouse secara horizontal
        var dy = factor * (y - lasty);  // Perubahan posisi mouse secara vertikal
        theta[xAxis] += dy;
        theta[yAxis] += dx;
      }
      lastx = x;
      lasty = y;
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    // Definisi matriks pandangan (view matrix)
    var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
    var vm = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(vm,
      glMatrix.mat3.fromValues(0.0, 0.0,  0.0), // eye: posisi kamera
      glMatrix.mat3.fromValues(0.0, 0.0, -2.0), // at: posisi kamera menghadap
      glMatrix.mat3.fromValues(0.0, 1.0,  0.0)  // up: posisi arah atas kamera
    );
    gl.uniformMatrix4fv(vmLoc, false, vm);

    // Definisi matriks proyeksi perspektif
    var pmLoc = gl.getUniformLocation(program, 'perspectiveMatrix');
    var pm = glMatrix.mat4.create();
    glMatrix.mat4.perspective(pm,
      glMatrix.glMatrix.toRadian(90), // fovy dalam radian
      canvas.width / canvas.height,
      1.0,  // near
      10.0  // far
    );
    gl.uniformMatrix4fv(pmLoc, false, pm);

    // Definisi cahaya
    var lightColorLoc = gl.getUniformLocation(program, 'lightColor');
    var lightPositionLoc = gl.getUniformLocation(program, 'lightPosition');
    var lightColor = [1.0, 1.0, 1.0]; // Cahaya warna putih
    var lightPosition = glMatrix.vec3.fromValues(0.5, 4.0, 3.0);
    gl.uniform3fv(lightColorLoc, lightColor);
    gl.uniform3fv(lightPositionLoc, lightPosition);
    var ambientColorLoc = gl.getUniformLocation(program, 'ambientColor');
    gl.uniform3fv(ambientColorLoc, glMatrix.vec3.fromValues(0.5, 0.5, 0.5));

    var nmLoc = gl.getUniformLocation(program, 'normalMatrix');

    function render() {
      // Bersihkan buffernya canvas
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      theta[xAxis] += thetaSpeed;
      theta[yAxis] += thetaSpeed;
      theta[zAxis] += thetaSpeed;
      var mm = glMatrix.mat4.create();
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
      glMatrix.mat4.rotateZ(mm, mm, theta[zAxis]);
      glMatrix.mat4.rotateY(mm, mm, theta[yAxis]);
      glMatrix.mat4.rotateX(mm, mm, theta[xAxis]);
      gl.uniformMatrix4fv(mmLoc, false, mm);

      // ModelMatrix kita perbantukan untuk membuat 
      //  matriks transformasi vektor normal
      var nm = glMatrix.mat3.normalFromMat4(glMatrix.mat3.create(), mm);
      gl.uniformMatrix3fv(nmLoc, false, nm);
  
      gl.drawArrays(gl.TRIANGLES, 0, 36);
      requestAnimationFrame(render);
    }

    // Bersihkan layar jadi hitam
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    gl.activeTexture(gl.TEXTURE0);
    var sampler0Loc = gl.getUniformLocation(program, 'sampler0');
    gl.uniform1i(sampler0Loc, 0);
    
    // Asynchronously load an image
    var image = new Image();
    image.src = "images/txStainglass.bmp";
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    });

    render();
  }
})();
