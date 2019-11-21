precision mediump float;

attribute vec3 vPosition;
attribute vec2 vTexCoord; // Koordinat tekstur, dimensi vektor: 1 x 2 (u, v)
attribute vec3 vNormal;

varying vec2 fTexCoord;
varying vec3 fPosition;
varying vec3 fNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;

uniform mat3 normalMatrix;  // Membantu transformasi vektor normal

void main() {
  gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);

  // Transfer koordinat tekstur ke fragment shader
  fTexCoord = vTexCoord;

  // Transfer nilai vektor normal ke fragment shader
  fNormal = normalize(normalMatrix * vNormal);

  // Transfer nilai posisi verteks ke fragment shader
  fPosition = vec3(modelMatrix * vec4(vPosition, 1.0));
}
