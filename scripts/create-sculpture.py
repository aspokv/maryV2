"""Original ribbon sculpture + GLB + studio poster. No external model or texture.
Authoring-only dependencies: numpy, Pillow, moderngl (EGL). Runtime needs only GLB.
"""
from pathlib import Path
import json, struct, math
import numpy as np
from PIL import Image
import moderngl
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/models'; OUT.mkdir(parents=True,exist_ok=True)

def curve(t):
    return np.stack([(np.sin(t)+2*np.sin(2*t))*.43, (np.cos(t)-2*np.cos(2*t))*.48, -np.sin(3*t)*.46],axis=-1)
def unit(v): return v/np.linalg.norm(v,axis=-1,keepdims=True).clip(1e-10)
parts=[]
N=220; K=20
for part in range(3):
    t=np.linspace(part*2*np.pi/3,(part+1)*2*np.pi/3,N+1)
    p=curve(t); T=unit(curve(t+.001)-curve(t-.001))
    A=unit(np.cross(T,np.tile([0.,0.,1.],(len(t),1))))
    B=unit(np.cross(T,A))
    twist=.48*np.sin(3*t)+.27
    U=A*np.cos(twist)[:,None]+B*np.sin(twist)[:,None]
    V=-A*np.sin(twist)[:,None]+B*np.cos(twist)[:,None]
    theta=np.linspace(0,2*np.pi,K,endpoint=False)
    # A broad, gently convex ribbon with a narrow polished edge.
    width=.23+.06*np.sin(3*t+.6)
    depth=.085+.014*np.cos(3*t)
    co=np.cos(theta); si=np.sin(theta)
    mesh=p[:,None,:]+U[:,None,:]*co[None,:,None]*width[:,None,None]+V[:,None,:]*si[None,:,None]*depth[:,None,None]
    positions=mesh.reshape(-1,3).astype('<f4')
    faces=[]
    for j in range(N):
      for k in range(K):
        a=j*K+k; b=j*K+(k+1)%K; c=(j+1)*K+k; d=(j+1)*K+(k+1)%K
        faces += [[a,c,b],[b,c,d]]
    # Differential surface normals continue seamlessly across the three cuts.
    def rings(tt):
      pp=curve(tt); tangent=unit(curve(tt+.001)-curve(tt-.001))
      aa=unit(np.cross(tangent,np.tile([0.,0.,1.],(len(tt),1))))
      bb=unit(np.cross(tangent,aa));tw=.48*np.sin(3*tt)+.27
      uu=aa*np.cos(tw)[:,None]+bb*np.sin(tw)[:,None]
      vv=-aa*np.sin(tw)[:,None]+bb*np.cos(tw)[:,None]
      ww=.23+.06*np.sin(3*tt+.6);dd=.085+.014*np.cos(3*tt)
      return pp[:,None,:]+uu[:,None,:]*co[None,:,None]*ww[:,None,None]+vv[:,None,:]*si[None,:,None]*dd[:,None,None]
    along=rings(t+.0001)-rings(t-.0001)
    around=-U[:,None,:]*si[None,:,None]*width[:,None,None]+V[:,None,:]*co[None,:,None]*depth[:,None,None]
    normals=unit(np.cross(along,around)).reshape(-1,3).astype('<f4')
    # Cap vertices are duplicated, leaving no bevel or false seam in assembly.
    for row,sign in [(0,-1),(N,1)]:
      base=len(positions)
      positions=np.concatenate([positions,mesh[row].astype('<f4')])
      normals=np.concatenate([normals,np.tile(T[row]*sign,(K,1)).astype('<f4')])
      for k in range(1,K-1):
        faces.append([base,base+k+1,base+k] if sign<0 else [base,base+k,base+k+1])
    inds=np.asarray(faces,dtype='<u4')
    # The same mesh is used for WebGL and the pre-rendered graceful fallback.
    parts.append((positions,normals,inds))
blob=bytearray(); views=[]; accessors=[]
def add(a,component,kind,target):
    while len(blob)%4:blob.append(0)
    start=len(blob); blob.extend(a.tobytes()); views.append({'buffer':0,'byteOffset':start,'byteLength':a.nbytes,'target':target})
    ac={'bufferView':len(views)-1,'componentType':component,'count':len(a),'type':kind}
    if kind=='VEC3':ac.update(min=a.min(0).tolist(),max=a.max(0).tolist())
    accessors.append(ac); return len(accessors)-1
meshes=[]
for i,(p,n,idx) in enumerate(parts):
    pa=add(p,5126,'VEC3',34962); na=add(n,5126,'VEC3',34962); ia=add(idx.ravel(),5125,'SCALAR',34963)
    meshes.append({'name':f'Singular_{i+1}','primitives':[{'attributes':{'POSITION':pa,'NORMAL':na},'indices':ia,'material':0}]})
gltf={'asset':{'version':'2.0','generator':'Mariana Strey · Singular original sculpture'},'scene':0,'scenes':[{'nodes':[0,1,2]}],'nodes':[{'name':f'Singular_{i+1}','mesh':i} for i in range(3)],'meshes':meshes,'materials':[{'name':'Satin Copper','pbrMetallicRoughness':{'baseColorFactor':[.55,.28,.15,1],'metallicFactor':.92,'roughnessFactor':.24}}],'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':accessors}
j=json.dumps(gltf,separators=(',',':')).encode(); j+=b' '*((-len(j))%4); blob+=b'\0'*((-len(blob))%4)
glb=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(blob))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(blob),0x004e4942)+blob
(OUT/'singular.glb').write_bytes(glb)
# Off-screen OpenGL studio rendering, not a browser.
ctx=moderngl.create_standalone_context(backend='egl')
prog=ctx.program(vertex_shader='''#version 330
uniform mat4 mvp; uniform mat4 model;
in vec3 in_pos; in vec3 in_normal; out vec3 pos; out vec3 norm;
void main(){vec4 p=model*vec4(in_pos,1.0); pos=p.xyz; norm=mat3(model)*in_normal; gl_Position=mvp*p;}
''',fragment_shader='''#version 330
in vec3 pos; in vec3 norm; out vec4 frag; uniform vec3 eye;
float panel(vec3 r,vec3 direction,float sharp){return pow(max(dot(r,normalize(direction)),0.0),sharp);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.0,1.0);}
void main(){
 vec3 n=normalize(norm); vec3 v=normalize(eye-pos); vec3 r=reflect(-v,n);
 float f=pow(1.0-max(dot(n,v),0.0),5.0);
 vec3 base=vec3(.52,.255,.135);
 vec3 soft=vec3(.15,.115,.088)+vec3(3.4,2.8,2.2)*panel(r,vec3(-2.,3.,3.),14.);
 soft+=vec3(1.3,1.1,.95)*panel(r,vec3(3.,1.,1.),30.);
 soft+=vec3(2.4,1.65,1.)*panel(r,vec3(-2.,-1.,-.8),48.);
 soft+=vec3(.65,.75,.84)*panel(r,vec3(.4,2.,-2.),18.);
 float diffuse=.13+.55*max(dot(n,normalize(vec3(-3.,4.,3.))),0.);
 vec3 col=base*diffuse*.3+soft*mix(base,vec3(.85),f*.7);
 col+=base*.035;
 // Slight satin grain, finer than a pixel in the final asset.
 col*=.986+.014*fract(sin(dot(pos.xy,vec2(451.7,327.5)))*43982.);
 col=pow(aces(col*1.15),vec3(1./2.2)); frag=vec4(col,1.);
}''')
def rot(axis,a):
 c,s=np.cos(a),np.sin(a); m=np.eye(4)
 if axis=='x':m[1:3,1:3]=[[c,-s],[s,c]]
 if axis=='y':m[np.ix_([0,2],[0,2])]=[[c,s],[-s,c]]
 if axis=='z':m[:2,:2]=[[c,-s],[s,c]]
 return m
W,H=1400,1600
fbo=ctx.framebuffer(color_attachments=[ctx.texture((W,H),4)],depth_attachment=ctx.depth_renderbuffer((W,H)))
fbo.use(); ctx.enable(moderngl.DEPTH_TEST)
# Transparent poster allows identical dark studio backdrop and readable overlays.
fbo.clear(0,0,0,0)
near,far=.1,100.; f=1/np.tan(np.radians(34)/2); aspect=W/H
proj=np.array([[f/aspect,0,0,0],[0,f,0,0],[0,0,(far+near)/(near-far),2*far*near/(near-far)],[0,0,-1,0]],dtype='f4')
view=np.eye(4);view[2,3]=-6.6
prog['mvp'].write((proj@view).astype('f4').T.tobytes())
prog['model'].write((rot('x',-.17)@rot('y',-.32)@rot('z',.12)).astype('f4').T.tobytes()); prog['eye'].value=(0,0,6.6)
for p,n,idx in parts:
 buf=ctx.buffer(np.concatenate([p,n],axis=1).astype('f4').tobytes());ib=ctx.buffer(idx.tobytes())
 vao=ctx.vertex_array(prog,[(buf,'3f 3f','in_pos','in_normal')],ib,index_element_size=4);vao.render()
im=Image.frombytes('RGBA',(W,H),fbo.read(components=4)).transpose(Image.Transpose.FLIP_TOP_BOTTOM)
# Crop transparent margins; all transformations are cosmetic, with no clinical image editing.
b=im.getbbox();im=im.crop((max(b[0]-70,0),max(b[1]-70,0),min(b[2]+70,W),min(b[3]+70,H)))
im.save(ROOT/'public/images/singular-poster.webp',quality=91,method=6)
im.thumbnail((600,720));im.save(ROOT/'public/images/singular-poster-small.webp',quality=87,method=6)
print(json.dumps({'model_bytes':len(glb),'vertices':sum(len(p[0]) for p in parts),'triangles':sum(len(p[2]) for p in parts),'poster_size':im.size}))
# Two extra stills preserve the camera narrative if WebGL is unavailable.
# They are original renders of the same GLB, never stock imagery.
for label,angle,explosion in [('turn',.72,0),('open',1.1,.85)]:
    fbo.clear(0,0,0,0)
    for i,(p,n,idx) in enumerate(parts):
      center=np.eye(4);phase=i*2*np.pi/3-np.pi/2
      center[:3,3]=[np.cos(phase)*explosion*.7,np.sin(phase)*explosion*.7,(i-1)*explosion*.3]
      transform=rot('x',-.05)@rot('y',angle)@rot('z',-.08)@center
      if explosion: transform[:3,:]*=.84
      prog['model'].write(transform.astype('f4').T.tobytes())
      buf=ctx.buffer(np.concatenate([p,n],axis=1).astype('f4').tobytes());ib=ctx.buffer(idx.tobytes())
      vao=ctx.vertex_array(prog,[(buf,'3f 3f','in_pos','in_normal')],ib,index_element_size=4);vao.render()
    other=Image.frombytes('RGBA',(W,H),fbo.read(components=4)).transpose(Image.Transpose.FLIP_TOP_BOTTOM)
    other=other.crop((max(b[0]-70,0),max(b[1]-70,0),min(b[2]+70,W),min(b[3]+70,H)))
    other.thumbnail((1000,1100));other.save(ROOT/f'public/images/singular-{label}.webp',quality=89,method=6)
