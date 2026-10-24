from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import db_models
from dbconfig import engine, session
from models.models import Product
from sqlalchemy.orm import Session

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["*"])

db_models.Base.metadata.create_all(bind=engine)

@app.get("/")
def greet():
    return "Welcome to my first fastapi project"

products = [
    Product(id="1", name="phone", description="A smartphone", price="99.99", quantity="50"),
    Product(id="2", name="laptop", description="A powerful laptop", price="699.99", quantity="10"),
    Product(id="3", name="camera", description="A dslr camera", price="399.99", quantity="35"),
    Product(id="4", name="book", description="a self help books", price="9.99", quantity="150"),
]

# def init_db():
#     db = session()
#     count = db.query(db_models.Product).count

#     if count == 0:
#         for p in products:
#             db.add(db_models.Product(**p.model_dump()))

#         db.commit()

# init_db()

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
    # for p in products:
    #     if p.id == id:
    #         return p
    db_product = db.query(db_models.Product).filter(db_models.Product.id == id).first()
    if db_product:
        return db_product
        
    return "product not found"
    
@app.post("/product")
def add_product(product: Product, db: Session = Depends(init_db)):
    print("product:", product)
    # products.append(product)

    db.add(db_models.Product(**product.model_dump()))
    db.commit()
    return product

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