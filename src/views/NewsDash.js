import React from "react";
import Plot from "react-plotly.js";

// react-bootstrap components
import {
    Button,
    Card,
    Container,
    Row,
    Col,
    Form
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function NewsDash() {
    const [newsData, setNewsData] = useState([]);
    const [sentimentData, setSentimentData] = useState({});

    async function getNewsData() {
        const response = await axios.get('/load/newsfeed');
        setNewsData(response.data);
    }

    async function getSentimentData() {
        const response = await axios.get('/load/newsfeed/sentimentGraph');
        setSentimentData(response.data);
    }

    useEffect(() => {
        getNewsData();
        getSentimentData();
    }, []);

    return (
        <>
            <Container fluid>
                <Row>
                    <Col md="7">
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">News Feed</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-full-width table-responsive">
                                    <table className="table">
                                        <tbody>
                                            {newsData.map((news) => (
                                                <tr key={news.id}>
                                                    <td style={{"width":"50%"}} className="text-justify">
                                                        <a href={news.Link}
                                                            className="text-primary"
                                                            target="_blank"
                                                            rel="noopener noreferrer">
                                                            {news.Title}
                                                        </a>
                                                    </td>
                                                    {/* add news.sentiment */}
                                                    <td className="text-right text-danger">
                                                        {news.sentiment}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="5">
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">Market Sentiments</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Plot data={sentimentData.data} layout={sentimentData.layout} style={{"width":"100%"}} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );

}

export default NewsDash;