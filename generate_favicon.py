from PIL import Image
import os

logo_path = r"C:\Users\bruno\.gemini\antigravity\brain\3336b330-6d61-4465-b712-f08d3a036a15\media__1783710443844.png"
output_dir = r"c:\Users\bruno\Desktop\Vero Eleganza"

img = Image.open(logo_path).convert("RGBA")

# --- 1. Salvar como logo-v.png (logo do site, alta qualidade) ---
logo_out = os.path.join(output_dir, "logo-v.png")
img.save(logo_out, "PNG")
print(f"Logo salva: {logo_out} ({img.size[0]}x{img.size[1]})")

# --- 2. Gerar favicon.ico REAL (multi-resolucao) ---
favicon_out = os.path.join(output_dir, "favicon.ico")
icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)]
img.save(favicon_out, format="ICO", sizes=icon_sizes)
print(f"Favicon ICO salvo: {favicon_out}")

# --- 3. Gerar favicon-192.png e favicon-512.png (para PWA / Google) ---
for size in [192, 512]:
    resized = img.resize((size, size), Image.LANCZOS)
    fname = os.path.join(output_dir, f"favicon-{size}.png")
    resized.save(fname, "PNG")
    print(f"Icone {size}x{size} salvo: {fname}")

print("Tudo pronto!")
