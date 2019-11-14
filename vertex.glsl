precision mediump float;

attribute vec3 vPosition;
attribute vec3 vColor;
attribute vec3 vNormal;

varying vec3 fColor;
varying vec3 fPosition;
varying vec3 fNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;

uniform mat3 normalMatrix;  // Membantu transformasi vektor normal

void main() {
  gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);

  // Transfer nilai warna ke fragment shader
  fColor = vColor;

  // Transfer nilai vektor normal ke fragment shader
  fNormal = normalize(normalMatrix * vNormal);

  // Transfer nilai posisi verteks ke fragment shader
  fPosition = vec3(modelMatrix * vec4(vPosition, 1.0));
}
