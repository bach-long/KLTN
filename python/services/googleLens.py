import requests
import re;
from io import BytesIO
import fitz  # import the bindings
from PIL import Image

# Function to read the image file as bytes
def read_image_file(file_path):
    with open(file_path, 'rb') as file:
        return file.read()

# Function to post image as form data
def post_image(image_path, endpoint_url):
    try:
        image = []
        doc = fitz.open(image_path)  # open document
        print(doc)
        for page in doc:  # iterate through the pages
            print(page)
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            image.append(img)
        print(len(image))
        merged_image = Image.new('RGB', (max(img.width for img in image), sum(img.height for img in image)))
        y_offset = 0
        for img in image:
            merged_image.paste(img, (0, y_offset))
            y_offset += img.height
        merged_image.save('./services/image.png', format='PNG')
        with BytesIO() as output:
            # Ghép các ảnh lại với nhau và ghi vào bộ đệm nhị phân
            merged_image.save(output, format='PNG')
            # Lấy dữ liệu từ bộ đệm
            image_bytes = output.getvalue()
        files = {'encoded_image': ('image.png', image_bytes, 'image/png')}

        # Make a POST request using requests with form data
        response = requests.post(endpoint_url, files=files)

        # Extract data using regex
        regex_pattern = r'",\[\[(\[".*?"\])\],"'
        match = re.search(regex_pattern, response.text)

        if match and match.group(1):
            extracted_data = match.group(1)
            return {"content": extracted_data[1:-1], "success": True}
        else:
            print('No data matched the regex pattern.')
            return {"content": None, "success": False}

        #print('Image posted successfully:', response.text)
    except Exception as e:
        print('Error posting image:', str(e))

# Example usage
image_path = "./services/001.03.08.H30.24.2017.K2.SNV.01.193.Bia_MLHS_193.pdf"
