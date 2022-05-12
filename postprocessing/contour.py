import sys
from paraview.simple import Calculator, CleantoGrid, Contour, XMLUnstructuredGridReader, XMLUnstructuredGridWriter

# Arguments
# 1. string: InFileName
# 2. string: OutFileName
# 3. string: ContourBy
# 4. number: Isosurface

args = sys.argv

# Read
VTU = XMLUnstructuredGridReader(FileName=args[1])
VTU.UpdatePipeline()

# Check scalar
try:
    NumberOfComponents = VTU.GetPointDataInformation().GetFieldData().GetArrayInformation(
        args[3]).GetNumberOfComponents()
except Exception:
    NumberOfComponents = 1

if NumberOfComponents == 3:
    # Calculator
    Calc = Calculator(Input=VTU, Function="sqrt(" +
                      args[3] + "_X^2 + " + args[3] + "_Y^2 + " + args[3] + "_Z^2)", ResultArrayName="Res")
    # Contour
    NewPLY = Contour(
        Input=Calc, ContourBy="Res", Isosurfaces=[float(args[4])])
else:
    # Contour
    NewPLY = Contour(
        Input=VTU, ContourBy=args[3], Isosurfaces=[float(args[4])])

# Convert to UnstructuredGrid
NewVTU = CleantoGrid(Input=NewPLY)

# Write
Writer = XMLUnstructuredGridWriter(FileName=args[2], Input=NewVTU)
Writer.UpdatePipeline()
