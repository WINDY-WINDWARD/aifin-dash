import React from "react";
import Plot from "react-plotly.js";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
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

function BackTest() {
  const [data, setData] = useState({});
  const [PortfolioGraph, setPortfolioGraph] = useState({});
  const [PortfolioPie, setPortfolioPie] = useState({});
  const [DailyBar, setDailyBar] = useState({});
  const [CompanyList, setCompanyList] = useState([]);
  const [exchange, setExchange] = useState("NSE");
  const [loading, setLoading] = useState(true);

  window.onload = () => {
    // enable all select boxes
    for (let i = 1; i <= 10; i++) {
      document.getElementById(i).disabled = false;
    }
  }

  async function getCompanyList(value = exchange) {
    var response;
    if (value === "Binance") {
      response = await axios.get("/load/binance/pairs");
    } else if (value === "NSE") {
      response = await axios.get("/load/nse/pairs");
    }
    setCompanyList(response.data.tickers);
  }

  async function getPortfolioGraph() {
    const response = await axios.get("/load/graph/portfolio");
    setPortfolioGraph(response.data);
  }

  async function getDailyBar() {
    const response = await axios.get("/load/graph/returns");
    setDailyBar(response.data);
  }

  async function getPortfolioPie() {
    const response = await axios.get("/load/graph/pie");
    setPortfolioPie(response.data);
  }

  async function fetchMyAPI() {
    const response = await axios.get("/load/account/dash");
    setData(response.data);
  }

  async function generatePrediction() {
    let assets = [];
    setLoading(false);
    for (let i = 1; i <= 10; i++) {
      let asset = document.getElementById(i).value;
      // asset not NONE and not already selected
      if (asset !== "NONE" && !assets.includes(asset)) {
        assets.push(asset);
      } else {
        alert("Please select all assets or select different assets");
        setLoading(true);
        return;
      }
    }
    let initamt = document.getElementById("initamt").value;
    if (initamt < 10000) {
      alert("Please enter initial amount greater than 10000");
      setLoading(true);
      return;
    }

    let prediction = await axios.post(
      "/backtest/generate/predictions/",
      JSON.stringify({ assets: assets, initamt: initamt }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setLoading(prediction.data.predictions);
    // reload component
    window.location.reload();
  }

  async function generateAIprediction() {
    // disable all select boxes
    setLoading(false);
    for (let i = 1; i <= 10; i++) {
      document.getElementById(i).disabled = true;
    }
    let initamt = document.getElementById("initamt").value;
    if (initamt < 10000) {
      alert("Please enter initial amount greater than 10000");
      setLoading(true);
      return;
    }
    let prediction = await axios.get("/backtest/generate/prediction/"+initamt);
    setLoading(prediction.data.predictions);
    // reload component
    window.location.reload();
  }

  async function alterPortfolio() {
    // confirm if user wants to alter portfolio
    if (!window.confirm("Are you sure you want to alter portfolio?")) {
      return;
    }
    const response = await axios.get("/backtest/alter/portfolio");
    // setLoading(response.data);
    if (response.data.status === "true"){
      alert("Portfolio Altered Successfully");
    }
  }

  useEffect(() => {
    fetchMyAPI();
    getPortfolioGraph();
    getPortfolioPie();
    getDailyBar();
    getCompanyList();
  }, []);

  return (
    <>
      <Container fluid>
        {!loading === true && <div>LOADING.....</div>}
        <Row className="d-flex justify-content-between">
          <Col>
            <Card className="card-stats pb-3">
              <Card.Header>
                <Card.Title as="h2">Backtest Parameters</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form.Group>
                  <Form.Label style={{ color: "Black", fontSize: "15px" }}>
                    Initial Investment (minimum 10000)
                  </Form.Label>
                  <input
                    className="form-control"
                    type="number"
                    min="10000"
                    id="initamt"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label style={{ color: "Black", fontSize: "15px" }}>
                    Select Exchange
                  </Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) => {
                      getCompanyList(event.target.value);
                      setExchange(event.target.value);
                    }}
                  >
                    <option value="binance">Binance</option>
                    <option value="nse">NSE</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label style={{ color: "Black", fontSize: "15px" }}>
                    Select Assets
                  </Form.Label>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Form.Control as="select" defaultValue="NONE" id="1">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                    <Form.Control as="select" defaultValue="NONE" id="2">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                    <Form.Control as="select" defaultValue="NONE" id="3">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                    <Form.Control as="select" defaultValue="NONE" id="4">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                    <Form.Control as="select" defaultValue="NONE" id="5">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                    <Form.Control as="select" defaultValue="NONE" id="6">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                    <Form.Control as="select" defaultValue="NONE" id="7">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                    <Form.Control as="select" defaultValue="NONE" id="8">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                    <Form.Control as="select" defaultValue="NONE" id="9">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                    <Form.Control as="select" defaultValue="NONE" id="10">
                      <option value="NONE">Select</option>
                      {CompanyList.map((company) => (
                        <option value={company}>{company}</option>
                      ))}
                    </Form.Control>
                  </div>
                </Form.Group>
                <Form.Group className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    className="mr-3"
                    onClick={generatePrediction}
                  >
                    Generate
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={generateAIprediction}
                  >
                    Let AI select
                  </Button>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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
                      <p className="card-category">Portfolio Final Value</p>
                      <Card.Title as="h4">{data.pfv} ₹</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
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
                      <p className="card-category">AllTime PnL</p>
                      <Card.Title as="h4">{data.lastPnl} %</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
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
                      <p className="card-category">Sharpe</p>
                      <Card.Title as="h4">{data.sharpe}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
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
                <Plot
                  data={DailyBar.data}
                  layout={DailyBar.layout}
                  className="col-12"
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Portfolio Statistics</Card.Title>
                <p className="card-category">Last Rebalance Performance</p>
              </Card.Header>
              <Card.Body>
                <Plot
                  data={PortfolioPie.data}
                  layout={PortfolioPie.layout}
                  className="col-12"
                />
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
                <Plot
                  data={PortfolioGraph.data}
                  layout={PortfolioGraph.layout}
                  className="col-12"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12" style={{"backgroundColor":"white","borderRadius":"20px","textAlign":"center","padding":"15px"}}>
            <div><h3>Clicking the button will alter your running portfolio and is irreversable</h3></div>
            <div><button className="btn btn-danger" onClick={alterPortfolio}>Apply to Portfolio</button></div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BackTest;
