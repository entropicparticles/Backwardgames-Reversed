import numpy  as np
import pandas as pd
from imageio import imread
import glob
import time
from colorsys import hsv_to_rgb
from matplotlib.colors import rgb_to_hsv as rgb_to_hsv_arr,hsv_to_rgb as hsv_to_rgb_arr

import json

import warnings
warnings.filterwarnings('ignore')

###############################################################################################################################
# BASICS AND GLOBALS

PATH = './images/'

###############################################################################################################################
# LOADING IMAGES

# cargar las imagenes y darle los colores elegidos    
def carga(file):

    m = np.array(imread(file)).astype('uint8')
    # si la imagen ya tiene color, carga tal cual
    if structurefile(file)[2].split('_')[0]=='RGB':
        return m
    else:
        jm,im,k=m.shape
        # se asume que el png es transparente (0), cualquier color (1), blanco (2) o negro (3
        n = np.full((jm,im),0)
        n[ m[:,:,3]==0] = 0
        n[(m[:,:,3]==255)&(~((m[:,:,0]==255)&(m[:,:,1]==255)&(m[:,:,2]==255)))] = 1
        n[(m[:,:,3]==255)&   (m[:,:,0]==255)&(m[:,:,1]==255)&(m[:,:,2]==255)  ] = 2
        n[(m[:,:,3]==255)&   (m[:,:,0]==  0)&(m[:,:,1]==  0)&(m[:,:,2]==  0)  ] = 3
        return n

def splitbypoint(y):
    y = y.split('.')
    if len(y)==2:
        y = y[0:1]+['0','0','0','0','0','png']
    return y
def structurefile(x):
    xx = [ splitbypoint(y) for y in x.split('\\')[-3:]]
    return np.concatenate(xx)[:-1]

# cargar todos los elementos siguiendo el arbol de carpetas
def load_tiles(path):
    filespanel = glob.glob(path+'images/panel/*/*.png')
    # no cargamos las imagenes de la intro si no está activada la opcion
    filespanel = [x for x in filespanel 
        if ((x.split('\\')[-2]!='videointro') and (not False)) or (False) ]
    files      = glob.glob(path+'images/*/*/*.png')
    
    tiles = pd.DataFrame([ structurefile(x) for x in files if not x in filespanel],
                         columns=['type','folder','file','I','J','DX','DY','DZ'])
    tiles['I']   = tiles['I'].astype(int)
    tiles['J']   = tiles['J'].astype(int)
    tiles['DX']  = tiles['DX'].astype(int)
    tiles['DY']  = tiles['DY'].astype(int)
    tiles['DZ']  = tiles['DZ'].astype(int)
    tiles['png'] = [carga(x) for x in files if x not in filespanel]
    tiles['DI']  = tiles['png'].apply(lambda r: r.shape[1])
    tiles['DJ']  = tiles['png'].apply(lambda r: r.shape[0])
    
    tilespanel = pd.DataFrame([ structurefile(x)[[-7,-6]] for x in filespanel],columns=['type','file'])
    tilespanel['png'] = [carga(x) for x in filespanel]
    tilespanel['DI']  = tilespanel['png'].apply(lambda r: r.shape[1])
    tilespanel['DJ']  = tilespanel['png'].apply(lambda r: r.shape[0])

    return tiles.set_index(['type','folder','file'])[['I','J','DI','DJ','DX','DY','DZ','png']],tilespanel.set_index(['type','file'])
    
# cargamos imagenes
tiles,tilespanel = load_tiles(PATH)

abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,'"+'"?!@*#$%&()+-/:;<=>[\]^{|}~ ';

GOTHIC = tilespanel.loc[('text','mygothic')].png
GOTHICFAT = tilespanel.loc[('text','mygothicfat')].png

def getmatrix(k):
    i,j=k%7,k//7
    M = GOTHIC[63*j:63*(j+1),91*i:91*(i+1)]
    if k!=92:
        h = M[:,:].sum(axis=0)!=0
        MM = M[:,h]
    else:
        MM = M[:,0:12]
    return MM

def getmatrixfat(k):
    i,j=k%7,k//7
    M = GOTHICFAT[63*j:63*(j+1),91*i:91*(i+1)]
    if k!=92:
        h = M[:,:].sum(axis=0)!=0
        MM = M[:,h]
    else:
        MM = M[:,0:12]
    return MM

# creamos una entrada por cada letra, desechamos el archivo completo
letters = pd.concat([pd.DataFrame({'type':'panel','folder':'text_normal','file':list(abc),'I':0,'J':0,'DI':6,'DJ':11,
                                   'DX':0,'DY':0,'DZ':0,
                'png':[tiles.loc['panel','text','all_white_6'].png[:,k*6:(k+1)*6] for k in range(len(abc))]}),
                     pd.DataFrame({'type':'panel','folder':'text_gothic','file':list(abc),'I':0,'J':0,
                         'DI':[getmatrix(k).shape[1] for k in range(len(abc))],
                         'DJ':[getmatrix(k).shape[0] for k in range(len(abc))],
                         'DX':0,'DY':0,'DZ':0,
                'png':[getmatrix(k) for k in range(len(abc))]}),
                     pd.DataFrame({'type':'panel','folder':'text_gothic_fat','file':list(abc),'I':0,'J':0,
                         'DI':[getmatrixfat(k).shape[1] for k in range(len(abc))],
                         'DJ':[getmatrixfat(k).shape[0] for k in range(len(abc))],
                         'DX':0,'DY':0,'DZ':0,
                'png':[getmatrixfat(k) for k in range(len(abc))]}) ])

tiles0 = tiles.reset_index()
tiles0 = pd.concat([tiles0[tiles0['folder']!='text'],letters])

# pasamos a formatos que se traga el JS
tiles0['folder'] = tiles0['folder'].apply(lambda r: r.replace('-','_'))
tiles0['png']    = tiles0['png'].apply(lambda r: r.flatten().tolist())
tiles0 = tiles0[~((tiles0['type']=='panel')&(tiles0['folder']=='videointro'))]


culo = {tt:{ff:{f:tiles0[(tiles0['type']==tt)&(tiles0['folder']==ff)&(tiles0['file']==f)].drop(columns=['type','folder','file']).iloc[0].to_dict() 
                    for f in tiles0[(tiles0['type']==tt)&(tiles0['folder']==ff)]['file'].drop_duplicates()} 
                for ff in tiles0[tiles0['type']==tt]['folder'].drop_duplicates()}
            for tt in tiles0['type'].drop_duplicates()}

with open('../js/tiles.js', 'w') as json_file:
    json_file.write("tiles = "+str(culo))
