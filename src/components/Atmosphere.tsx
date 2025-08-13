import * as THREE from 'three'

import vertexAtmosphere from '../shaders/earth/atmosphere/vertex.glsl?raw'
import fragmentAtmosphere from '../shaders/earth/atmosphere/fragment.glsl?raw'

interface AtmosphereProps {
  radius: number
  uColor?: string
  uThickness?: number
}

const Atmosphere: React.FC<AtmosphereProps> = ({
  radius
}) => {
  return (
    <>
      <mesh>
        <sphereGeometry args={[radius + 0.05, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexAtmosphere}
          fragmentShader={fragmentAtmosphere}
          uniforms={{
            uColor: { value: new THREE.Color('#B399FF') },
            uThickness: { value: 1.0 },
            uViewDir: { value: new THREE.Vector3(0.5, 0.0, 0.7) } // fixed direction
          }}
           blending={THREE.AdditiveBlending}
                  // side={THREE.BackSide} 
           transparent
           depthWrite={false}
        />
      </mesh>
    </>
  )
}

export default Atmosphere
