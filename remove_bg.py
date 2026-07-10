from PIL import Image

def remove_background(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # item is (R, G, B, A)
            # Remove black background (if R, G, B are all close to 0)
            if item[0] < 50 and item[1] < 50 and item[2] < 50:
                newData.append((255, 255, 255, 0))
            # Remove white background (if R, G, B are all close to 255)
            elif item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        
        # Crop empty space
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(output_path, "PNG")
        print(f"Success: {output_path}")
    except Exception as e:
        print(f"Error: {e}")

remove_background("vero Logo loja .png", "logo-transparent.png")
