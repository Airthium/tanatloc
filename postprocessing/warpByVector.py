import sys
from paraview.simple import XMLUnstructuredGridReader, XMLUnstructuredGridWriter, WarpByVector

# Arguments
# 1. string: InFileName
# 2. string: OutFileName
# 3. number: ScaleFactor
# 4. string: Vector

args = sys.argv
print(args)

VTU = XMLUnstructuredGridReader(FileName=args[1])

NewVTU = WarpByVector(Input=VTU, ScaleFactor=float(args[3]), Vectors=[args[4]])

Writer = XMLUnstructuredGridWriter(FileName=args[2], Input=NewVTU)
Writer.UpdatePipeline()
