import * as THREE from 'three'

import vertexAtmosphere from '../shaders/earth/atmosphere/vertex.glsl?raw'
import fragmentAtmosphere from '../shaders/earth/atmosphere/fragment.glsl?raw'

interface AtmosphereProps {
  radius: number
  color?: THREE.ColorRepresentation
}

const Atmosphere: React.FC<AtmosphereProps> = ({
  radius,
  color = '#E0D6FF',
}) => {
  return (
    <>
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[radius + 1.5, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexAtmosphere}
          fragmentShader={fragmentAtmosphere}
          uniforms={{
            atmosphereColor: { value: new THREE.Color(color) },
          }}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide} // atmosphere is rendered inside-out
          transparent
        />
      </mesh>
    </>
  )
}

export default Atmosphere
