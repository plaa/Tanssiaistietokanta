import React from "react";
import createClass from "create-react-class";
import TrackPropertyEditor from "./widgets/trackPropertyEditor";
import _ from "lodash";
import "./infoTables.sass";

function length(secs) {
  if (!secs) return "0:00";
  const length = Math.round(secs);
  const sec = length%60;
  const min = (length-sec)/60;
  return min+":"+(sec < 10 ? "0"+sec : sec);
}

const PlaylistTimingTool = createClass({
  getInitialState() {
    return {
      biisiTauko: 3,
      settiTauko: 15,
    };
  },
  renderPart({name, tracks}) {
    const onSave = this.props.onTrackSave;

    function renderTrack(track, index) {
      const editorProps = {
        addText: "muokkaa",
        onSave, track
      };
      return (<tr key={index}>
        <td> 
          <TrackPropertyEditor property="name" {...editorProps} />
        </td>
        <td> 
          <TrackPropertyEditor property="info.description" {...editorProps} />
        </td>
        <td> 
          <TrackPropertyEditor property="info.prelude" {...editorProps} />
        </td>
        <td> 
          <TrackPropertyEditor property="info.teachingSet" {...editorProps} />
        </td>
        <td>{length(track.length)}</td>
      </tr>);
    }
    const total = _.sumBy(tracks, track => track.length) || 0;
    const totalWithPauses = total + 
      (tracks.length - 1) * this.state.biisiTauko*60 +
      this.state.settiTauko*60;
    return <React.Fragment key={name}>
        <h2>{name} ({tracks.length} tanssia)</h2>
        <table className="infoTable">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Kuvaus</th>
              <th>Alkusoitto</th>
              <th>Opetettu missä?</th>
              <th>Kesto</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map(renderTrack)}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="4">Yhteensä</th>
              <th>{length(total)}</th>
            </tr>
            <tr>
              <th colSpan="4">Yhteensä taukoineen</th>
              <th>{length(totalWithPauses)}</th>
            </tr>
          </tfoot>
        </table>
      </React.Fragment>;
  },
  render() {
    return <div>
      <div class="toolbar">
        Biisitauko:&nbsp;
        <input type="number" min="0" max="99" 
          value={this.state.biisiTauko} 
          onChange={(e) => this.setState({biisiTauko: e.target.value})} />&nbsp;
        Settitauko: &nbsp;
        <input type="number" min="0" max="99" 
          value={this.state.settiTauko} 
          onChange={(e) => this.setState({settiTauko: e.target.value})} />
      </div>
      {this.props.playlist.map(this.renderPart)}
    </div>;
  }
});

export default PlaylistTimingTool;