import sys
from paraview.simple import WarpByVector, XMLUnstructuredGridReader, XMLUnstructuredGridWriter

# Arguments
# 1. string: InFileName
# 2. string: OutFileName
# 3. string: Vector
# 4. number: ScaleFactor

args = sys.argv

# Read
VTU = XMLUnstructuredGridReader(FileName=args[1])
VTU.UpdatePipeline()

# Warp by vector
NewVTU = WarpByVector(Input=VTU, ScaleFactor=float(args[4]), Vectors=[args[3]])

# Write
Writer = XMLUnstructuredGridWriter(FileName=args[2], Input=NewVTU)
Writer.UpdatePipeline()
