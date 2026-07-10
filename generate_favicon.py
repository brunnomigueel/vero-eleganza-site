from PIL import Image
import os
from collections import deque

logo_path = r"C:\Users\bruno\.gemini\antigravity\brain\3336b330-6d61-4465-b712-f08d3a036a15\media__1783710443844.png"
output_dir = r"c:\Users\bruno\Desktop\Vero Eleganza"

img = Image.open(logo_path).convert("RGBA")
width, height = img.size
pixels = img.load()

print(f"Imagem original: {width}x{height}")

# --- FLOOD FILL: remover fundo branco a partir das bordas ---
# Isso preserva partes brancas internas do logo (linhas brancas do V)
visited = set()
queue = deque()

# Semear a fila com todos os pixels das 4 bordas
for x in range(width):
    queue.append((x, 0))
    queue.append((x, height - 1))
for y in range(height):
    queue.append((0, y))
    queue.append((width - 1, y))

# Threshold: pixel eh "branco/fundo" se R,G,B > 220
threshold = 220
count = 0

while queue:
    x, y = queue.popleft()
    if (x, y) in visited:
        continue
    if x < 0 or x >= width or y < 0 or y >= height:
        continue
    visited.add((x, y))
    
    r, g, b, a = pixels[x, y]
    
    # Se o pixel eh branco/quase branco, torna transparente e expande
    if r > threshold and g > threshold and b > threshold and a > 0:
        pixels[x, y] = (0, 0, 0, 0)
        count += 1
        # Expandir para os 4 vizinhos
        queue.append((x+1, y))
        queue.append((x-1, y))
        queue.append((x, y+1))
        queue.append((x, y-1))

print(f"Pixels de fundo removidos (flood fill): {count}")

# Recortar espaco vazio
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)
    print(f"Recortada para: {img.size[0]}x{img.size[1]}")

# --- Salvar logo-v.png ---
logo_out = os.path.join(output_dir, "logo-v.png")
img.save(logo_out, "PNG", optimize=True)
print(f"Logo transparente salva: {logo_out}")

# --- Gerar favicon.ico real ---
favicon_out = os.path.join(output_dir, "favicon.ico")
icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)]
img.save(favicon_out, format="ICO", sizes=icon_sizes)
print(f"Favicon ICO salvo: {favicon_out}")

# --- Gerar icones PWA/Google ---
for size in [192, 512]:
    resized = img.resize((size, size), Image.LANCZOS)
    fname = os.path.join(output_dir, f"favicon-{size}.png")
    resized.save(fname, "PNG")
    print(f"Icone {size}x{size} salvo: {fname}")

print("Concluido!")
