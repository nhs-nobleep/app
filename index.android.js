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
} from 'react-native';

var MOCKED_JOBS_DATA = [
  { title: 'First job', patientId: 'Amar', urgency: 3, posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'} },
];


class BanishTheBleep extends Component {
  render() {
    var job = MOCKED_JOBS_DATA[0];
    return (
      <Navigator
        style={{ flex:1 }}
        initialRoute={{
          name: "Your jobs",
        }}
        renderScene={ this.renderScene }
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
          sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
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
      var MOCKED_JOBS_DATA = [
        { title: 'First job', patientId: 'Amar', urgency: 3, posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'} },
        { title: 'Second job', patientId: 'Sam', urgency: 1, posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'} },
        { title: 'Third job', patientId: 'Alice', urgency: 2, posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'} },
        { title: 'Fourth job', patientId: 'Sebastiano', urgency: 3, posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'} },
        { title: 'Fifth job', patientId: 'Dave', urgency: 1, posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'} },
        { title: 'Sizth job', patientId: 'John', urgency: 3, posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'} },
        { title: 'Seventh job', patientId: 'Tim', urgency: 3, posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'} },
        { title: 'Eighth job', patientId: 'Mark', urgency: 3, posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'} },
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

      var sections = {
        1: "High",
        2: "Medium",
        3: "Low",
      }

      sortedJobs.map((job) => {
        var section = sections[job.urgency];
        if (sectionIds.indexOf(section) === -1) {
          sectionIds.push(section);
          data[section] = []
        }
        data[section].push(job);
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
      var text;
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{sectionId}</Text>
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
      return (
        <TouchableHighlight onPress={ () => this.doNavigate(job) } >
          <View key={job.key} style={styles.container}>
            <Image source={{uri: job.posters.thumbnail}} style={styles.thumbnail} />
            <View style={styles.rightContainer}>
              <Text style={styles.title}>{job.title}</Text>
              <Text style={styles.patientName}>{job.patientId}</Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    }

    doNavigate(job){
      this.props.navigator.push({
        name: "View job",
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
    flex: 1
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
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  sectionHeader: {
    backgroundColor: '#48D1CC'
  },
  sectionHeaderText: {
    fontFamily: 'AvenirNext-Medium',
    fontSize: 16,
    color: 'white',
    paddingLeft: 10
  },
});

AppRegistry.registerComponent('BanishTheBleep', () => BanishTheBleep);
