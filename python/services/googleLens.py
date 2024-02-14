import requests
import re;

# Function to read the image file as bytes
def read_image_file(file_path):
    with open(file_path, 'rb') as file:
        return file.read()

# Function to post image as form data
def post_image(image_path, endpoint_url):
    try:
        # Read the image file as bytes
        image_data = read_image_file(image_path)

        # Create form data
        files = {'encoded_image': ('Screenshot from 2024-02-02 17-19-50.png', image_data, 'image/png')}

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
image_path = '././static/Screenshot from 2024-02-02 17-19-50.png'
endpoint_url = 'https://lens.google.com/v3/upload'

post_image(image_path, endpoint_url)
