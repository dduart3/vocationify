import * as THREE from 'three'
import React, { Suspense, useRef, useState, useEffect, memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, Environment, useGLTF } from '@react-three/drei'
import gsap from 'gsap'

const VideoScreen = memo(({ src }: { src: string }) => {
  const [displaySrc, setDisplaySrc] = useState(src);
  const videoRef = useRef<HTMLVideoElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (src !== displaySrc) {
      const tl = gsap.timeline();

      // fast white flash transition
      tl.to(flashRef.current, { 
        opacity: 1, 
        duration: 0.15, 
        ease: 'power2.out',
        onComplete: () => {
          setDisplaySrc(src);
        }
      })
      .to(flashRef.current, { 
        opacity: 0, 
        duration: 0.25, 
        ease: 'power2.in',
        delay: 0.05
      });
    }
  }, [src, displaySrc]);

  return (
    <div className="w-[668px] h-[432px] origin-top-left scale-50 relative bg-black overflow-hidden">
      <video
        ref={videoRef}
        key={displaySrc} // key ensures video restarts/reloads correctly on src swap
        src={displaySrc}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* White Flash Overlay */}
      <div 
        ref={flashRef}
        className="absolute inset-0 bg-white opacity-0 pointer-events-none z-10"
      />
    </div>
  );
});

const Model = memo(({ videoUrl, ...props }: any) => {
  const group = useRef<THREE.Group>(null)
  const lidGroup = useRef<THREE.Group>(null)
  
  const { nodes, materials } = useGLTF('/mac-draco.glb') as any

  return (
    <group ref={group} rotation-x={0.1} {...props} dispose={null}>
      <group ref={lidGroup} rotation-x={-0.1} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} />
          <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} />
          <mesh geometry={nodes['Cube008_2'].geometry}>
            <Html 
              className="w-[334px] h-[216px] bg-[#f0f0f0] rounded-[3px] overflow-hidden p-0" 
              rotation-x={-Math.PI / 2} 
              position={[0, 0.05, -0.09]} 
              transform 
              occlude="blending"
            >
              <div onPointerDown={(e) => e.stopPropagation()}>
                {videoUrl ? (
                  <VideoScreen src={videoUrl} />
                ) : (
                  <div className="w-[668px] h-[432px] origin-top-left scale-50">
                    <img 
                      src="/images/aria-ai-screen.png" 
                      alt="Aria AI Screen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Html>
          </mesh>
        </group>
      </group>
      <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />
      <group position={[0, -0.1, 3.39]}>
        <mesh material={materials.aluminium} geometry={nodes['Cube002'].geometry} />
        <mesh material={materials.trackpad} geometry={nodes['Cube002_1'].geometry} />
      </group>
      <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
    </group>
  )
});

export const LaptopStraight = memo(({ videoUrl }: { videoUrl?: string }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="w-full h-full relative pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <group rotation={[0, 0, 0]} position={[0, isMobile ? -4 : -2, 0]}>
            <Model scale={isMobile ? 0.55 : 0.9} videoUrl={videoUrl} />
          </group>
          <Environment preset="city" />
        </Suspense>     
      </Canvas>
    </div>
  )
});

useGLTF.preload('/mac-draco.glb')


useGLTF.preload('/mac-draco.glb')
