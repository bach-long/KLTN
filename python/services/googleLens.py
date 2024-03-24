import requests
import re;
from io import BytesIO
import fitz  # import the bindings

# Function to read the image file as bytes
def read_image_file(file_path):
    with open(file_path, 'rb') as file:
        return file.read()

# Function to post image as form data
def post_image(image_path, endpoint_url):
    try:
        image_data = None
        doc = fitz.open(image_path)  # open document
        print(doc)
        for page in doc:  # iterate through the pages
            pixmap = page.get_pixmap()
            image_data = pixmap.pil_tobytes(format="png")
            break

        # Create form data
        files = {'encoded_image': ('image.png', image_data, 'image/png')}

        # Make a POST request using requests with form data
        response = requests.post(endpoint_url, files=files)

        # Extract data using regex
        regex_pattern = r'",\[\[(\[".*?"\])\],"'
        match = re.search(regex_pattern, response.text)

        if match and match.group(1):
            extracted_data = match.group(1)
            print('Extracted data:', extracted_data)
        else:
            print('No data matched the regex pattern.')

        #print('Image posted successfully:', response.text)
    except Exception as e:
        print('Error posting image:', str(e))

# Example usage
image_path = "./services/6b1d9b6b-17bd-445b-ba36-c9f7de5fbb1b.jpeg"
endpoint_url = 'https://lens.google.com/v3/upload'

post_image(image_path, endpoint_url)
