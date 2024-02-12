import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { useSuppliers } from '../features/hooks';
import { RootState } from '../store';
import 'bootstrap/dist/css/bootstrap.min.css';

const EndlessScrollList: React.FC = () => {
    const { fetchSuppliers } = useSuppliers();
    const { suppliers, loading, error, hasMore, next } = useSelector((state: RootState) => {
        return state.suppliers;   
    });

    const suppliersState = useSelector((state: RootState) => state.suppliers )
    const suppliersStateRef = useRef(suppliersState);

    console.log(suppliersState );

    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
          
          const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 20;
          if (isNearBottom && suppliersStateRef.current.hasMore && !suppliersStateRef.current.loading && suppliersStateRef.current.next !== null) {
            // Note: Ensure `next` is obtained correctly here, as it should come from suppliersStateRef.current.next
            fetchSuppliers('', '', suppliersStateRef.current.next);
          }
        }
      };

    useEffect(() => {
        suppliersStateRef.current = suppliersState;
      }, [suppliersState]);


    useEffect(() => {
        // Initial load
        if(suppliers.length < 1) {
            fetchSuppliers('', '', null);
        }

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', ()=>{
                handleScroll();
        });
        }

    }, []);

    return (
        <Container fluid style={{ height: '100vh', overflow: 'auto' }} ref={containerRef}>
            {suppliers.map((supplier, index) => (
                <Row key={supplier.id}>
                    <Col xs={12} md={6} lg={4}>
                        <div className="panel" style={{ textAlign: "left", marginBottom: '20px', background: '#f8f9fa', padding: '20px' }}>
                            <h6>ID: {supplier.id}</h6>
                            <h6>Name: {supplier.name}</h6>
                            <h6>City: {supplier.city}</h6>
                        </div>
                    </Col>
                </Row>
            ))}
            {loading && <p>Loading more suppliers...</p>}
            {error && <p>Error: {error}</p>}
        </Container>
    );
};

export default EndlessScrollList;
