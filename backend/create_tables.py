# create_tables.py
from app import create_app, db

def main():
    app = create_app()
    with app.app_context():
        print("Creating tables from models...")
        db.create_all()
        print("Done. Tables created (if not existing).")

if __name__ == "__main__":
    main()
