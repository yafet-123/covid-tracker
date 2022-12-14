import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from "react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { sortData, prettyPrintStat } from "../components/util";
// import Map from "../components/Map";
import InfoBox from "../components/InfoBox";
import numeral from "numeral";
import LineGraph from "../components/LineGraph";
import Table from "../components/Table";

export default function Home() {
    const [country, setInputCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [countries, setCountries] = useState([]);
    const [mapCountries, setMapCountries] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country,
                        value: country.countryInfo.iso2,
                    }));
                let sortedData = sortData(data);
                setCountries(countries);
                setMapCountries(data);
                setTableData(sortedData);
            });
        };

        getCountriesData();
    }, []);

    const onCountryChange = async (e) => {
        const countryCode = e.target.value;

        const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all"
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url).then((response) => response.json())
            .then((data) => {
                setInputCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };

    return (
        <div className="">
            <div className="app__left">
                <div className="app__header">
                    <h1>COVID-19 Tracker</h1>
                    <FormControl >
                        <Select
                            variant="outlined"
                            value={country}
                            onChange={onCountryChange}
                            className="app__dropdown"
                        >
                            <MenuItem value="worldwide">Worldwide</MenuItem>
                            {countries.map((country,index) => (
                                <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className="app__stats">
                    <InfoBox
                        onClick={(e) => setCasesType("cases")}
                        title="Coronavirus Cases"
                        isRed={casesType != "cases" }
                        active={casesType === "cases" }
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={numeral(countryInfo.cases).format("0.0a")}
                    />
                    <InfoBox
                        onClick={(e) => setCasesType("recovered")}
                        title="Recovered"
                        isRed={casesType != "recovered"}
                        active={casesType === "recovered"}
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={numeral(countryInfo.recovered).format("0.0a")}
                    />
                    <InfoBox
                        onClick={(e) => setCasesType("deaths")}
                        title="Deaths"
                        isRed={casesType != "deaths"}
                        active={casesType === "deaths"}
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={numeral(countryInfo.deaths).format("0.0a")}
                    />
                </div>
                
            </div>

            <Card className="app__right">
                <CardContent>
                    <div className="app__information">
                        <h3>Live Cases by Country</h3>
                        <Table countries={tableData} />
                        <h3>Worldwide new {casesType}</h3>
                        <LineGraph casesType={casesType} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
