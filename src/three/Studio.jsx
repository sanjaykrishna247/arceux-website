import { Environment, Lightformer } from '@react-three/drei';

/**
 * Local studio lighting. The environment is built from Lightformers, so
 * brushed-steel reflections work without downloading an HDR file.
 */
export default function Studio({ dark = false, showcase = false }) {
  return (
    <>
      <ambientLight intensity={showcase ? 0.38 : dark ? 0.25 : 0.4} />
      <directionalLight position={showcase ? [4, 7, 5] : [3, 6, 4]} intensity={showcase ? 2.3 : dark ? 1.4 : 1.7} color="#fff6ea" />
      <directionalLight position={[-4, 3, -3]} intensity={showcase ? 0.5 : dark ? 0.7 : 0.45} color="#dce7ff" />
      {showcase && (
        <>
          {/* showroom: cool rim from behind to outline edges, warm fill from the side */}
          <directionalLight position={[-5, 5, -7]} intensity={1.9} color="#9cc2ff" />
          <directionalLight position={[-7, 1.5, 4]} intensity={0.55} color="#ffd6bd" />
        </>
      )}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={[showcase ? '#474d58' : dark ? '#23262d' : '#e6eaf1']} />
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
        <Lightformer form="rect" intensity={1.6} position={[0, 3, 7]} scale={[12, 2, 1]} />
        <Lightformer form="rect" intensity={dark ? 0.6 : 1} color="#ffd9c4" position={[6, 0, -4]} scale={[4, 6, 1]} />
      </Environment>
    </>
  );
}
