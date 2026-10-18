"""Render the source strategy into one offline HTML document (stdlib only)."""
from pathlib import Path
import re, html, json

root=Path(__file__).resolve().parents[1]
source=(root/'docs/estrategia-mariana-strey.md').read_text()
def inline(s):
    s=html.escape(s)
    s=re.sub(r'`([^`]+)`',r'<code>\1</code>',s)
    s=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',s)
    s=re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)\)',r'<a href="\2" target="_blank" rel="noopener noreferrer">\1</a>',s)
    return s.replace('\\|','|')
lines=source.splitlines();out=[];toc=[];i=0
while i<len(lines):
    line=lines[i]
    if not line.strip():i+=1;continue
    if line.startswith('```'):
        code=[];i+=1
        while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
        out.append('<pre><code>'+html.escape('\n'.join(code))+'</code></pre>');i+=1;continue
    h=re.match(r'^(#{1,6})\s+(.*)',line)
    if h:
        level=len(h[1]);title=h[2];ident='sec-'+str(len(toc)+1) if level==2 else ''
        if level==2:toc.append((ident,title))
        out.append(f'<h{level}'+(f' id="{ident}"' if ident else '')+'>'+inline(title)+f'</h{level}>')
        if title.startswith('5. Wireframe'):
            svg=(root/'docs/wireframes-390.svg').read_text()
            out.append('<details class="wireframes"><summary>Abrir os 12 wireframes de 390 px</summary>'+svg+'</details>')
        i+=1;continue
    if line.startswith('|') and i+1<len(lines) and re.match(r'^\|[\s:|\-]+$',lines[i+1]):
        rows=[]
        while i<len(lines) and lines[i].startswith('|'):
            if not re.match(r'^\|[\s:|\-]+$',lines[i]):rows.append([v.strip() for v in re.split(r'(?<!\\)\|',lines[i].strip('|'))])
            i+=1
        out.append('<div class="table-wrap"><table><thead><tr>'+''.join('<th>'+inline(v)+'</th>' for v in rows[0])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+inline(v)+'</td>' for v in r)+'</tr>' for r in rows[1:])+'</tbody></table></div>');continue
    if line.startswith('>'):
        block=[]
        while i<len(lines) and lines[i].startswith('>'):block.append(inline(lines[i][1:].strip()));i+=1
        out.append('<blockquote>'+'<br/>'.join(block)+'</blockquote>');continue
    if re.match(r'^(- |\d+\. )',line):
        ordered=bool(re.match(r'^\d',line));items=[]
        while i<len(lines) and re.match(r'^(- |\d+\. )',lines[i]):
            value=re.sub(r'^(- |\d+\. )','',lines[i]);items.append('<li>'+inline(value)+'</li>');i+=1
        tag='ol' if ordered else 'ul';out.append('<'+tag+'>'+''.join(items)+'</'+tag+'>');continue
    para=[line];i+=1
    while i<len(lines) and lines[i].strip() and not re.match(r'^(#|>|\||```|- |\d+\. )',lines[i]):para.append(lines[i]);i+=1
    out.append('<p>'+inline(' '.join(para))+'</p>')

nav=''.join(f'<a href="#{ident}">{html.escape(title)}</a>' for ident,title in toc)
css='''*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:25px}body{margin:0;background:#f4f0e8;color:#242824;font:15px/1.75 system-ui,sans-serif}header{background:#242824;color:#f4f0e8;padding:65px max(5vw,24px)}header p{color:#cbad91;letter-spacing:.15em;font-size:11px;margin:0 0 18px}header h1{font:400 54px/1.05 Georgia,serif;max-width:850px;letter-spacing:-.035em;margin:0 0 25px}header span{font-size:13px;color:#d0d7c7}.layout{display:grid;grid-template-columns:250px minmax(0,1fr);max-width:1500px;margin:auto}nav{position:sticky;top:0;align-self:start;padding:35px 24px;max-height:100vh;overflow:auto}nav a{display:block;font-size:11px;padding:9px 0;border-bottom:1px solid #d9d5cb;color:#535e49;text-decoration:none}main{max-width:1130px;padding:45px 40px 100px;border-left:1px solid #d9d5cb;min-width:0}main>h1{display:none}h2{font:400 35px/1.15 Georgia,serif;letter-spacing:-.02em;padding-top:40px;margin:32px 0 24px;border-top:1px solid #b1baa5}h3{font-size:19px;line-height:1.4;margin:36px 0 15px}p{margin:14px 0}a{color:#67553e;text-decoration:underline;text-underline-offset:3px}strong{font-weight:650}ul,ol{padding-left:23px}li{margin:10px 0}blockquote{margin:22px 0;padding:23px 28px;background:#e2e5d9;border-left:3px solid #8a775d;font-size:16px;line-height:1.85}.table-wrap{overflow-x:auto;margin:25px 0}table{border-collapse:collapse;min-width:700px;width:100%;font-size:12px;line-height:1.7;text-align:left}th{background:#e2e5d9;font-weight:650}td,th{border-bottom:1px solid #c8cdbf;padding:14px 13px;vertical-align:top}td:first-child{min-width:125px}pre{padding:24px;background:#242824;color:#f4f0e8;overflow:auto;font-size:12px;line-height:1.7}code{font-family:ui-monospace,monospace;font-size:.88em;overflow-wrap:anywhere}.wireframes{border:1px solid #b1baa5;padding:15px;margin:25px 0}.wireframes summary{cursor:pointer;font-weight:600;font-size:13px;min-height:30px}.wireframes svg{max-width:100%;height:auto;margin-top:20px}footer{padding:25px 5vw;background:#e2e5d9;font-size:12px}@media(max-width:900px){.layout{display:block}nav{position:static;max-height:none;display:grid;grid-template-columns:1fr 1fr;gap:0 20px;padding:20px 24px}main{border:0;padding:20px 24px 60px}header h1{font-size:40px}h2{font-size:30px}}@media print{nav{display:none}.layout{display:block}main{max-width:none;padding:0;border:0}header{padding:25px}h2{break-before:page}table{min-width:0;font-size:9px}a{color:inherit}pre{white-space:pre-wrap}.wireframes{display:none}}'''
doc='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mariana Strey — Estratégia e briefing completo</title><style>'+css+'</style></head><body><header><p>ESTRATÉGIA / CONVERSÃO / EXPERIÊNCIA / IMPLEMENTAÇÃO</p><h1>Mariana Strey.<br>O cuidado começa na decisão.</h1><span>Documento completo em 12 etapas · Pesquisa em 18 de outubro de 2026 · Fatos e premissas identificados</span></header><div class="layout"><nav aria-label="Índice">'+nav+'</nav><main>'+''.join(out)+'</main></div><footer>Mariana Strey · Projeto de experiência digital · Material de revisão antes do lançamento público.</footer></body></html>'
target=root/'docs/estrategia-mariana-strey.html';target.write_text(doc)
print(str(target),len(doc.encode()),'bytes',len(toc),'sections')
