/**
 * <Preview />
 */

import React from "react";
import update from "immutability-helper";
import store from "./stores/store";
import FormElementsEdit from "./form-elements-edit";
import SortableFormElements from "./sortable-form-elements";

const { PlaceHolder } = SortableFormElements;

export const ACTION = {
  UNDO: "undo",
  REDO: "redo",
};

export default class Preview extends React.Component {
  state = {
    data: [],
    answer_data: {},
  };

  constructor(props) {
    super(props);

    const { onLoad, onPost } = props;
    store.setExternalHandler(onLoad, onPost);

    this.editForm = React.createRef();
    this.state = {
      data: props.data || [],
      answer_data: {},
      currentState: [],
      history: [[]],
      index: 0,
    };

    this.seq = 0;

    const onUpdate = this._onChange;
    store.subscribe((state) => onUpdate(state.payload));

    this.getDataById = this.getDataById.bind(this);
    this.moveCard = this.moveCard.bind(this);
    this.insertCard = this.insertCard.bind(this);
    this.setAsChild = this.setAsChild.bind(this);
    this.removeChild = this.removeChild.bind(this);
    this._onDestroy = this._onDestroy.bind(this);
  }

  componentDidMount() {
    const { data, url, saveUrl } = this.props;
    store.dispatch("load", { loadUrl: url, saveUrl, data: data || [] });
    document.addEventListener("mousedown", this.editModeOff);
    window.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.editModeOff);
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  editModeOff = (e) => {
    if (this.editForm.current && !this.editForm.current.contains(e.target)) {
      this.manualEditModeOff();
    }
  };

  updateState = (newState) => {
    let currentStateIndex = this.state.history.length;
    this.setState((current) => {
      return {
        history: [...current.history, [...newState]],
        currentState: newState,
        index: currentStateIndex,
      };
    });
  };

  undo = () => {
    if (this.state.index > 0) {
      this.setState((current) => {
        const index = current.index;
        const history = current.history;

        const newIndex = index - 1;
        const newCurrentState = history[newIndex];

        store.dispatch("update", {
          data: newCurrentState || [],
          action: ACTION.UNDO,
        });

        return {
          index: newIndex,
          currentState: newCurrentState,
        };
      });
    }
  };

  redo = () => {
    if (this.state.index < this.state.history.length - 1) {
      this.setState((current) => {
        const index = current.index;
        const history = current.history;

        const newIndex = index + 1;
        const newCurrentState = history[newIndex];

        store.dispatch("update", {
          data: newCurrentState || [],
          action: ACTION.REDO,
        });

        return {
          index: newIndex,
          currentState: newCurrentState,
        };
      });
    }
  };

  handleKeyPress = (event) => {
    if (event.ctrlKey && event.key === "z") {
      this.undo();
    } else if (event.ctrlKey && event.key === "y") {
      this.redo();
    }
  };

  manualEditModeOff = () => {
    const { editElement } = this.props;
    if (editElement && editElement.dirty) {
      editElement.dirty = false;
      this.updateElement(editElement);
    }
    this.props.manualEditModeOff();
  };

  _setValue(text) {
    return text.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
  }

  updateElement(element) {
    const { data } = this.state;
    let found = false;

    for (let i = 0, len = data.length; i < len; i++) {
      if (element.id === data[i].id) {
        data[i] = element;
        found = true;
        break;
      }
    }

    if (found) {
      this.seq = this.seq > 100000 ? 0 : this.seq + 1;
      store.dispatch("updateOrder", data);
    }
  }

  _onChange = (payload) => {
    const answer_data = {};
    const { data, action } = payload;

    data.forEach((item) => {
      if (item && item.readOnly && this.props.variables[item.variableKey]) {
        answer_data[item.field_name] = this.props.variables[item.variableKey];
      }
    });

    this.setState({
      data,
      answer_data,
    });

    if (action !== ACTION.UNDO && action !== ACTION.REDO) {
      this.updateState(data);
    }

    if (typeof this.props.onChange === "function") {
      this.props.onChange(data);
    }
  };

  _onDestroy(item) {
    if (item.childItems) {
      item.childItems.forEach((x) => {
        const child = this.getDataById(x);
        if (child) {
          store.dispatch("delete", child);
        }
      });
    }
    store.dispatch("delete", item);
  }

  getDataById(id) {
    const { data } = this.state;
    const item = data.find((x) => x && x.id === id);
    return item;
  }

  swapChildren(data, item, child, col) {
    if (child.col !== undefined && item.id !== child.parentId) {
      return false;
    }
    if (
      !(child.col !== undefined && child.col !== col && item.childItems[col])
    ) {
      // No child was assigned yet in both source and target.
      return false;
    }
    const oldId = item.childItems[col];
    const oldItem = this.getDataById(oldId);
    const oldCol = child.col;
    // eslint-disable-next-line no-param-reassign
    item.childItems[oldCol] = oldId;
    oldItem.col = oldCol;
    // eslint-disable-next-line no-param-reassign
    item.childItems[col] = child.id;
    child.col = col;
    store.dispatch("updateOrder", data);
    return true;
  }

  setAsChild(item, child, col) {
    const { data } = this.state;
    if (this.swapChildren(data, item, child, col)) {
      return;
    }
    const oldParent = this.getDataById(child.parentId);
    const oldCol = child.col;
    // eslint-disable-next-line no-param-reassign
    item.childItems[col] = child.id;
    child.col = col;
    // eslint-disable-next-line no-param-reassign
    child.parentId = item.id;
    // eslint-disable-next-line no-param-reassign
    child.parentIndex = data.indexOf(item);
    if (oldParent) {
      oldParent.childItems[oldCol] = null;
    }
    const list = data.filter((x) => x && x.parentId === item.id);
    const toRemove = list.filter((x) => item.childItems.indexOf(x.id) === -1);
    let newData = data;
    if (toRemove.length) {
      newData = data.filter((x) => toRemove.indexOf(x) === -1);
    }
    if (!this.getDataById(child.id)) {
      newData.push(child);
    }
    store.dispatch("updateOrder", newData);
  }

  removeChild(item, col) {
    const { data } = this.state;
    const oldId = item.childItems[col];
    const oldItem = this.getDataById(oldId);
    if (oldItem) {
      const newData = data.filter((x) => x !== oldItem);
      // eslint-disable-next-line no-param-reassign
      item.childItems[col] = null;
      // delete oldItem.parentId;
      this.seq = this.seq > 100000 ? 0 : this.seq + 1;
      store.dispatch("updateOrder", newData);
      this.setState({ data: newData });
    }
  }

  restoreCard(item, id) {
    const { data } = this.state;
    const parent = this.getDataById(item.data.parentId);
    const oldItem = this.getDataById(id);
    if (parent && oldItem) {
      const newIndex = data.indexOf(oldItem);
      const newData = [...data]; // data.filter(x => x !== oldItem);
      // eslint-disable-next-line no-param-reassign
      parent.childItems[oldItem.col] = null;
      delete oldItem.parentId;
      // eslint-disable-next-line no-param-reassign
      delete item.setAsChild;
      // eslint-disable-next-line no-param-reassign
      delete item.parentIndex;
      // eslint-disable-next-line no-param-reassign
      item.index = newIndex;
      this.seq = this.seq > 100000 ? 0 : this.seq + 1;
      store.dispatch("updateOrder", newData);
      this.setState({ data: newData });
    }
  }

  insertCard(item, hoverIndex, id) {
    const { data } = this.state;
    if (id) {
      this.restoreCard(item, id);
    } else {
      data.splice(hoverIndex, 0, item);
      this.saveData(item, hoverIndex, hoverIndex);
    }
  }

  moveCard(dragIndex, hoverIndex) {
    const { data } = this.state;
    const dragCard = data[dragIndex];
    this.saveData(dragCard, dragIndex, hoverIndex);
  }

  // eslint-disable-next-line no-unused-vars
  cardPlaceHolder(dragIndex, hoverIndex) {
    // Dummy
  }

  saveData(dragCard, dragIndex, hoverIndex) {
    const newData = update(this.state, {
      data: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    });
    this.setState(newData);
    store.dispatch("updateOrder", newData.data);
  }

  getElement(item, index) {
    if (item.custom) {
      if (!item.component || typeof item.component !== "function") {
        // eslint-disable-next-line no-param-reassign
        item.component = this.props.registry.get(item.key);
      }
    }
    const SortableFormElement = SortableFormElements[item.element];

    if (SortableFormElement === null) {
      return null;
    }

    return (
      <SortableFormElement
        id={item.id}
        key={item.id}
        seq={this.seq}
        index={index}
        moveCard={this.moveCard}
        insertCard={this.insertCard}
        mutable={false}
        parent={this.props.parent}
        editModeOn={this.props.editModeOn}
        isDraggable={true}
        sortData={item.id}
        data={item}
        getDataById={this.getDataById}
        setAsChild={this.setAsChild}
        removeChild={this.removeChild}
        _onDestroy={this._onDestroy}
        getActiveUserProperties={this.props.getActiveUserProperties}
        getDataSource={(data) => {
          if (data.sourceType === "name") {
            return [
              { id: 1, name: "NameA lastNameA" },
              { id: 2, name: "NameB lastNameB" },
            ];
          }

          if (data.sourceType === "department") {
            return [
              { id: 1, name: "departmentA" },
              { id: 2, name: "departmentB" },
            ];
          }

          if (data.sourceType === "role") {
            return [
              { id: 1, name: "roleA" },
              { id: 2, name: "roleB" },
            ];
          }

          if (data.sourceType === "form") {
            return [
              { id: 1, name: "formA" },
              { id: 2, name: "formB" },
            ];
          }

          return [];
        }}
        onUploadFile={(file) => {
          return `${file.name}-${Math.random() * 10000000}`;
        }}
        onUploadImage={(file) => {
          return `path/${file.name}-${Math.random() * 10000000}`;
        }}
        onDownloadFile={(file) => {
          return `download_${file.name}-${Math.random() * 10000000}`;
        }}
      />
    );
  }

  showEditForm() {
    const handleUpdateElement = (element) => this.updateElement(element);
    handleUpdateElement.bind(this);

    const formElementEditProps = {
      showCorrectColumn: this.props.showCorrectColumn,
      files: this.props.files,
      manualEditModeOff: this.manualEditModeOff,
      preview: this,
      element: this.props.editElement,
      updateElement: handleUpdateElement,
      getFormSource: this.props.getFormSource,
      getFormContent: this.props.getFormContent,
    };

    return this.props.renderEditForm(formElementEditProps);
  }

  render() {
    let classes = this.props.className;
    if (this.props.editMode) {
      classes += " is-editing";
    }
    const data = this.state.data.filter((x) => !!x && !x.parentId);
    const items = data.map((item, index) => this.getElement(item, index));
    return (
      <div
        className={classes}
        style={{ height: "100%", scrollbarWidth: "none" }}
      >
        <div className="preview-toolbar">
          <span
            style={{
              border: "1px solid #ddd",
              padding: 8,
              marginRight: "4px",
              backgroundColor: "#ffffff",
            }}
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "z",
                ctrlKey: true,
              });
              window.dispatchEvent(event);
            }}
          >
            <i class="fas fa-history" style={{ marginRight: 8 }} />
            Undo
          </span>
          <span
            style={{
              border: "1px solid #ddd",
              padding: 8,
              backgroundColor: "#ffffff",
            }}
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "y",
                ctrlKey: true,
              });
              window.dispatchEvent(event);
            }}
          >
            <i className="fas fa-redo" style={{ marginRight: 8 }} />
            Redo
          </span>
        </div>
        <div className="edit-form" ref={this.editForm}>
          {this.props.editElement !== null && this.showEditForm()}
        </div>
        <div className="Sortable">{items}</div>
        <PlaceHolder
          id="form-place-holder"
          show={items.length === 0}
          index={items.length}
          moveCard={this.cardPlaceHolder}
          insertCard={this.insertCard}
        />
      </div>
    );
  }
}

Preview.defaultProps = {
  showCorrectColumn: false,
  files: [],
  editMode: false,
  editElement: null,
  className: "react-form-builder-preview",
  renderEditForm: (props) => <FormElementsEdit {...props} />,
};
