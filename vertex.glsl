precision mediump float;

attribute vec3 vPosition;
attribute vec3 vColor;
varying vec3 fColor;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;

void main() {
  fColor = vColor;
  gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
}
