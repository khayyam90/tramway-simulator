import numpy as np
import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt

data1 = np.loadtxt('../data/speed1.txt')
data4 = np.loadtxt('../data/speed4.txt')
data5 = np.loadtxt('../data/speed5.txt')
data7 = np.loadtxt('../data/speed7.txt')
data12 = np.loadtxt('../data/speed12.txt')
data17 = np.loadtxt('../data/speed17.txt')

df = pd.DataFrame({ 
    '1': [np.mean(data1)], 
    '4': [np.mean(data4)], 
    '5': [np.mean(data5)], 
    '7': [np.mean(data7)],
	'12': [np.mean(data12)],
    '17': [np.mean(data17)]
})

ax = sns.barplot(data=df, orient = 'h')
ax.set_title('Trip time depending of simultaneously running tramways')

plt.show()