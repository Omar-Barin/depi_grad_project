import { useState } from 'react';
import Layout from '@/Layout';
import AlertsBanner from '@/components/alerts/AlertsBanner';
import ProductForm from '@/components/productform/ProductForm';
import ProductTable from '@/components/producttable/ProductTable';
import Summary from '@/components/summary/Summary';
import './App.css';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <Layout>
            <AlertsBanner refreshKey={refreshTrigger} />
            <Summary onRefresh={triggerRefresh} />
            <ProductForm />
            <ProductTable />
        </Layout>
    );
}

export default App;
