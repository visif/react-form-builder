# Class to Hooks Conversion Guide

This guide provides patterns and examples for converting class components to functional components with hooks.

---

## Table of Contents

1. [Basic Conversion Pattern](#basic-conversion-pattern)
2. [State Management](#state-management)
3. [Lifecycle Methods](#lifecycle-methods)
4. [Event Handlers](#event-handlers)
5. [Refs](#refs)
6. [Context](#context)
7. [Common Pitfalls](#common-pitfalls)
8. [Examples from this Project](#examples-from-this-project)

---

## Basic Conversion Pattern

### Before (Class Component)
```jsx
import React from 'react';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      name: ''
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={this.handleClick}>Click</button>
      </div>
    );
  }
}

export default MyComponent;
```

### After (Functional Component)
```jsx
import React, { useState } from 'react';

const MyComponent = (props) => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>Click</button>
    </div>
  );
};

export default MyComponent;
```

---

## State Management

### Multiple State Variables

**Class:**
```jsx
constructor(props) {
  super(props);
  this.state = {
    count: 0,
    name: '',
    items: [],
    loading: false
  };
}

// Update state
this.setState({ count: 1 });
this.setState({ name: 'John' });
```

**Hooks:**
```jsx
// Option 1: Separate state variables (recommended for independent state)
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);

// Update state
setCount(1);
setName('John');

// Option 2: Single state object (if state is related)
const [state, setState] = useState({
  count: 0,
  name: '',
  items: [],
  loading: false
});

// Update state (must spread previous state!)
setState(prev => ({ ...prev, count: 1 }));
```

### Complex State Updates

**Class:**
```jsx
this.setState((prevState) => ({
  count: prevState.count + 1,
  items: [...prevState.items, newItem]
}));
```

**Hooks:**
```jsx
setCount(prev => prev + 1);
setItems(prev => [...prev, newItem]);

// Or with object state:
setState(prev => ({
  ...prev,
  count: prev.count + 1,
  items: [...prev.items, newItem]
}));
```

---

## Lifecycle Methods

### componentDidMount

**Class:**
```jsx
componentDidMount() {
  this.fetchData();
  window.addEventListener('resize', this.handleResize);
}
```

**Hooks:**
```jsx
useEffect(() => {
  fetchData();
  window.addEventListener('resize', handleResize);

  // Cleanup (like componentWillUnmount)
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // Empty array = run once on mount
```

### componentDidUpdate

**Class:**
```jsx
componentDidUpdate(prevProps, prevState) {
  if (prevProps.userId !== this.props.userId) {
    this.fetchUser(this.props.userId);
  }

  if (prevState.count !== this.state.count) {
    this.updateTitle(this.state.count);
  }
}
```

**Hooks:**
```jsx
// Watch specific dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId]); // Only runs when userId changes

useEffect(() => {
  updateTitle(count);
}, [count]); // Only runs when count changes
```

### componentWillUnmount

**Class:**
```jsx
componentWillUnmount() {
  this.clearTimers();
  this.unsubscribe();
}
```

**Hooks:**
```jsx
useEffect(() => {
  // Setup code here

  return () => {
    // Cleanup runs on unmount
    clearTimers();
    unsubscribe();
  };
}, []);
```

### Combined Lifecycles

**Class:**
```jsx
componentDidMount() {
  this.subscribe();
}

componentDidUpdate(prevProps) {
  if (prevProps.id !== this.props.id) {
    this.unsubscribe();
    this.subscribe();
  }
}

componentWillUnmount() {
  this.unsubscribe();
}
```

**Hooks:**
```jsx
useEffect(() => {
  subscribe();

  return () => {
    unsubscribe();
  };
}, [id]); // Automatically handles mount, update, and unmount
```

---

## Event Handlers

### Method Binding

**Class:**
```jsx
constructor(props) {
  super(props);
  this.handleClick = this.handleClick.bind(this);
}

handleClick(e) {
  this.setState({ clicked: true });
}

// Or with class fields:
handleClick = (e) => {
  this.setState({ clicked: true });
}
```

**Hooks:**
```jsx
// No binding needed!
const handleClick = (e) => {
  setClicked(true);
};

// Or with useCallback for optimization:
const handleClick = useCallback((e) => {
  setClicked(true);
}, []); // Dependencies array
```

### Handlers with Parameters

**Class:**
```jsx
handleDelete = (id) => {
  this.setState({
    items: this.state.items.filter(item => item.id !== id)
  });
}

render() {
  return (
    <button onClick={() => this.handleDelete(item.id)}>Delete</button>
  );
}
```

**Hooks:**
```jsx
const handleDelete = (id) => {
  setItems(items => items.filter(item => item.id !== id));
};

return (
  <button onClick={() => handleDelete(item.id)}>Delete</button>
);

// Or with useCallback:
const handleDelete = useCallback((id) => {
  setItems(items => items.filter(item => item.id !== id));
}, []);
```

---

## Refs

### DOM References

**Class:**
```jsx
constructor(props) {
  super(props);
  this.inputRef = React.createRef();
}

componentDidMount() {
  this.inputRef.current.focus();
}

render() {
  return <input ref={this.inputRef} />;
}
```

**Hooks:**
```jsx
const inputRef = useRef(null);

useEffect(() => {
  inputRef.current.focus();
}, []);

return <input ref={inputRef} />;
```

### Instance Variables (non-state values)

**Class:**
```jsx
constructor(props) {
  super(props);
  this.timerId = null;
}

startTimer() {
  this.timerId = setInterval(() => {
    // ...
  }, 1000);
}

componentWillUnmount() {
  clearInterval(this.timerId);
}
```

**Hooks:**
```jsx
const timerIdRef = useRef(null);

const startTimer = () => {
  timerIdRef.current = setInterval(() => {
    // ...
  }, 1000);
};

useEffect(() => {
  return () => {
    clearInterval(timerIdRef.current);
  };
}, []);
```

---

## Context

### Consuming Context

**Class:**
```jsx
class MyComponent extends React.Component {
  static contextType = MyContext;

  render() {
    const value = this.context;
    return <div>{value}</div>;
  }
}
```

**Hooks:**
```jsx
const MyComponent = () => {
  const value = useContext(MyContext);
  return <div>{value}</div>;
};
```

---

## Common Pitfalls

### ❌ Pitfall 1: Forgetting to spread state in object updates

```jsx
// WRONG - This will replace the entire state object!
setState({ count: 1 }); // Other properties lost!

// CORRECT
setState(prev => ({ ...prev, count: 1 }));

// BETTER - Use separate state variables
const [count, setCount] = useState(0);
setCount(1);
```

### ❌ Pitfall 2: Missing dependencies in useEffect

```jsx
// WRONG - Missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId is missing!

// CORRECT
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### ❌ Pitfall 3: Using state directly in updaters

```jsx
// PROBLEMATIC - May use stale state
const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1); // Still uses old count!
};

// CORRECT - Use functional updates
const handleClick = () => {
  setCount(c => c + 1);
  setCount(c => c + 1); // Correctly increments twice
};
```

### ❌ Pitfall 4: Creating functions inside useEffect without useCallback

```jsx
// PROBLEMATIC - Function recreated on every render
const handleResize = () => {
  // ...
};

useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []); // Missing dependency!

// CORRECT
const handleResize = useCallback(() => {
  // ...
}, []);

useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [handleResize]);
```

---

## Examples from this Project

### Example 1: DynamicOptionList

**Before:**
```jsx
export default class DynamicOptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
    };
  }

  _setValue(text) {
    return text.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
  }

  editOption(option_index, e) {
    const this_element = this.state.element;
    const val = (this_element.options[option_index].value !== this._setValue(this_element.options[option_index].text)) ? this_element.options[option_index].value : this._setValue(e.target.value);

    this_element.options[option_index].text = e.target.value;
    this_element.options[option_index].value = val;
    this.setState({
      element: this_element,
      dirty: true,
    });
  }

  // ... more methods
}
```

**After:**
```jsx
const DynamicOptionList = ({ element: initialElement, data, updateElement }) => {
  const [element, setElement] = useState(initialElement);
  const [dirty, setDirty] = useState(false);

  const _setValue = useCallback((text) => {
    return text.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
  }, []);

  const editOption = useCallback((option_index, e) => {
    setElement(prevElement => {
      const newElement = { ...prevElement };
      const val = (newElement.options[option_index].value !== _setValue(newElement.options[option_index].text))
        ? newElement.options[option_index].value
        : _setValue(e.target.value);

      newElement.options[option_index] = {
        ...newElement.options[option_index],
        text: e.target.value,
        value: val
      };

      return newElement;
    });
    setDirty(true);
  }, [_setValue]);

  // Effect to notify parent of changes
  useEffect(() => {
    if (dirty) {
      updateElement(element);
    }
  }, [element, dirty, updateElement]);

  // ... rest of component
};

export default DynamicOptionList;
```

### Example 2: Simple Form Element (Header)

**Before:**
```jsx
class Header extends React.Component {
  render() {
    let headerClasses = `dynamic-input ${this.props.data.element}`;
    let classNames = 'static';
    if (this.props.data.bold) { classNames += ' bold'; }
    if (this.props.data.italic) { classNames += ' italic'; }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <ComponentLabel {...this.props} />
        <h3 className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.data.content) }} />
      </div>
    );
  }
}
```

**After:**
```jsx
const Header = ({ data, ...props }) => {
  const headerClasses = useMemo(() =>
    `dynamic-input ${data.element}`,
    [data.element]
  );

  const classNames = useMemo(() => {
    let classes = 'static';
    if (data.bold) classes += ' bold';
    if (data.italic) classes += ' italic';
    return classes;
  }, [data.bold, data.italic]);

  const baseClasses = useMemo(() => {
    let classes = 'SortableItem rfb-item';
    if (data.pageBreakBefore) classes += ' alwaysbreak';
    return classes;
  }, [data.pageBreakBefore]);

  return (
    <div className={baseClasses}>
      <ComponentHeader data={data} {...props} />
      <ComponentLabel data={data} {...props} />
      <h3
        className={classNames}
        dangerouslySetInnerHTML={{ __html: myxss.process(data.content) }}
      />
    </div>
  );
};

export default Header;
```

### Example 3: Component with Lifecycle (Toolbar)

**Before:**
```jsx
export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items || [],
    };
    this.create = this.create.bind(this);
  }

  componentDidMount() {
    if (this.props.items) {
      this.setState({ items: this.props.items });
    } else {
      store.subscribe(state => this.setState({ items: state.items }));
    }
  }

  create(item) {
    store.dispatch('create', item);
  }

  render() {
    return (
      <div className="react-form-builder-toolbar">
        <h4>Toolbox</h4>
        <ul>
          {this.state.items.map(item => (
            <ToolbarItem key={item.key} data={item} onClick={this.create} />
          ))}
        </ul>
      </div>
    );
  }
}
```

**After:**
```jsx
const Toolbar = ({ items: propItems, customItems }) => {
  const [items, setItems] = useState(propItems || []);

  useEffect(() => {
    if (propItems) {
      setItems(propItems);
    } else {
      const unsubscribe = store.subscribe(state => {
        setItems(state.items);
      });
      return unsubscribe;
    }
  }, [propItems]);

  const create = useCallback((item) => {
    store.dispatch('create', item);
  }, []);

  return (
    <div className="react-form-builder-toolbar">
      <h4>Toolbox</h4>
      <ul>
        {items.map(item => (
          <ToolbarItem key={item.key} data={item} onClick={create} />
        ))}
      </ul>
    </div>
  );
};

export default Toolbar;
```

---

## Optimization Tips

### When to use useMemo

```jsx
// GOOD - Expensive calculation
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.value - b.value);
}, [items]);

// UNNECESSARY - Simple operation
const fullName = useMemo(() =>
  `${firstName} ${lastName}`,
  [firstName, lastName]
); // Overkill! Just do: const fullName = `${firstName} ${lastName}`;
```

### When to use useCallback

```jsx
// GOOD - Passed to child components that use React.memo
const MemoizedChild = React.memo(Child);

const Parent = () => {
  const handleClick = useCallback(() => {
    // ...
  }, []);

  return <MemoizedChild onClick={handleClick} />;
};

// UNNECESSARY - Not passed as prop or used in dependencies
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // Overkill if not passed to memoized child
```

---

## Testing Checklist

After converting each component:

- [ ] Component renders without errors
- [ ] Props are handled correctly
- [ ] State updates work as expected
- [ ] Event handlers fire correctly
- [ ] Lifecycle behavior is preserved
- [ ] No memory leaks (cleanup functions work)
- [ ] No console warnings
- [ ] Child components receive correct props
- [ ] Component behaves identically to class version

---

## Quick Reference

| Class Component | Hooks Equivalent |
|----------------|------------------|
| `constructor(props)` | `const [state, setState] = useState()` |
| `this.state` | `state` |
| `this.setState()` | `setState()` |
| `componentDidMount()` | `useEffect(() => {}, [])` |
| `componentDidUpdate()` | `useEffect(() => {}, [deps])` |
| `componentWillUnmount()` | `useEffect(() => { return () => {} }, [])` |
| `this.method.bind(this)` | Not needed (arrow functions) |
| `this.props` | `props` |
| `this.context` | `useContext()` |
| `this.myRef = React.createRef()` | `const myRef = useRef()` |

---

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Hooks FAQ](https://react.dev/reference/react/hooks)
- [useEffect Complete Guide](https://overreacted.io/a-complete-guide-to-useeffect/)

---

Good luck with the conversion! Remember: **One component at a time, test thoroughly, commit often!** 🚀
