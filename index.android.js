/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  TouchableElement,
  TextInput,
} from 'react-native';

var timeago = require("./timeago");

var MOCKED_JOBS_DATA = [
  { title: 'First job', patientId: 'Amar', urgency: 3 },
];

var sectionsMetadata = {
  1: { label: "High", style: (s) => s.priorityHigh },
  2: { label: "Medium", style: (s) => s.priorityMedium },
  3: { label: "Low", style: (s) => s.priorityLow },
}

var NavigationBarRouteMapper = {
  Title(route, navigator, index, navState) {
    return (
      <View style={navstyles.navBarTitleContainer}>
        <Text style={[navstyles.navBarText, navstyles.navBarTitleText]}>
          {route.title}
        </Text>
      </View>
    );
  },
  LeftButton(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    // var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={navstyles.navBarLeftButton}>
        <Text style={navstyles.navBarText}>Back</Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  }
};


class BanishTheBleep extends Component {
  render() {
    var job = MOCKED_JOBS_DATA[0];
    return (
      <Navigator
        style={{ flex:1 }}
        initialRoute={{
          name: "Your jobs",
          title: "Your jobs",
        }}
        renderScene={ this.renderScene }
        navigationBar={ <Navigator.NavigationBar
    style={navstyles.navBar}
    routeMapper={NavigationBarRouteMapper} /> }
      />
    );
  }

  renderScene(route, navigator) {
     if(route.name == 'Your jobs') {
       return <JobsView navigator={navigator} />
     }
     if(route.name == 'View job') {
       return <ViewJobView navigator={navigator} {...route.passProps} />
     }
  }

}


class JobsView extends Component {
    constructor(props) {
      super(props);
      this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          sectionHeaderHasChanged: (r1, r2) => r1 != r2
        }),
        loaded: false
      };
    }

    componentDidMount() {
      this.fetchData();
      this.theTimer = setInterval(() => this.fetchData(), 1000);
    }

    componentWillUnmount(){
      clearInterval(this.theTimer);
    }

    fetchData() {
      fetch("https://powerful-dawn-95782.herokuapp.com/job/read")
        .then((responseData) => responseData.json())
        .then((responseData) => {
          var jobs = responseData.jobs;
          var { data, sectionIds } = this.splitDataIntoSections(jobs);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(data),
            loaded: true
          });
          
        })
        .done();
      // var seedDate = new Date();
      // var MOCKED_JOBS_DATA = [
      //   { creator_comment: 'First job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'Amar', urgency: 3
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 09:44:44 GMT" },
      //   { creator_comment: 'Second job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'Sam', urgency: 1
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 08:44:44 GMT" },
      //   { creator_comment: 'Third job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'Alice', urgency: 2
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 09:35:44 GMT"  },
      //   { creator_comment: 'Fourth job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'Sebastiano', urgency: 3
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 09:31:44 GMT"  },
      //   { creator_comment: 'Fifth job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'Dave', urgency: 1
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 09:28:44 GMT" },
      //   { creator_comment: 'Sizth job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'John', urgency: 3
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 09:32:44 GMT"  },
      //   { creator_comment: 'Seventh job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'Tim', urgency: 3
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 09:20:44 GMT"  },
      //   { creator_comment: 'Eighth job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'Mark', urgency: 3
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 09:13:44 GMT" },
      //   { creator_comment: 'Ninth job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'Mark', urgency: 2
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 09:02:44 GMT"  },
      //   { creator_comment: 'Tenth job comment. There is some long text here which we will need to trim off', 
      //         patient_id: 'Mark', urgency: 1
      //         , bed: "bed", ward: "ward", creator_name: "nurse name", created_at: "Sun, 15 May 2016 08:53:44 GMT"  },
      // ];
      // setTimeout(() => {

      //   var { data, sectionIds } = this.splitDataIntoSections(MOCKED_JOBS_DATA);

      //   this.setState({
      //     dataSource: this.state.dataSource.cloneWithRowsAndSections(data),
      //     loaded: true
      //   })
      // }, 1000);

    }

    splitDataIntoSections(jobs) {
      var sortedJobs = jobs.sort((a, b) => { return a.urgency - b.urgency });

      var sectionIds = [];
      var data = {};

      sortedJobs.forEach((job) => {
        var section = job.urgency;
        if (sectionIds.indexOf(section) === -1) {
          sectionIds.push(section);
          data[section] = []
        }
        job.timestamp = new Date(job.created_at);
        data[section].push(job);
      });

      sectionIds.forEach((section) => {
        var sectionJobs = data[section];
        sectionJobs.sort((a, b) => a.timestamp - b.timestamp);
        data[section] = sectionJobs;
      });

      //TODO: Sort by time as well!
      return { data, sectionIds };
    }

    render() {
      if (!this.state.loaded) {
        return this.renderLoadingView();
      }

      return (
        
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderJob.bind(this)}
            renderSectionHeader={this.renderSectionHeader}
            style={styles.listView}
          />
        
        
      )
    }
    
    renderSectionHeader(data, sectionId) {
      var metaData = sectionsMetadata[sectionId];
      var style = metaData.style(styles);
      return (
        <View style={style}>
          <View style={styles.sectionHeaderInner}>
            <Text style={styles.sectionHeaderText}>{metaData.label}</Text>
          </View>
        </View>
      );
    }

    renderLoadingView() {
      return (
        <View style={styles.container}>
          <Text> Loading jobs... </Text>
        </View>
      ); 
    }

    renderJob(job, sectionId, rowId) {
      var rowColours = [ "#F0F0F0", "#fff" ];
      var rc = rowColours[rowId % rowColours.length]
      var rowStyle = [
        styles.rightContainer,
        {
          'backgroundColor': rc,
          paddingTop: 10,
          paddingBottom: 10,
        }
      ];

      var ackStyle = {};
      if (job.acknowledged != undefined && job.acknowledged != null){
        ackStyle['backgroundColor'] = "#000";
      }

      var timeDistance = timeago.time_ago_in_words(job.timestamp);
      var jobDescription = job.creator_comment.substring(0, 40) + "...";
      var patientLocation = job.ward + "." + job.bed;
      return (
        <TouchableHighlight onPress={ () => this.doNavigate(job) } >
          <View key={job.key} style={[styles.container, { backgroundColor: rc }]}>

            <View style={[styles.acknowledgement, ackStyle]} />

            <View style={rowStyle}>
              <Text style={styles.title}>{jobDescription}</Text>
              <View style={styles.jobRowBottom}>
                <Text style={styles.patientLocation}>{patientLocation}</Text>
                <Text style={styles.patientName}>{job.patient_id}</Text>
                <Text style={styles.jobRelativeTime}>{timeDistance}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      );
    }

    doNavigate(job){
      this.props.navigator.push({
        name: "View job",
        title: "Job details",
        passProps: {
          job: job
        }
      });
    }
}

class ViewJobView extends Component {
  render(){
    var job = this.props.job;
    var urgencyMeta = sectionsMetadata[job.urgency];
    var urgencyStyle = urgencyMeta.style(styles);
    return (
      <View style={styles.viewJobContainer}>
        <View style={styles.jobDetailRow}>
          <Text style={{fontWeight: 'bold'}}>{job.ward}.{job.bed}</Text>
          <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>{job.patient_id}</Text>
        </View>

        <View style={[styles.jobDetailRow, urgencyStyle, styles.urgencyRow]}>
          <Text style={styles.jobDetailTitle}>Priority:</Text>
          <Text>{urgencyMeta.label}</Text>
        </View>

        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailTitle}>By:</Text>
          <Text>{job.creator_name} @ {job.created_at}</Text>
        </View>

        <View style={[styles.jobDetailRow, {flexDirection: 'column'}]}>
          <Text style={styles.jobDetailTitle}>Job:</Text>
          <Text>{job.creator_comment}</Text>
        </View>

        <View style={[styles.jobDetailRow, { justifyContent: 'center', marginTop: 15, marginBottom: 15 }]}>
          <TouchableHighlight onPress={this._onAcknowledge.bind(this, job.id)}>
            <View style={styles.fakeButton}>
                <Text style={styles.fakeButtonText}>Acknowledge</Text>
            </View>
          </TouchableHighlight>

          <View style={styles.fakeButton}>
            <Text style={styles.fakeButtonText}>Reassign</Text>
          </View>

          <TouchableHighlight onPress={this._onDone.bind(this, job.id)}>
            <View style={styles.fakeButton}>
              <Text style={styles.fakeButtonText}>Done</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={[styles.jobDetailRow, { flexDirection: 'column', justifyContent: 'center', marginTop: 15, marginBottom: 15 }]}>
          <View style={{height: 80, borderColor: 'gray', borderWidth: 1, flex: 1 }}>
            <TextInput
              style={{height: 80, borderColor: 'gray', borderWidth: 1, flex: 1 }} multiline={true} />
          </View>

          <View style={[styles.replyButton]}>
            <Text style={[styles.fakeButtonText]}>Reply</Text>
          </View>

        </View>


      </View>
    );
  }

  _onAcknowledge(id){
    this._doPost(id, {
        acknowledged: true
    });
  }
  _onDone(id){
    this._doPost(id, {
        done: true
    });
  }

  _doPost(id, params){
    var formData = new FormData();

    for (var k in params) {
        formData.append(k, params[k]);
    }

    var request = {
        method: 'POST',
        body: formData
    };

    var url = 'https://powerful-dawn-95782.herokuapp.com/job/update/' + id;
    fetch(url, request).then(() => console.log("posted"));    

  }
}

var styles = StyleSheet.create({
  fakeButton: {
    backgroundColor: "#000",
    marginBottom: 7,
    padding: 10,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  replyButton: {
    backgroundColor: "#000",
    marginTop: 10,
    padding: 10,
    marginLeft: 190,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  fakeButtonText: {
    textAlign: 'center',
    color: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    //backgroundColor: '#F5FCFF',
  },
  jobDetailRow: {
    // flex: 1,
    flexDirection: 'row',
    //backgroundColor: '#F5FCFF',
    marginBottom: 10
  },
  jobDetailTitle: {
    fontWeight: 'bold',
    marginRight: 6
  },
  urgencyRow: {
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 9
  },
  viewJobContainer: {
    // flexDirection: 'row',
    flex: 1,
    marginTop: 44,
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
  },
  acknowledgement: {
    width: 20,
    height: 20,
    borderRadius: 100/2,
    //backgroundColor: 'red',
    borderColor: 'black',
    borderWidth: 2,
    marginTop: 20,
    marginLeft: 4
  },
  nav: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FF0000'
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 4
  },
  jobRowBottom: {
    flex: 1,
    flexDirection: "row"
  },
  patientLocation: {
    fontWeight: 'bold'
  },
  jobRelativeTime: {
    flex: 1,
    textAlign: "right",
    marginRight: 4
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'left',
  }, 
  patientName: {
    textAlign: 'left',
    marginLeft: 6
  },
  listView: {
    flex: 1,
    marginTop: 44,
    paddingBottom: 44,
    backgroundColor: '#F5FCFF',
  },

  priorityHigh: {
    backgroundColor: '#F35B04'
  },

  priorityMedium: {
    backgroundColor: '#F18701'
  },

  priorityLow: {
    backgroundColor: '#F7B801'
  },

  sectionHeaderText: {
    fontFamily: 'AvenirNext-Medium',
    fontSize: 16,
    color: 'white'
  },

  sectionHeaderInner: {
    flex: 1,
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 5
  },
});



var navstyles = StyleSheet.create({
  navBar: {
    backgroundColor: "#c9e4e3",
    height: 44
  },
  navBarText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 19
  },
  navBarTitleContainer: {
    alignSelf: 'center',
    paddingRight: 74
  },
  navBarTitleText: {
    textAlign: 'center'
  },
  navBarLeftButton: {
    paddingLeft: 10,
    marginTop: 4
  },
  navBarRightButton: {
    paddingRight: 10,
  }
});







AppRegistry.registerComponent('BanishTheBleep', () => BanishTheBleep);
