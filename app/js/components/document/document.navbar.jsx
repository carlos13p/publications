import React, {Component, PropTypes} from 'react';
import AboutButton from '../ui/about.button'

export default class DocumentNavbar extends Component {
  render() {
    return (
      <div className="navbar-container">
        <div className="navbar-controls-left">
          <AboutButton />
          <button className="button" onClick={this.props.save}>Save</button>
          <button className="button" onClick={this.props.downloadPdf}>PDF</button>
          <button className="button" onClick={this.props.viewAllDocuments}>All Documents</button>
        </div>
        <div className="navbar-controls-right">
          <button className="button button-icon" onClick={this.props.changeZoom.bind(this, 'zoom-in')}>
            <span className="icon icon-zoom-in"></span>
          </button>
          <span className="button-label">{this.props.zoom * 100}%</span>
          <button className="button button-icon" onClick={this.props.changeZoom.bind(this, 'zoom-out')}>
            <span className="icon icon-zoom-out"></span>
          </button>
          <div className="spacer"></div>
          <button disabled={!this.props.selectedShape} className="button button-icon" onClick={this.props.clipboardAction.bind(this, 'cut')}>
            <span className="icon icon-cut"></span>
          </button>
          <button disabled={!this.props.selectedShape} className="button button-icon" onClick={this.props.clipboardAction.bind(this, 'copy')}>
            <span className="icon icon-copy"></span>
          </button>
          <button disabled={!this.props.clipboard} className="button button-icon" onClick={this.props.clipboardAction.bind(this, 'paste')}>
            <span className="icon icon-paste"></span>
          </button>
          <button disabled={!this.props.selectedShape} className="button button-icon" onClick={this.props.clipboardAction.bind(this, 'delete')}>
            <span className="icon icon-delete"></span>
          </button>
          <div className="spacer"></div>
          <button className="button button-icon" onClick={this.props.toggleInspector}>
            <span className={`icon icon-inspector ${this.props.showInspector ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>
    );
  }
}
