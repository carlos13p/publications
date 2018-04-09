// @flow
import type { PubDocument, PubShape } from "../../util/types";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Toolbar from "../toolbar";
import EditorView from "../editor";
import MetricsBar from "../metrics-bar";
import LayersSidebar from "../layers-sidebar/index";
import OpenDocumentDialog from "../open-document";
import NewDocumentDialog from "../new-document";
import Modal from "../modal";
import to from "await-to-js";
import getOr from "lodash/fp/getOr";
import Api, { clearCsrfHeaders } from "../../util/api";
import { ViewContainer, DocumentView } from "./components";
import { metrics } from "../../util/constants";
import {
  documentsWithEditorState,
  addEditorStateToDocument,
  packageDocumentToJson,
} from "../../util/documents";
import {
  updatedDocumentStateForObjectChanges,
  updatedDocumentStateForLayerChanges,
  updatedDocumentStateForClipboardAction,
  updatedDocumentStateForDeleteAction,
} from "./editor-actions";
import shortid from "shortid";
import { ActionsContext } from "../../contexts";

type Props = {
  user: ?Object,
  setAppUser: (?Object) => void,
};

type State = {
  documents: PubDocument[],
  currentDocument: ?PubDocument,
  selectedObject: ?PubShape,
  clipboardContents: ?PubShape,
  newDocumentModalVisible: boolean,
  openDocumentModalVisible: boolean,
  layersPanelVisible: boolean,
  zoom: number,
};

export default class DocumentsView extends Component<Props, State> {
  static childContextTypes = {
    actions: PropTypes.object,
  };

  state = {
    documents: [],
    currentDocument: null,
    selectedObject: null,
    clipboardContents: null,
    newDocumentModalVisible: false,
    openDocumentModalVisible: false,
    layersPanelVisible: false,
    zoom: 1,
  };

  getChildContext = () => ({
    actions: {
      addObject: this.addObject,
      deleteObject: this.deleteObject,
      handleClipboardAction: this.handleClipboardAction,
      logOut: this.logOut,
      getDocument: this.getDocument,
      saveDocument: this.saveDocument,
      setZoom: this.setZoom,
      showNewDocumentModal: this.toggleNewDocument,
      showOpenDocumentModal: this.toggleOpenDocument,
      toggleLayersPanel: this.toggleLayersPanel,
      updateSelectedObject: this.updateSelectedObject,
      adjustObjectLayer: this.adjustObjectLayer,
    },
  });

  componentDidMount() {
    if (!this.props.user) {
      this.getCurrentUser();
    }
  }

  getActions = () => ({
    addObject: this.addObject,
    deleteObject: this.deleteObject,
    handleClipboardAction: this.handleClipboardAction,
    logOut: this.logOut,
    getDocument: this.getDocument,
    saveDocument: this.saveDocument,
    setZoom: this.setZoom,
    showNewDocumentModal: this.toggleNewDocument,
    showOpenDocumentModal: this.toggleOpenDocument,
    toggleLayersPanel: this.toggleLayersPanel,
    updateSelectedObject: this.updateSelectedObject,
    adjustObjectLayer: this.adjustObjectLayer,
  });

  /**
   * Display Actions
   */

  toggleVisibility = (identifier: string) => {
    const key = `${identifier}Visible`;
    this.setState(prevState => ({
      [key]: !prevState[key],
    }));
  };

  toggleNewDocument = this.toggleVisibility.bind(this, "newDocumentModal");
  toggleOpenDocument = this.toggleVisibility.bind(this, "openDocumentModal");
  toggleLayersPanel = this.toggleVisibility.bind(this, "layersPanel");

  /**
   * Data Actions
   */

  logOut = async () => {
    await to(Api.DELETE("users/logout"));
    clearCsrfHeaders();
    this.props.setAppUser(null);
  };

  getCurrentUser = async () => {
    const [_, user] = await to(Api.GET("users/current"));
    this.props.setAppUser(user || null);
  };

  getDocuments = async () => {
    const [err, documents] = await to(Api.GET("documents"));
    if (err) {
      this.setState({ documents: [] });
      return;
    }
    this.setState({
      documents: documentsWithEditorState(documents),
      selectedObject: null,
    });
  };

  getDocument = async (id: string) => {
    if (!this.props.user) {
      return;
    }
    const [err, doc] = await to(Api.GET(`documents/${id}`));
    if (err) {
      return;
    }
    this.setState({
      currentDocument: addEditorStateToDocument(doc),
      selectedObject: null,
      zoom: 1,
    });
  };

  saveDocument = async () => {
    if (!this.state.currentDocument) {
      return;
    }
    const { id } = this.state.currentDocument;
    const [err] = await to(
      Api.PUT(
        `documents/${id}`,
        packageDocumentToJson(this.state.currentDocument)
      )
    );
    if (err) {
      return;
    }
  };

  /**
   * Editor Actions
   */

  updateSelectedObject = (sender: ?Object) =>
    this.setState(prevState =>
      updatedDocumentStateForObjectChanges(
        sender,
        prevState.selectedObject,
        prevState.currentDocument
      )
    );

  setZoom = (zoom: number = 1) => this.setState({ zoom });

  addObject = (sender: Object) => {
    if (!this.state.currentDocument) {
      return;
    }
    const newObject = {
      ...sender,
      z: this.state.currentDocument.shapes.length + 1,
      id: shortid.generate(),
    };
    this.setState(prevState => ({
      currentDocument: {
        ...prevState.currentDocument,
        shapes: [...getOr([], "currentDocument.shapes")(prevState), newObject],
      },
      selectedObject: newObject,
    }));
  };

  deleteObject = (sender: ?Object) =>
    this.setState(prevState =>
      updatedDocumentStateForDeleteAction(
        sender || prevState.selectedObject,
        prevState.currentDocument
      )
    );

  adjustObjectLayer = (sender: Object) =>
    this.setState(prevState =>
      updatedDocumentStateForLayerChanges(sender, prevState.currentDocument)
    );

  handleClipboardAction = (action: string) =>
    this.setState(prevState =>
      updatedDocumentStateForClipboardAction(action, prevState)
    );

  handleCreateNewDocument = async (sender: {
    name: string,
    orientation: string,
  }) => {
    const payload = {
      name: sender.name,
      ...metrics[sender.orientation],
      shapes: [],
    };
    if (!this.props.user) {
      this.setState({ currentDocument: payload, selectedObject: null });
      return;
    }
    const [err] = await to(Api.POST("documents", payload));
    if (err) {
      return;
    }
    if (this.state.currentDocument) {
      await this.saveDocument();
      this.setState({ currentDocument: payload, selectedObject: null });
    }
  };

  /**
   * Render
   */

  render() {
    return (
      <ActionsContext.Provider value={this.getActions()}>
        <ViewContainer>
          <Modal
            renderContent={
              <OpenDocumentDialog
                documents={this.state.documents}
                getDocuments={this.getDocuments}
                onDismiss={this.toggleOpenDocument}
              />
            }
            visible={this.state.openDocumentModalVisible}
          />
          <Modal
            renderContent={
              <NewDocumentDialog
                onDismiss={this.toggleNewDocument}
                didCreateDocument={this.handleCreateNewDocument}
              />
            }
            visible={this.state.newDocumentModalVisible}
          />
          <Toolbar
            user={this.props.user}
            selectedObject={this.state.selectedObject}
            currentDocument={this.state.currentDocument}
            clipboardContents={this.state.clipboardContents}
            layersPanelVisible={this.state.layersPanelVisible}
            zoom={this.state.zoom}
          />
          <MetricsBar
            shape={this.state.selectedObject}
            updateSelectedObject={this.updateSelectedObject}
          />
          <DocumentView>
            <EditorView
              selectedObject={this.state.selectedObject}
              currentDocument={this.state.currentDocument}
              zoom={this.state.zoom}
            />
            <LayersSidebar
              visible={this.state.layersPanelVisible}
              currentDocument={this.state.currentDocument}
              selectedObject={this.state.selectedObject}
            />
          </DocumentView>
        </ViewContainer>
      </ActionsContext.Provider>
    );
  }
}
