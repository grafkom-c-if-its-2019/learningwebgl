precision mediump float;

attribute vec3 vPosition;
attribute vec3 vColor;
varying vec3 fColor;
uniform mat4 modelMatrix;

void main() {
  fColor = vColor;
  gl_Position = modelMatrix * vec4(vPosition, 1.0);
}
