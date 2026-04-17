import os
import random
import shutil
from pathlib import Path
import yaml

NUM_SAMPLES_TRAIN = 1600
NUM_SAMPLES_VAL = 400
SRC_DIR = Path('CIVIC ISSUES.v3i.yolov8')
DST_DIR = Path('dataset/CIVIC ISSUES.v3i.yolov8-subset-2000-fixed')

def sample_data(split, num_samples):
    src_img_dir = SRC_DIR / split / 'images'
    src_lbl_dir = SRC_DIR / split / 'labels'
    dst_img_dir = DST_DIR / split / 'images'
    dst_lbl_dir = DST_DIR / split / 'labels'
    
    dst_img_dir.mkdir(parents=True, exist_ok=True)
    dst_lbl_dir.mkdir(parents=True, exist_ok=True)
    
    image_files = list(src_img_dir.glob('*.jpg')) + list(src_img_dir.glob('*.jpeg')) + list(src_img_dir.glob('*.png'))
    pairs = []
    for img_path in image_files:
        lbl_path = src_lbl_dir / (img_path.stem + '.txt')
        if lbl_path.exists():
            pairs.append((img_path, lbl_path))
            
    random.shuffle(pairs)
    sampled_pairs = pairs[:num_samples]
    
    for img_path, lbl_path in sampled_pairs:
        shutil.copy2(img_path, dst_img_dir / img_path.name)
        shutil.copy2(lbl_path, dst_lbl_dir / lbl_path.name)
    print(f"Sampled {len(sampled_pairs)} pairs for {split}")

if __name__ == '__main__':
    sample_data('train', NUM_SAMPLES_TRAIN)
    sample_data('valid', NUM_SAMPLES_VAL)

    # Update data.yaml
    src_yaml = SRC_DIR / 'data.yaml'
    dst_yaml = DST_DIR / 'data.yaml'

    if src_yaml.exists():
        with open(src_yaml, 'r') as f:
            data = yaml.safe_load(f)
        
        # fix paths to be relative to the new dataset dir where data.yaml lives
        data['train'] = 'train/images'
        data['val'] = 'valid/images'
        if 'test' in data:
            data['test'] = 'test/images'
            
        with open(dst_yaml, 'w') as f:
            yaml.dump(data, f)
        print(f"Updated data.yaml at {dst_yaml}")
    else:
        print("WARN: Source data.yaml not found at", src_yaml)
