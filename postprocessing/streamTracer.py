import sys
import math
from paraview.simple import CleantoGrid, PointSource, StreamTracerWithCustomSource, XMLUnstructuredGridReader, XMLUnstructuredGridWriter

# Arguments
# 1. string: InFileName
# 2. string: OutFileName
# 3. string: Vector

args = sys.argv

# Read
VTU = XMLUnstructuredGridReader(FileName=args[1])
VTU.UpdatePipeline()

# Check vector
NumberOfComponents = VTU.GetPointDataInformation().GetFieldData(
).GetArrayInformation(args[3]).GetNumberOfComponents()
if NumberOfComponents != 3:
    raise ValueError('Wrong vector number of components')

# Bounds
Bounds = VTU.GetDataInformation().GetBounds()

# Center
Center = [(Bounds[0] + Bounds[1]) / 2., (Bounds[2] + Bounds[3]) /
          2., (Bounds[4] + Bounds[5]) / 2.]

# Max length
MaxLength = max([Bounds[1] - Bounds[0], Bounds[3] -
                Bounds[2], Bounds[5] - Bounds[4]])

# Radius
Radius = MaxLength / math.sqrt(2.)

# Source
Source = PointSource(Radius=Radius, Center=Center,
                     NumberOfPoints=100)

# Stream tracer
Stream = StreamTracerWithCustomSource(
    ComputeVorticity=True,
    Input=VTU,
    SeedSource=Source,
    Vectors=[args[3]],
    MaximumStreamlineLength=2. * MaxLength
)

# Convert to UnstructuredGrid
NewVTU = CleantoGrid(Input=Stream)

# Write
Writer = XMLUnstructuredGridWriter(FileName=args[2], Input=NewVTU)
Writer.UpdatePipeline()
