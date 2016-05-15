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
    }

    fetchData() {
      // fetch("http://blah/jobs/{doctorId}")
      //   .then((responseData) => {
      //     this.setState({
      //       jobs: responseData.jobs,
      //     });
      //   })
      //   .done();
      var seedDate = new Date();
      var MOCKED_JOBS_DATA = [
        { creator_comment: 'First job comment. There is some long text here which we will need to trim off', 
              patient_id: 'Amar', urgency: 3
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 09:44:44 GMT" },
        { creator_comment: 'Second job comment. There is some long text here which we will need to trim off', 
              patient_id: 'Sam', urgency: 1
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 08:44:44 GMT" },
        { creator_comment: 'Third job comment. There is some long text here which we will need to trim off', 
              patient_id: 'Alice', urgency: 2
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 09:35:44 GMT"  },
        { creator_comment: 'Fourth job comment. There is some long text here which we will need to trim off', 
              patient_id: 'Sebastiano', urgency: 3
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 09:31:44 GMT"  },
        { creator_comment: 'Fifth job comment. There is some long text here which we will need to trim off', 
              patient_id: 'Dave', urgency: 1
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 09:28:44 GMT" },
        { creator_comment: 'Sizth job comment. There is some long text here which we will need to trim off', 
              patient_id: 'John', urgency: 3
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 09:32:44 GMT"  },
        { creator_comment: 'Seventh job comment. There is some long text here which we will need to trim off', 
              patient_id: 'Tim', urgency: 3
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 09:20:44 GMT"  },
        { creator_comment: 'Eighth job comment. There is some long text here which we will need to trim off', 
              patient_id: 'Mark', urgency: 3
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 09:13:44 GMT" },
        { creator_comment: 'Ninth job comment. There is some long text here which we will need to trim off', 
              patient_id: 'Mark', urgency: 2
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 09:02:44 GMT"  },
        { creator_comment: 'Tenth job comment. There is some long text here which we will need to trim off', 
              patient_id: 'Mark', urgency: 1
              , bed: "bed", ward: "ward", created_at: "Sun, 15 May 2016 08:53:44 GMT"  },
      ];
      setTimeout(() => {

        var { data, sectionIds } = this.splitDataIntoSections(MOCKED_JOBS_DATA);

        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(data),
          loaded: true
        })
      }, 1000);

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

    renderJob(job) {
      var timeDistance = timeago.time_ago_in_words(job.timestamp);
      var jobDescription = job.creator_comment.substring(0, 30) + "...";
      var patientLocation = job.ward + "." + job.bed;
      return (
        <TouchableHighlight onPress={ () => this.doNavigate(job) } >
          <View key={job.key} style={styles.container}>
            <View style={styles.rightContainer}>
              <Text style={styles.title}>{jobDescription}</Text>
              <Text style={styles.patientName}>{patientLocation}</Text>
              <Text style={styles.patientName}>{timeDistance}</Text>
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
    return (
      <View style={styles.viewJobContainer}>
        <Text>Job Details</Text>
        <Text>Title: {this.props.job.title}</Text>
        <Text>Patient: {this.props.job.patient}</Text>
        <Text>Priority: {this.props.job.urgency}</Text>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  viewJobContainer: {
    // flexDirection: 'row',
    flex: 1,
    marginTop: 44
  },
  nav: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FF0000'
  },
  rightContainer: {
    flex: 1
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  }, 
  patientName: {
    textAlign: 'center',
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
