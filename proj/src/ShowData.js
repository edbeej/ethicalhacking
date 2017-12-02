/**
 * Created by beej on 12/2/17.
 */
import firebase, { auth, provider } from './firebase.js';
import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'


class ShowData extends Component {

    componentDidMount() {
        this.getData();
    }

    constructor() {
        super();
        this.state = {
            dataSet: [],
            websiteNames: [],
            websiteData:[],
            websiteSelected: null,
            selected: null,
            collections: null,
            collections2: null,
            loadingData: false
        };
        this.getData = this.getData.bind(this);
        this.select = this.select.bind(this);
    }

    // Function to download data to a file
    download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    compileData(dataSet) {
        console.log("attempting");
        console.log(dataSet);
        const websiteNames = [...new Set(dataSet.map((child) => child[1]))].sort();
        console.log("website names", websiteNames);
        const websiteData = websiteNames.map((website) => []);
        dataSet.map((child) => websiteData[websiteNames.indexOf(child[1])].push([child[2], child[3], child[4]]));
        console.log("AFTER", websiteData);
        this.setState({ loadingData: false, dataSet, websiteData, websiteNames });
        if (this.state.websiteSelected) {
            this.select(this.state.websiteSelected);
        }
    }

    getData() {
        var dataRef= firebase.database().ref('log');
        console.log('in here');
        const dataSet = [];
        var that = this;

        dataRef.on('value', function(snapshot) {
            that.setState({ loadingData : true });
            var fbData = [];
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                fbData.push(childData);
                dataSet.push(childData);
            });
            that.compileData(fbData);
            //that.setState({ loadingData: false, dataSet: fbData });
        });

        console.log('FINAL', dataSet);
        console.log(dataSet.length);
    }

    select(websiteSelected) {
        const { websiteNames, websiteData } = this.state;
        console.log(websiteSelected);

        // let collections = <table><tbody>{
        //     websiteData[websiteNames.indexOf(website)].map((data) => <tr><td>{data[0]}</td><td>{data[1]}</td></tr>)
        // }</tbody></table>;

        let collections = websiteData[websiteNames.indexOf(websiteSelected)].map((data) => ({ username: data[0], password: data[1], time: data[2] }))
        console.log(collections);
        this.setState({ websiteSelected, collections });
    }

    render() {
        const data = [{ Header: "name",
                        columns: this.state.collections }];
        const columns = [{
            Header: 'Username',
            accessor: 'username' // String-based value accessors!
        }, {
            Header: 'Password',
            accessor: 'password',
        }, {
            Header: 'Time Accessed',
            accessor: 'time',
            Cell: props => <span className='number'>{new Date(parseInt(props.value, 10)).toString('MM/dd/yy HH:mm:ss')}</span>
        }];

        const {dataSet, loadingData, websiteNames, websiteData, collections} = this.state

        var websites = websiteNames.map((child) => <li><input onClick={() => this.select(child)} className="webNames" type="button" key={child} value={child} /></li>);

        return (
            <div className='showData'>
                <div className="webButtons">
                { loadingData ? "loading..." : null }
                <ul>
                { websites }
                </ul>
                </div>
                <div className="sitepass">
                    { collections ? <ReactTable
                        data={collections}
                        columns={columns}
                        /> : null }
                </div>

            </div>
        );
    }
}

export default ShowData;