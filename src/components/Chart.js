import React from "react";
import Chart from "chart.js/auto";
import axios from "axios";

class Graph extends React.Component {
  state = {
    chartLabels: [],
    chartValues: [],
    companySymbol: "MSFT",
    chart: null,
  };

  componentDidMount = async () => {
    try {
      this.getChartData();
    } catch (err) {
      console.error(err);
    }

    // axios
    //   .get(
    //     "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo"
    //   )
    //   .then((response) => {
    //     const obj = { ...response.data["Time Series (Daily)"] };
    //     const chartLabelsClone = [...this.state.chartLabels];
    //     const chartValuesClone = [...this.state.chartValues];

    //     for (let key in obj) {
    //       chartLabelsClone.push(key);
    //       chartValuesClone.push(obj[key]["4. close"]);
    //     }

    //     chartLabelsClone.reverse();
    //     chartValuesClone.reverse();

    //     this.setState({
    //       chartLabels: [...chartLabelsClone],
    //       chartValues: [...chartValuesClone],
    //     });
    //   })
    //   .catch((err) => console.error(err));
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.chartLabels !== this.state.chartLabels) {
      this.renderChart();
    }
  };

  handleChange = (event) => {
    this.setState({ companySymbol: event.target.value });
  };

  getChartData = async () => {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.companySymbol}&apikey=demo`
    );

    this.transformData(response.data);
  };

  transformData = (data) => {
    const obj = { ...data["Time Series (Daily)"] };
    const chartLabelsClone = [];
    const chartValuesClone = [];

    for (let key in obj) {
      chartLabelsClone.push(key);
      chartValuesClone.push(obj[key]["4. close"]);
    }

    chartLabelsClone.reverse();
    chartValuesClone.reverse();

    this.setState({
      chartLabels: [...chartLabelsClone],
      chartValues: [...chartValuesClone],
    });
  };

  renderChart = () => {
    if (this.state.chart) {
      this.state.chart.destroy();
    }
    const chart = new Chart(document.getElementById("myCanvas"), {
      type: "line",
      data: {
        labels: this.state.chartLabels,
        datasets: [
          {
            label: `Preço de fechamento $${this.state.companySymbol}`,
            data: this.state.chartValues,
            borderColor: "#0330fc",
            backgroundColor: "#03b1fc",
            fill: true,
          },
        ],
      },
    });

    this.setState({ chart: chart });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <label htmlFor="companySymbolInput">Empresa</label>
        <div className=" input-group mb-3 w-25">
          <input
            id="companySymbolInput"
            className="form-control"
            onChange={this.handleChange}
            value={this.state.companySymbol}
          />
          <button
            className="btn btn-primary"
            onClick={() => this.getChartData()}
          >
            Filtrar
          </button>
        </div>
        <canvas id="myCanvas"></canvas>
      </div>
    );
  }
}

export default Graph;
