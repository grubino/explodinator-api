import os
from pgmagick import Image, Blob, Geometry
import boto3


s3 = boto3.resource('s3')
EXPLODINATION_BUCKET = s3.Bucket('explodinations')


if __name__ == '__main__':
    image_dir = os.path.join(os.path.dirname(__file__), '.tmp')
    new_image_dir = os.path.join(os.path.dirname(__file__), '.resized')
    for image_file in os.listdir(image_dir):
        image_path = os.path.join(image_dir, image_file)
        if not image_path.endswith('.gif'):
            continue
        print('resizing {}...'.format(image_file))
        new_image_path = os.path.join(new_image_dir, image_file)
        with open(image_path, 'rb') as f:
            im = Image(Blob(f.read()), Geometry(250, 250))
        im.write(new_image_path)
        key = image_file
        with open(new_image_path, 'rb') as f:
            EXPLODINATION_BUCKET.upload_fileobj(f, key, ExtraArgs={'ContentType': 'image/gif'})
        print('done.')
