import { GLTFExporter } from 'three'
import gltfPipeline from 'gltf-pipeline'

const GLBExporter = async (object) => {
  const exporter = new GLTFExporter()

  const gltf = await new Promise((resolve) => {
    exporter.parse(
      object,
      (gltf) => {
        resolve(gltf)
      },
      { binary: false }
    )
  })

  const glb = await gltfPipeline.gltfToGlb(gltf)
  console.log(glb)
}

export default { GLBExporter }
