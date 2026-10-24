import Layout from '@/Layout';
import ProductForm from '@/components/productform/ProductForm';
import ProductTable from '@/components/producttable/ProductTable';
import Summary from '@/components/summary/Summary';
import './App.css';

function App() {
    return (
        <>
            <Layout>
                <Summary/>
                <ProductForm />
                <ProductTable/>
            </Layout>
        </>
    );
}

export default App;
