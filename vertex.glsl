precision mediump float;

attribute vec2 vPosition;
attribute vec3 vColor;
varying vec3 fColor;
uniform vec3 translation;

void main() {
  fColor = vColor;
  mat4 translate = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    translation , 1.0
  );
  gl_Position = translate * vec4(vPosition, 0.0, 1.0);
}
