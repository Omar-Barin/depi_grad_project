from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import db_models
from dbconfig import engine, session
from models.models import Product
from sqlalchemy.orm import Session

from contextlib import asynccontextmanager

def seed_initial_data():
    try:
        db = session()
        if db.query(db_models.Product).count() == 0:
            demo_products = [
                db_models.Product(name="Smartphone", description="Latest generation smartphone", price=699.99, quantity=25),
                db_models.Product(name="Laptop Pro", description="High performance developer laptop", price=1299.99, quantity=8),
                db_models.Product(name="Wireless Mouse", description="Ergonomic optical mouse", price=29.99, quantity=50),
                db_models.Product(name="Mechanical Keyboard", description="RGB mechanical keyboard", price=89.99, quantity=3),
                db_models.Product(name="USB-C Adapter", description="Multiport hub", price=19.99, quantity=0),
            ]
            db.add_all(demo_products)
            db.commit()
            print("Successfully seeded initial inventory data.")
        db.close()
    except Exception as e:
        print(f"Database seed note: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        db_models.Base.metadata.create_all(bind=engine)
        seed_initial_data()
    except Exception as e:
        print(f"Database connection note: {e}")
    yield

app = FastAPI(title="Inventory Management API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def greet():
    return {"message": "Welcome to Smart Inventory Management System API"}

@app.get("/health")
def health():
    return {"status": "healthy"}

def init_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@app.get('/products')
def get_all_products(db: Session = Depends(init_db)):
    all_products = db.query(db_models.Product).all()
    return all_products

@app.get('/products/{id}')
def get_product_by_id(id: int, db: Session = Depends(init_db)):
    db_product = db.query(db_models.Product).filter(db_models.Product.id == id).first()
    if db_product:
        return db_product
    return "product not found"
    
@app.post("/product")
def add_product(product: Product, db: Session = Depends(init_db)):
    data = product.model_dump(exclude_unset=True)
    if data.get("id") is None:
        data.pop("id", None)
    db_product = db_models.Product(**data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/products/{id}")
def update_product(id: int, product: Product, db: Session = Depends(init_db)):
    # for i in range(len(products)):
    #     if(products[i].id == id):
    #         products[i] = product
    #         return product
    db_product = db.query(db_models.Product).filter(db_models.Product.id == id).first()
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        return "Product Updated"
    else:
        return "did not find product with id {id}"

@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(init_db)):
    # for p in products:
    #     if(p.id == id):
    #         products.remove(p)
    #         return p

    db_product = db.query(db_models.Product).filter(db_models.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    else:
        return "did not find a product with id {id}"