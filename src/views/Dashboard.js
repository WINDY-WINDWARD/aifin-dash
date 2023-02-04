import React from "react";
import Plot from "react-plotly.js";
import ChartistGraph from "react-chartist";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";




function Dashboard() {

  const [data, setData] = useState({});
  const [PortfolioGraph, setPortfolioGraph] = useState({});
  const [PortfolioPie, setPortfolioPie] = useState({});
  const [DailyBar, setDailyBar] = useState({});


  async function getPortfolioGraph() {
    const response = await axios.get('/load/graph/portfolio');
    setPortfolioGraph(response.data);
  }

  async function getDailyBar() {
    const response = await axios.get('/load/graph/returns');
    setDailyBar(response.data);
  }

  async function getPortfolioPie() {
    const response = await axios.get('/load/graph/pie');
    setPortfolioPie(response.data);
  }

  async function fetchMyAPI() {
    const response = await axios.get('/load/account/dash');
    setData(response.data);
  }

  useEffect(() => {
    fetchMyAPI();
    getPortfolioGraph();
    getPortfolioPie();
    getDailyBar();
  }, []);


  console.log(PortfolioGraph.layout);

  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-between">
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chart text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Portfolio Value</p>
                      <Card.Title as="h4">{data.pfv} ₹</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update Now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                    <i class="fas fa-chart-line"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Daily PnL</p>
                      <Card.Title as="h4">{data.lastPnl} %</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Last day
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Assets</p>
                      <Card.Title as="h4">{data.assetsHeld}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>

                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Portfolio Behavior</Card.Title>
                <p className="card-category">past performance</p>
              </Card.Header>
              <Card.Body>
                <Plot data={DailyBar.data} layout={DailyBar.layout} className="col-12" />
              </Card.Body>
              <Card.Footer>
                <div className="legend">
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated 3 minutes ago
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Portfolio Statistics</Card.Title>
                <p className="card-category">Last Rebalance Performance</p>
              </Card.Header>
              <Card.Body>
                <Plot data={PortfolioPie.data} layout={PortfolioPie.layout} className="col-12" />

                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock"></i>
                  Portfolio Rebalance 2 days ago
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Portfolio Behavior</Card.Title>
                <p className="card-category">past performance</p>
              </Card.Header>
              <Card.Body>
                <Plot data={PortfolioGraph.data} layout={PortfolioGraph.layout} className="col-12" />
              </Card.Body>
              <Card.Footer>
                <div className="legend">
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated 3 minutes ago
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
