import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';

function App() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState('Pretoria');
    const [unit, setUnit] = useState('C');

    useEffect(() => {
        populateWeatherData(city);
    }, []);

    const handleCityChange = (e) => setCity(e.target.value);

    const handleUnitChange = () => setUnit(unit === 'C' ? 'F' : 'C');//Keeps state even if you refresh the page

    const handleSubmit = (e) => {
        e.preventDefault();
        populateWeatherData(city);
    };

    const handleRefresh = () => populateWeatherData(city);

    async function populateWeatherData(city) {
        setLoading(true);
        try {
            const response = await fetch(`weatherforecast?city=${city}`);
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
        setLoading(false);
    }

    const renderTable = loading ? (
        <Spinner animation="border" role="status">
        </Spinner>
    ) : weather ? (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Location</th>
                    <th>Temperature ({unit})</th>
                    <th>Condition</th>
                    <th>Humidity</th>
                    <th>Wind (Kph)</th>
                    <th>Local Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{weather.location.name}, {weather.location.region}, {weather.location.country}</td>
                    <td>{unit === 'C' ? weather.current.temp_C : weather.current.temp_F}</td>
                    <td>{weather.current.condition.text} <img src={weather.current.condition.icon} alt="weather icon" /></td>
                    <td>{weather.current.humidity}</td>
                    <td>{weather.current.wind_Kph} ({weather.current.wind_Dir})</td>
                    <td>{weather.location.localtime}</td>
                </tr>
            </tbody>
        </Table>
    ) : (
        <p>No weather data available.</p>
    );
    return (
        <Container>
            <Row>
                <Col xs={12} sm={12} lg={12}>
                    <h1>Weather Forecast</h1>
                    <p>This component demonstrates fetching data from the server and displaying it using React Bootstrap.</p>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center mb-3 mt-3">
                <Col xs={12} sm={12} lg={8} >
                    <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                        <Form.Control
                            type="text"
                            value={city}
                            onChange={handleCityChange}
                            placeholder="Enter city"
                            className="mb-3"
                        />
                        <div className="d-flex justify-content-between w-50">
                            <Button variant="primary" type="submit" className="mr-2">
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleRefresh} className="mr-2">
                                Refresh
                            </Button>
                            <Form.Check
                                type="switch"
                                id="unit-switch"
                                onChange={handleUnitChange}
                                checked={unit === 'F'}
                                className="ml-2"
                            />
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} lg={12}>
                    {renderTable}
                </Col>
            </Row>
        </Container>
    );
}

export default App;