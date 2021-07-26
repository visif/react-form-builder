import React from 'react';
class Tables extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            items: []
        }
    }

    updateMessage(event) {
        this.setState({
            message: event.target.value
        });
    }

    handleClick() {
        var items = this.state.items;

        items.push(this.state.message);

        this.setState({
            items: items,
            message: ""
        });
    }

    handleItemChanged(i, event) {
        var items = this.state.items;
        items[i] = event.target.value;

        this.setState({
            items: items
        });
    }

    handleItemDeleted(i) {
        var items = this.state.items;

        items.splice(i, 1);

        this.setState({
            items: items
        });
    }

    renderRows() {
        var context = this;

        return this.state.items.map(function (o, i) {
            return (
                <tr key={"item-" + i}>
                    <td>
                        <input
                            type="text"
                            value={o}
                            onChange={context.handleItemChanged.bind(context, i)}
                        />
                    </td>
                    <td>
                        <button
                            onClick={context.handleItemDeleted.bind(context, i)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            );
        });
    }
}
export default Tables
