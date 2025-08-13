import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import vertexBackground from "../shaders/earth/background/vertex.glsl?raw";
import fragmentBackground from "../shaders/earth/background/fragment.glsl?raw";

export default function EarthBackground() {
  const { size, gl } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  // Uniforms
  const uniforms = useMemo(() => ({
    u_resolution: { value: new THREE.Vector2(size.width, size.height) },
    u_time: { value: 0 },
  }), []);

  // Update resolution on resize
  useEffect(() => {
    uniforms.u_resolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  // Separate scene and camera
  const bgScene = useMemo(() => new THREE.Scene(), []);
  const bgCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  // Create background mesh once
  useMemo(() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: vertexBackground,
        fragmentShader: fragmentBackground,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      })
    );
    meshRef.current = mesh;
    bgScene.add(mesh);
  }, [bgScene, uniforms]);

  // Render every frame
  useFrame(({ clock, scene, camera }) => {
    uniforms.u_time.value = clock.elapsedTime;

    gl.autoClear = false;
    gl.clear();
    gl.render(bgScene, bgCamera);  // background first
    gl.render(scene, camera);      // main scene on top
  }, 1);

  return null;
}
