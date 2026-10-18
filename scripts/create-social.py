"""Optional Open Graph artwork from the original sculpture render.
Requires Pillow and fontTools; not part of the production build.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
import tempfile
ROOT=Path(__file__).resolve().parents[1]
def font(family,style,size):
    path=ROOT/f'node_modules/@fontsource/{family}/files/{family}-latin-{style}.woff'
    face=TTFont(path);face.flavor=None
    output=Path(tempfile.gettempdir())/(path.stem+'.ttf');face.save(output)
    return ImageFont.truetype(str(output),size)
serif=font('cormorant-garamond','400-normal',84)
italic=font('cormorant-garamond','500-italic',84)
sans=font('dm-sans','400-normal',14)
im=Image.new('RGB',(1200,630),'#141413');d=ImageDraw.Draw(im)
d.text((58,36),'M A R I A N A  S T R E Y',font=sans,fill='#eae6dd');d.line((58,78,1142,78),fill='#39342e',width=1)
poster=Image.open(ROOT/'public/images/singular-poster.webp').convert('RGBA');poster.thumbnail((610,530));im.paste(poster,(615,90),poster)
d=ImageDraw.Draw(im)
for y,text,face,col in [(164,'A sua beleza',serif,'#eae6dd'),(244,'não segue',italic,'#c19c7c'),(324,'um padrão.',serif,'#eae6dd')]:d.text((58,y),text,font=face,fill=col)
d.text((62,532),'BIOMEDICINA ESTÉTICA  ·  CAXIAS DO SUL',font=sans,fill='#a99c8b')
im.save(ROOT/'public/images/og-mariana.jpg',quality=92,optimize=True)
