from PIL import Image

img = Image.open(r"C:\Users\bruno\.gemini\antigravity\brain\3336b330-6d61-4465-b712-f08d3a036a15\media__1783710443844.png").convert("RGBA")
pixels = img.load()
w, h = img.size

# Contar pixels por tipo
transparent = 0
white = 0
colored = 0
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if a == 0:
            transparent += 1
        elif r > 230 and g > 230 and b > 230:
            white += 1
        else:
            colored += 1

total = w * h
print(f"Tamanho: {w}x{h} = {total} pixels")
print(f"Transparentes: {transparent} ({transparent*100//total}%)")
print(f"Brancos (R,G,B > 230): {white} ({white*100//total}%)")
print(f"Coloridos (logo): {colored} ({colored*100//total}%)")

# Verificar cantos
corners = [(0,0), (w-1,0), (0,h-1), (w-1,h-1)]
for cx, cy in corners:
    print(f"Canto ({cx},{cy}): RGBA = {pixels[cx,cy]}")
