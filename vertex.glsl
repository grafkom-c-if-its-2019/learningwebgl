precision mediump float;

attribute vec3 vPosition;
attribute vec3 vColor;
attribute vec3 vNormal;
varying vec3 fColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;

uniform vec3 lightColor;
uniform vec3 lightDirection;
uniform mat3 normalMatrix;  // Membantu transformasi vektor normal
uniform vec3 ambientColor;

void main() {
  gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);

  vec3 normal = normalize(normalMatrix * vNormal); // Supaya jadi unit vector
  
  // Perkalian titik (dot product) antara vektor arah datang cahaya dengan orientasi permukaan (vektor normal)
  float lightIntensity = max(dot(lightDirection, normal), 0.0); 

  // Menghitung nilai diffuse dari interaksi cahaya dan material
  vec3 diffuse = lightColor * vColor * lightIntensity;

  // Menghitung nilai ambient dari verteks
  vec3 ambient = ambientColor * vColor;

  fColor = diffuse + ambient;
}
