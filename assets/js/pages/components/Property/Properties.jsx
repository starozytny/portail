import React, { Component } from "react";

export class Properties extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: JSON.parse(props.donnees)
        }
    }

    render () {
        const { data } = this.state;

        console.log(data)

        return <div>Hello</div>
    }
}