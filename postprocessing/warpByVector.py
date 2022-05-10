import sys
from paraview.simple import XMLUnstructuredGridReader, XMLUnstructuredGridWriter, WarpByVector

# Arguments
# 1. string: InFileName
# 2. string: OutFileName
# 3. string: Vector
# 4. number: ScaleFactor

args = sys.argv
print(args)

VTU = XMLUnstructuredGridReader(FileName=args[1])

NewVTU = WarpByVector(Input=VTU, ScaleFactor=float(args[4]), Vectors=[args[3]])

Writer = XMLUnstructuredGridWriter(FileName=args[2], Input=NewVTU)
Writer.UpdatePipeline()
