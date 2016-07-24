import React from "react";
import TrackListItem from "javascript/tracklistitem";
import _ from "lodash";
import css from "sass/tracklist";

const TrackList = React.createClass({
  componentWillMount() {
    this.tracks = _.sortBy(_.toArray(this.props.tracks), track => track.name);
  },
  componentWillUpdate(newProps, newState) {
    const filter = newState.filter;
    this.tracks = _.sortBy(_.filter(newProps.tracks, track => {
      if (filter === "") return true;
      var f = track.fileName.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      return f;
    }), track => track.name);
  },
  propTypes: {
    onTrackSave: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      onTrackSave: _.noop
    };
  },
  getInitialState() {
    return {
      filter: ""
    };
  },
  setFilter(filter) {
    this.setState({filter});
  },
  render() {
    return (<div>
        Haku: <input size="50" value={this.state.filter} onChange={event => this.setFilter(event.target.value)} />
        <div className={css.tracklist}>
          {_.map(this.tracks, track => <TrackListItem key={track.id} track={track} onSave={(newTrack) => this.props.onTrackSave(newTrack)} />)}
        </div>
      </div>
    );
  }
});
export default TrackList;
