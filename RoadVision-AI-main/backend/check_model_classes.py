from ultralytics import YOLO

def check_model():
    model_path = "road_damage_best.pt"
    try:
        model = YOLO(model_path)
        print(f"✅ Loaded model: {model_path}")
        print("Classes detected by this model:")
        for id, name in model.names.items():
            print(f"  [{id}]: {name}")
    except Exception as e:
        print(f"❌ Error loading model: {e}")

if __name__ == "__main__":
    check_model()
