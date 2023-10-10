import React from "react";
import ComponentHeader from "./component-header";
import ComponentLabel from "./component-label";

class DataSource extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();

    const defaultValue = props.defaultValue || {};

    this.state = {
      sourceList: [],
      matchedList: [],
      searchText: defaultValue.value,
      selectedItem: defaultValue.selectedItem,
      defaultSelectedItem: defaultValue.selectedItem,
      isShowingList: false,
      sourceType: props.data.sourceType,
      getDataSource: props.getDataSource,
    };
  }

  async componentDidMount() {
    if (typeof this.props.getDataSource === "function") {
      const data = await this.props.getDataSource(this.props.data);
      this.setState({
        sourceList: data,
        matchedList: data,
      });
    }
  }

  static getDerivedStateFromProps = async (props, state) => {
    console.log("getDerivedStateFromProps ");

    if (
      props.defaultValue &&
      JSON.stringify(props.defaultValue.selectedItem) !==
        JSON.stringify(state.defaultSelectedItem)
    ) {
      const defaultValue = props.defaultValue || {};
      return {
        searchText: defaultValue.value,
        selectedItem: defaultValue.selectedItem,
        defaultSelectedItem: defaultValue.selectedItem,
      };
    }

    return state;
  };

  handleInputFocus = () => {
    this.setState({
      isShowingList: true,
    });
  };

  handleInputBlur = () => {
    setTimeout(() => {
      this.setState({
        isShowingList: false,
      });
    }, 200);
  };

  debounceOnChange = (value) => {
    const matchData = this.state.sourceList.filter((item) => {
      return `${item.name}`
        .toLocaleLowerCase()
        .includes(`${value}`.toLocaleLowerCase());
    });
    this.setState({
      searchText: value,
      matchedList: matchData,
    });
  };

  handleOnChange = (event) => {
    if (event.key === "Enter") {
      return;
    }
    this.debounceOnChange(event.target.value);
  };

  render() {
    const userProperties =
      this.props.getActiveUserProperties &&
      this.props.getActiveUserProperties();

    const savedEditor = this.props.editor;
    let isSameEditor = true;
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor = userProperties.userId === savedEditor.userId;
    }

    const props = {};
    props.type = "text";
    props.className = "form-control";
    props.name = this.props.data.field_name;
    props.value = this.state.searchText;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = "SortableItem rfb-item";
    if (this.props.data.pageBreakBefore) {
      baseClasses += " alwaysbreak";
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} style={{ display: "block" }} />
          <div
            style={{
              position: "relative",
              display: "inline-block",
              width: "100%",
            }}
          >
            <div>
              <input
                {...props}
                disabled={!isSameEditor}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleOnChange}
              />
            </div>
            <div
              style={{
                position: "absolute",
                zIndex: 99,
                top: "100%",
                left: 0,
                right: 0,
                height: 250,
                overflowY: "auto",
                display: this.state.isShowingList ? "block" : "none",
              }}
            >
              {(this.state.matchedList || []).map((item) => {
                return (
                  <div
                    key={item.id}
                    style={{
                      position: "relative",
                      display: "block",
                      padding: "0.75rem 1.25rem",
                      marginBottom: -1,
                      backgroundColor: "#fff",
                      border: "1px solid rgba(0, 0, 0, 0.125)",
                    }}
                    onClick={() => {
                      this.setState({
                        selectedItem: item,
                        searchText: item.name,
                      });
                    }}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// function DataSource(props) {
//   const inputField = useRef();
//   const defaultValue = props.defaultValue || {};

//   const [sourceList, setSourceList] = useState([]);
//   const [matchedList, setMatchedList] = useState([]);
//   const [searchText, setSearchText] = useState(defaultValue.value);
//   const [selectedItem, setSelectedItem] = useState(defaultValue.selectedItem);
//   const [defaultSelectedItem, setDefaultSelectedItem] = useState(
//     defaultValue.selectedItem
//   );
//   const [isShowingList, setIsShowingList] = useState(false);
//   const [sourceType, setSourceType] = useState(props.data.sourceType);

//   useEffect(() => {
//     async function fetchData() {
//       if (typeof props.getDataSource === "function") {
//         const data = await props.getDataSource(props.data);
//         setSourceList(data);
//         setMatchedList(data);
//       }
//     }

//     fetchData();
//   }, [props]);

//   useEffect(() => {
//     if (
//       props.defaultValue &&
//       JSON.stringify(props.defaultValue.selectedItem) !==
//         JSON.stringify(defaultSelectedItem)
//     ) {
//       const defaultValue = props.defaultValue || {};
//       setSearchText(defaultValue.value);
//       setSelectedItem(defaultValue.selectedItem);
//       setDefaultSelectedItem(defaultValue.selectedItem);
//     }
//   }, [props, defaultSelectedItem]);

//   const handleInputFocus = () => {
//     setIsShowingList(true);
//   };

//   const handleInputBlur = () => {
//     setTimeout(() => {
//       setIsShowingList(false);
//     }, 200);
//   };

//   const debounceOnChange = (value) => {
//     const matchData = sourceList.filter((item) =>
//       item.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setSearchText(value);
//     setMatchedList(matchData);
//   };

//   const handleOnChange = (event) => {
//     if (event.key === "Enter") {
//       return;
//     }
//     debounceOnChange(event.target.value);
//   };

//   const userProperties =
//     props.getActiveUserProperties && props.getActiveUserProperties();

//   const savedEditor = props.editor;
//   let isSameEditor = true;
//   if (savedEditor && savedEditor.userId && !!userProperties) {
//     isSameEditor = userProperties.userId === savedEditor.userId;
//   }

//   const baseClasses =
//     "SortableItem rfb-item" +
//     (props.data.pageBreakBefore ? " alwaysbreak" : "");

//   const inputProps = {
//     type: "text",
//     className: "form-control",
//     name: props.data.field_name,
//     value: searchText,
//   };

//   if (props.mutable) {
//     inputProps.defaultValue = props.defaultValue;
//     inputProps.ref = inputField;
//   }

//   return (
//     <div className={baseClasses}>
//       <ComponentHeader {...props} />
//       <div className="form-group">
//         <ComponentLabel {...props} style={{ display: "block" }} />
//         <div
//           style={{
//             position: "relative",
//             display: "inline-block",
//             width: "100%",
//           }}
//         >
//           <div>
//             <input
//               {...inputProps}
//               disabled={!isSameEditor}
//               onFocus={handleInputFocus}
//               onBlur={handleInputBlur}
//               onChange={handleOnChange}
//             />
//           </div>
//           <div
//             style={{
//               position: "absolute",
//               zIndex: 99,
//               top: "100%",
//               left: 0,
//               right: 0,
//               height: 250,
//               overflowY: "auto",
//               display: isShowingList ? "block" : "none",
//             }}
//           >
//             {(matchedList || []).map((item) => {
//               return (
//                 <div
//                   key={item.id}
//                   style={{
//                     position: "relative",
//                     display: "block",
//                     padding: "0.75rem 1.25rem",
//                     marginBottom: -1,
//                     backgroundColor: "#fff",
//                     border: "1px solid rgba(0, 0, 0, 0.125)",
//                   }}
//                   onClick={() => {
//                     setSelectedItem(item);
//                     setSearchText(item.name);
//                   }}
//                 >
//                   {item.name}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default DataSource;
