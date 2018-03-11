import matplotlib.pyplot as plotter
import json
plotter.figure()
plotter.grid(True)
with open('./plotter_data_0.json', 'r') as openfile:
    data_0 = json.load(openfile)
with open('./plotter_data_1.json', 'r') as openfile:
    data_1 = json.load(openfile)
plotter.plot(data_0, data_2)
plotter.show()
