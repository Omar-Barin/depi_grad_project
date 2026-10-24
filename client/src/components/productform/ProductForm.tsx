import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearForm, createProduct, editField, updateProduct } from '@/store/product.slice';
import { Box, Button, ButtonGroup, FormControl, Paper, TextField, Typography } from '@mui/material';

function ProductForm() {
    const dispatch = useAppDispatch();
    const { product, isUpdate } = useAppSelector((state) => state?.products);
    const handleChange = (name: string, value: string | number) => {
        dispatch(editField({ name, value }));
    };
    const submitForm = () => {
        isUpdate ? dispatch(updateProduct({id: product.id!, product}) ) : dispatch(createProduct(product));
    };

    return (
        <Paper sx={{ margin: '2rem 0', padding: '1rem' }}>
            <Typography variant="h5">Add/ Update Product</Typography>
            <Box sx={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
                <FormControl>
                    <TextField
                        id="id"
                        label="Id"
                        name="id"
                        variant="outlined"
                        value={product.id ?? ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        id="name"
                        label="Name"
                        name="name"
                        variant="outlined"
                        value={product.name ?? ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        id="description"
                        name="description"
                        label="Description"
                        variant="outlined"
                        value={product.description ?? ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        id="price"
                        label="Price"
                        name="price"
                        variant="outlined"
                        value={product.price ?? ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        id="quantity"
                        label="Quantity"
                        name="quantity"
                        variant="outlined"
                        value={product.quantity ?? ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                </FormControl>
            </Box>
            <ButtonGroup>
                <Button
                    variant="contained"
                    onClick={() => submitForm()}
                    disabled={!product.name || !product.description || !product.price || !product.quantity}
                >
                    Submit
                </Button>
                <Button
                    onClick={() => dispatch(clearForm())}
                    disabled={!product.name && !product.description && !product.price && !product.quantity}
                >
                    Clear
                </Button>
            </ButtonGroup>
        </Paper>
    );
}

export default ProductForm;
