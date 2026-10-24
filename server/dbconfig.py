from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "postgresql://postgres:postgres@localhost:5432/inventory_management"
engine = create_engine(db_url)
session = sessionmaker(autoflush=False, autocommit=False, bind=engine)