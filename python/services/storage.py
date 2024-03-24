from google.cloud import storage
from google.cloud.exceptions import Conflict
import owncloud

oc = owncloud.Client('http://nextcloud.local.com')

def cors_configuration(bucket_name):
    """Set a bucket's CORS policies configuration."""
    # bucket_name = "your-bucket-name"

    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    bucket.cors = [{
        "origin": [
          "*"
        ],
        "method": [
          "*"
        ],
        "responseHeader": [
          "*"
        ],
        "maxAgeSeconds": 3600
    }]
    bucket.patch()

    print(f"Set CORS policies for bucket {bucket.name} is {bucket.cors}")

def bucket_metadata(bucket_name):
    """Prints out a bucket's metadata."""
    # bucket_name = 'your-bucket-name'

    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)

    print(f"ID: {bucket.id}")
    print(f"Name: {bucket.name}")
    print(f"Storage Class: {bucket.storage_class}")
    print(f"Cors: {bucket.cors}")
    print(
        f"Public Access Prevention: {bucket.iam_configuration.public_access_prevention}"
    )

def get_autoclass(bucket_name):
    """Get the Autoclass setting for a bucket."""
    # The ID of your GCS bucket
    # bucket_name = "my-bucket"

    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    autoclass_enabled = bucket.autoclass_enabled
    autoclass_toggle_time = bucket.autoclass_toggle_time
    terminal_storage_class = bucket.autoclass_terminal_storage_class
    tsc_update_time = bucket.autoclass_terminal_storage_class_update_time

    print(f"Autoclass enabled is set to {autoclass_enabled} for {bucket.name} at {autoclass_toggle_time}.")
    print(f"Autoclass terminal storage class is set to {terminal_storage_class} for {bucket.name} at {tsc_update_time}.")

    return bucket

def authenticate_implicit_with_adc(project_id="firm-plexus-407716"):
    """
    When interacting with Google Cloud Client libraries, the library can auto-detect the
    credentials to use.

    // TODO(Developer):
    //  1. Before running this sample,
    //  set up ADC as described in https://cloud.google.com/docs/authentication/external/set-up-adc
    //  2. Replace the project variable.
    //  3. Make sure that the user account or service account that you are using
    //  has the required permissions. For this sample, you must have "storage.buckets.list".
    Args:
        project_id: The project id of your Google Cloud project.
    """

    # This snippet demonstrates how to list buckets.
    # *NOTE*: Replace the client created below with the client required for your application.
    # Note that the credentials are not specified when constructing the client.
    # Hence, the client library will look for credentials using ADC.
    storage_client = storage.Client(project=project_id)
    buckets = storage_client.list_buckets()
    print("Buckets:")
    for bucket in buckets:
        print(bucket.name)
    print("Listed all storage buckets.")

def create_folder_in_bucket(bucket_name, folder_name):
    """
    Create a new folder (prefix) in a Google Cloud Storage bucket.

    Args:
        bucket_name: The name of the Google Cloud Storage bucket.
        folder_name: The name of the folder (prefix) to be created in the bucket.
    """
    # Authenticate with ADC
    storage_client = storage.Client()

    # Get the bucket
    bucket = storage_client.get_bucket(bucket_name)

    # Create a blob (object) with a name ending with '/' to represent a folder
    blob = bucket.blob(folder_name)

    # Upload an empty content to create the folder
    blob.upload_from_string("")

    print(f"Folder '{folder_name}' created in the bucket '{bucket_name}'.")

def upload_file(bucket_name, file, file_format, destination_blob_name):
    """
    Upload a file to Google Cloud Storage.

    Args:
        bucket_name: The name of the Google Cloud Storage bucket.
        source_file_path: The local path of the file to be uploaded.
        destination_blob_name: The name to be given to the object (file) in the bucket.
    """
    # Authenticate with ADC
    storage_client = storage.Client()

    # Get the bucket
    bucket = storage_client.get_bucket(bucket_name)

    # Create a blob (object) with the given name
    blob = bucket.blob(destination_blob_name)

    # Upload the file
    blob.upload_from_string(file, content_type=file_format)

    print(f"File uploaded to '{bucket_name}/{destination_blob_name}'.")

def move_blob(bucket_name, blob_name, destination_bucket_name, destination_blob_name,):
    """Moves a blob from one bucket to another with a new name."""

    storage_client = storage.Client()

    source_bucket = storage_client.bucket(bucket_name)
    source_blob = source_bucket.blob(blob_name)
    destination_bucket = storage_client.bucket(destination_bucket_name)

    # Optional: set a generation-match precondition to avoid potential race conditions
    # and data corruptions. The request is aborted if the object's
    # generation number does not match your precondition. For a destination
    # object that does not yet exist, set the if_generation_match precondition to 0.
    # If the destination object already exists in your bucket, set instead a
    # generation-match precondition using its generation number.
    # There is also an `if_source_generation_match` parameter, which is not used in this example.
    destination_generation_match_precondition = 0

    blob_copy = source_bucket.copy_blob(
        source_blob, destination_bucket, destination_blob_name, if_generation_match=destination_generation_match_precondition,
    )
    source_bucket.delete_blob(blob_name)

    print(
        "Blob {} in bucket {} moved to blob {} in bucket {}.".format(
            source_blob.name,
            source_bucket.name,
            blob_copy.name,
            destination_bucket.name,
        )
    )

def delete_blob(bucket_name, blob_name):
    """Deletes a blob from the bucket."""
    # bucket_name = "your-bucket-name"
    # blob_name = "your-object-name"

    storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    generation_match_precondition = None

    # Optional: set a generation-match precondition to avoid potential race conditions
    # and data corruptions. The request to delete is aborted if the object's
    # generation number does not match your precondition.
    blob.reload()  # Fetch blob metadata to use in generation_match_precondition.
    generation_match_precondition = blob.generation

    blob.delete(if_generation_match=generation_match_precondition)

    print(f"Blob {blob_name} deleted.")

def delete_objects_in_folder(bucket_name, folder_path):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    blobs = list(bucket.list_blobs(prefix=folder_path))
    bucket.delete_blobs(blobs)
    print(f"Folder {folder_path} deleted.")

    print(f"All objects in folder {folder_path} deleted.")
#move_blob("kltn-1912", "vidu-kltn-ungdung.pdf", "kltn-1912", "new/vidu-kltn-ungdung.pdf")

def move_folder(source_bucket_name, source_folder_name, destination_folder_name):
    # Initialize the Google Cloud Storage client
    client = storage.Client()

    # Get the source and destination bucket
    source_bucket = client.bucket(source_bucket_name)

    # List all blobs in the source folder
    blobs = source_bucket.list_blobs(prefix=source_folder_name)

    # Iterate through each blob and move it to the destination folder
    for blob in blobs:
        # Create the destination blob path by replacing the source folder name
        destination_blob_name = destination_folder_name + blob.name
        print(destination_blob_name)
        # Copy the blob to the destination folder
        destination_blob = source_bucket.copy_blob(blob, source_bucket, destination_blob_name)

        # Delete the blob from the source folder
        blob.delete()

        print(f'Moved {blob.name} to {destination_blob.name}')

def list_folder_contents(bucket_name, folder_name, delimiter = None):
    client = storage.Client()
    folders = []
    files = []
    blobs = client.list_blobs(bucket_name, prefix=folder_name)
    for blob in blobs:
        child_name = blob.name[len(folder_name):].split('/', 1)
        if len(child_name) == 2:
            if blob.name.endswith('/'):
                folders.append({"name": child_name[0], "type": "folder"})
        elif len(child_name) == 1:
            files.append({"name": child_name[0], "type": "file", "url": blob.public_url})

    return {"folders": folders, "files": files}





# Example usage
# source_bucket_name = 'kltn-1912'
# source_folder_name = 'test/'
# destination_folder_name = 'new/'

# move_folder(source_bucket_name, source_folder_name, destination_folder_name)
# get_autoclass('kltn-1912')
