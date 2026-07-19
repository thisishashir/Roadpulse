import os
import requests
from tqdm import tqdm

def download_model():
    # URL to a specialized YOLOv8 Road Damage model (RDD2022)
    # This model is specifically trained to detect potholes and cracks while ignoring everything else.
    url = "https://huggingface.co/ozair23/yolov8-road-damage-detector/resolve/main/best.pt"
    filename = "road_damage_best.pt"
    
    print(f"🚀 Downloading specialized Road Damage model from HuggingFace...")
    print(f"🔗 Source: {url}")
    
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    block_size = 1024 # 1 Kibibyte
    
    progress_bar = tqdm(total=total_size, unit='iB', unit_scale=True)
    
    with open(filename, 'wb') as file:
        for data in response.iter_content(block_size):
            progress_bar.update(len(data))
            file.write(data)
    
    progress_bar.close()
    
    if total_size != 0 and progress_bar.n != total_size:
        print("❌ ERROR: Something went wrong during download.")
    else:
        print(f"✅ SUCCESS: Model saved as {filename}")
        print("\nNext steps:")
        print("1. Restart your backend: 'python main.py'")
        print("2. The system will now automatically use the high-accuracy model.")

if __name__ == "__main__":
    download_model()
