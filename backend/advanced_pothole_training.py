from ultralytics import YOLO

# ADVANCED POTHOLE TRAINING SCRIPT
# This script is optimized to "train potholes more" for maximum accuracy.

def train_specialized_model():
    # 1. Use a larger model for higher accuracy (yolov8s is better than yolov8n)
    model = YOLO('yolov8s.pt') 

    # 2. Define High-Accuracy Training Parameters
    # imgsz=800: Helps detect small potholes from a distance
    # mosaic=1.0: Forces the model to learn pothole textures in various scales
    # mixup=0.15: Makes the model robust against overlapping damages
    # patience=50: Ensures we don't stop training until the model is truly optimized
    
    # IMPORTANT: Ensure your data.yaml points to a dataset with MANY pothole images!
    # Tip: Use Roboflow to download 2000+ pothole images and merge them with RDD2022.
    
    results = model.train(
        data='rdd_potholes.yaml', # Create this YAML with Roboflow
        epochs=150,
        imgsz=800,
        batch=8, # Adjust for your GPU
        mosaic=1.0,
        mixup=0.15,
        degrees=15.0, # Rotate images to handle various camera angles
        fliplr=0.5,
        patience=50,
        name='pothole_pro_model'
    )

    print("✅ Training complete! Your 'well-trained' model is in runs/detect/pothole_pro_model/weights/best.pt")

if __name__ == "__main__":
    train_specialized_model()
