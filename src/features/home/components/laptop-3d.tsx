import * as THREE from 'three'
import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, Environment, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Model({ ...props }: any) {
  const group = useRef<THREE.Group>(null)
  const lidGroup = useRef<THREE.Group>(null)
  
  // Load model
  const { nodes, materials } = useGLTF('/mac-draco.glb') as any

  // GSAP animation
  React.useEffect(() => {
    if (!group.current || !lidGroup.current) return

    // Create the timeline
    // The trigger is parent section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#interactive-laptop-container',
        start: 'top top',
        end: '+=600%',
        scrub: 2,
      }
    })

    // Phase 1: Lower the closed, tilted laptop (0% - 10%)
    tl.to(group.current.position, {
      y: -3,
      ease: 'power2.inOut',
      duration: 10
    })

    // Phase 2: Rotate to flat (0% - 10%)
    tl.to(group.current.rotation, {
      x: 0,
      ease: 'power2.inOut',
      duration: 10
    }, '<')
    
    // Phase 3: Lid Opening & Final Zoom (10% - 25%)
    tl.to(lidGroup.current.rotation, {
      x: -0.1,
      ease: 'power2.out',
      duration: 15
    }, '>')

    tl.to(group.current.position, {
      z: 2,
      y: -8,
      ease: 'power2.out',
      duration: 15
    }, '<')

    // STAY OPEN (25% - 55%)
    tl.to({}, { duration: 30 })

    // PHASE 6 EXIT: Rotate back, Close lid, Drop down (55% - 65%)
    tl.to(lidGroup.current.rotation, {
      x: Math.PI / 2, // Close lid
      duration: 10,
      ease: "power2.inOut"
    }, "exit")

    tl.to(group.current.rotation, {
      x: -3, // Tilt back
      duration: 10,
      ease: "power2.inOut"
    }, "exit")

    tl.to(group.current.position, {  
      y: -20,
      duration: 10,
      ease: "power2.in"
    }, "exit")

    // PADDING to keep it offscreen for the rest of the HTML animations (65% - 100%)
    tl.to({}, { duration: 35 })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <group ref={group} rotation-x={1.3} {...props} dispose={null}>
      <group ref={lidGroup} rotation-x={Math.PI / 2} position={[0, -0.04, 0.41]}>
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
              <div 
                className="w-[668px] h-[432px] origin-top-left scale-50" 
                onPointerDown={(e) => e.stopPropagation()}
              >
                <img 
                  src="/images/aria-ai-screen.png" 
                  alt="Aria AI Screen"
                  className="w-full h-full object-cover"
                />
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
}

export function Laptop3D() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile() // check on mount
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [5, 0, -20], fov: 55 }}>
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <group rotation={[0, 2.9, 0]} position={[1.3, 3, -5]} scale={isMobile ? 0.75 : 1}>
            <Model />
          </group>
          <Environment preset="city" />
        </Suspense>     
      </Canvas>
    </div>
  )
}

useGLTF.preload('/mac-draco.glb')
