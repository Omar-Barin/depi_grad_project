import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { deleteProduct, fillForm, getProducts } from '@/store/product.slice';
import {
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useEffect } from 'react';

function ProductTable() {
    const dispatch = useAppDispatch();
    const { productList } = useAppSelector((state) => state?.products);

    const handleEdit = (id: number) => {
        dispatch(fillForm({ id }));
    };

    const handleDelete = (id: number) => {
        dispatch(deleteProduct(id));
    };
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productList.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.id}</TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.description}</TableCell>
                                <TableCell>{p.price}</TableCell>
                                <TableCell>{p.quantity}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <ButtonGroup>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => p.id != null && handleEdit(p.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={() => p.id != null && handleDelete(p.id)}
                                        >
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default ProductTable;
