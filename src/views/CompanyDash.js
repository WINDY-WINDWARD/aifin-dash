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




function CompanyDash() {

  const [data, setData] = useState({});
  const [newsData, setNewsData] = useState([]);
  const [DailyBar, setDailyBar] = useState({});
  const [CompanyList, setCompanyList] = useState([]);
  const [minData, setMinData] = useState("");
  const [maxData, setMaxData] = useState("");
  const [exchange, setExchange] = useState("NSE");
  const [company, setCompany] = useState("20MICRONS");

  async function getNewsData() {
    // console.log("getNewsData");
    const response = await axios.get('/load/nse/news/' + company);
    // console.log(response.data);
    setNewsData(response.data);
  }

  async function getCompanyList(value = exchange) {
    var response;
    if (value === "Binance") {
      response = await axios.get("/load/binance/pairs")
    }
    else if (value === "NSE") {
      response = await axios.get("/load/nse/pairs")
    }
    setCompanyList(response.data.tickers);
  }

  async function getPortfolioGraph() {
    const response = await axios.get('/load/graph/portfolio');
    setPortfolioGraph(response.data);
  }

  async function getDailyBar(ticker = company) {
    if (exchange === "NSE") {
      const response = await axios.get('/load/nse/data/' + ticker);
      setDailyBar(response.data);
      return;
    }
    else if (exchange === "Binance") {
      const response = await axios.get('/load/binance/data/' + ticker);
      setDailyBar(response.data);
      return;
    }
  }

  async function getPortfolioPie() {
    const response = await axios.get('/load/graph/pie');
    setPortfolioPie(response.data);
  }

  useEffect(() => {
    // getPortfolioGraph();
    getPortfolioPie();
    getDailyBar();
    getCompanyList();
    getNewsData();
    getCompanyData();
  }, []);

  async function getCompanyData(value = company) {
    if (exchange === "NSE") {
      const response = await axios.get('/load/nse/data/' + value + "/all");
      setData(response.data);
    }
    else if (exchange === "Binance") {
      const response = await axios.get('/load/binance/data/' + value + "/all");
      setData(response.data);
    }
    setMinData(data.start_date);
    setMaxData(data.end_date);
    getNewsData();
    getDailyBar();
  }


  async function getDailyBarDate() {
    var stckStart = document.getElementById("stckstart").value;
    var stckEnd = document.getElementById("stckend").value;
    // check if start date is greater than end date
    if (stckStart > stckEnd) {
      alert("Start date cannot be greater than end date");
      return;
    }
    // make api call
    const response = await axios.get('/load/' + exchange.toLowerCase() + '/data/' + company + "/" + stckStart + "/" + stckEnd);
    // console.log(response.data);
    setDailyBar(response.data);
  }


  return (
    <>
      <Container fluid>
        <Row className="d-flex justify-content-between">
          <Col lg="6" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chart text-warning"></i>
                    </div>
                    <Button onClick={() => getCompanyData()}>Get Data</Button>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Select Exchange</p>
                      <Form.Control as="select" onChange={(event) => {
                        getCompanyList(event.target.value);
                        setExchange(event.target.value);
                      }}>
                        <option value="NSE">NSE</option>
                        <option value="Binance">Binance</option>
                      </Form.Control>
                      <p className="card-category">Select Company</p>
                      <Form.Control as="select" onChange={(event) => {
                        getCompanyData(event.target.value);
                        setCompany(event.target.value);
                      }}>
                        {CompanyList.map((company) => (
                          <option value={company}>{company}</option>
                        ))}
                      </Form.Control>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                {/* <hr></hr>
                  <div className="stats">
                    <i className="fas fa-redo mr-1"></i>
                    Update Now
                  </div> */}
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="6" sm="6">
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
                      <p className="card-category">Weekly PnL</p>
                      <Card.Title as="h4">{data.percent_change} %</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer style={{ "padding": "10px" }}>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Last day
                </div>
              </Card.Footer>
            </Card>
          </Col>

        </Row>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Company Price history</Card.Title>
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
            <Card style={{ "height": "95%" }}>
              <Card.Header>
                <Card.Title as="h4">Company Sentiments</Card.Title>
              </Card.Header>
              <Card.Body>
                {newsData.map((news) => (
                  <div style={{ "border": "2px solid black", "padding": "5px" }}>
                    <a href={news.Link}
                      target="_blank"
                      style={{ "color": "blue" }}>
                      <p>{news.Title}</p>
                    </a>
                    <h6>Sentiment</h6>
                    <p className="text-danger">{news.sentiment}</p>
                  </div>
                ))}

              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Chart Behavior</Card.Title>
                <p>start date</p>
                <Form.Control type="date" placeholder={minData} min={minData} max={maxData} id="stckstart"></Form.Control>
                <p>end date</p>
                <Form.Control type="date" placeholder={maxData} min={minData} max={maxData} id="stckend" ></Form.Control>
                <Button variant="primary" onClick={() => { getDailyBarDate(); }}>Update</Button>
              </Card.Header>
              <Card.Body>
                <Plot data={DailyBar.data} layout={DailyBar.layout} className="col-12" style={{ "height": "600px" }} />
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

export default CompanyDash;
